import Fuse, { FuseResultMatch, IFuseOptions } from 'fuse.js';
import { ActionImpl, Priority, useKBar } from 'kbar';
import { useThrottledValue } from 'kbar/lib/utils';
import * as React from 'react';
import { getAllCombinations } from '../utils';
import { BookmarkSection, isBookmarkPrompt } from './useBookmarkActions';
import { CommandSection, isCommandPrompt } from './useCommandActions';
import { HistorySection, isHistoryPrimpt } from './useHistoryActions';
import { OpenedTabSection, isOpenedTabPrompt } from './useOpenedTabActions';
import {
  QuickSearchSection,
  isQuickSearchPrompt,
} from './useQuickSearchActions';
import { isActionPrompt, isPrompt } from '.';

// From: https://github.com/timc1/kbar/blob/main/src/useMatches.tsx
export const NO_GROUP = {
  name: 'none',
  priority: Priority.NORMAL,
};

const fuseOptions: IFuseOptions<ActionImpl> = {
  keys: [
    {
      name: 'name',
      weight: 0.4,
    },
    {
      name: 'subtitle',
      weight: 0.4,
    },
    {
      name: 'keywords',
      getFn: (item: { keywords: any }) => (item.keywords ?? '').split(','),
      weight: 0.2,
    },
  ],
  /**
   * Indicates whether comparisons should be case sensitive.
   */
  isCaseSensitive: false,
  /**
   * Whether the score should be included in the result set. A score of 0indicates a perfect match, while a score of 1 indicates a complete mismatch.
   */
  includeScore: true,
  /**
   * Whether the matches should be included in the result set. When true, each record in the result set will include the indices of the matched characters. These can consequently be used for highlighting purposes.
   */
  includeMatches: true,
  /**
   * Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to 2).
   */
  minMatchCharLength: 1,
  /**
   *  Whether to sort the result list, by score.
   */
  shouldSort: true,
  /**
   * When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string.
   */
  findAllMatches: false,
  /**
   * Determines approximately where in the text is the pattern expected to be found.
   */
  location: 0,
  /**
   * At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
   */
  //   threshold: 0.5,
  threshold: 0.0,
  /**
   * Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8.
   */
  distance: 100,
  /**
   * When true, search will ignore location and distance, so it won't matter where in the string the pattern appears.
   */
  ignoreLocation: true,
  /**
   * When true, it enables the use of unix-like search commands. See example https://www.fusejs.io/examples.html#extended-search.
   */
  useExtendedSearch: true,
  /**
   * When true, the calculation for the relevance score (used for sorting) will ignore the field-length norm.
   *
   * TIP: The only time it makes sense to set ignoreFieldNorm to true is when it does not matter how many terms there are, but only that the query term exists.
   */
  ignoreFieldNorm: false,
  fieldNormWeight: 1,
};

function order(a: { priority: number }, b: { priority: number }) {
  /**
   * Larger the priority = higher up the list
   */
  return b.priority - a.priority;
}

type SectionName = string;

/**
 * returns deep matches only when a search query is present
 */
export function useMatches() {
  const { search, actions, rootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    actions: state.actions,
    rootActionId: state.currentRootActionId,
  }));

  const rootResults = React.useMemo(() => {
    return Object.keys(actions)
      .reduce((acc, actionId) => {
        const action = actions[actionId];
        if (!action.parent && !rootActionId) {
          acc.push(action);
        }
        if (action.id === rootActionId) {
          for (let i = 0; i < action.children.length; i++) {
            acc.push(action.children[i]);
          }
        }
        return acc;
      }, [] as ActionImpl[])
      .sort(order);
  }, [actions, rootActionId]);

  const getDeepResults = React.useCallback((actions: ActionImpl[]) => {
    let actionsClone: ActionImpl[] = [];
    for (let i = 0; i < actions.length; i++) {
      actionsClone.push(actions[i]);
    }
    return (function collectChildren(
      actions: ActionImpl[],
      all = actionsClone,
    ) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children.length > 0) {
          let childsChildren = actions[i].children;
          for (let i = 0; i < childsChildren.length; i++) {
            all.push(childsChildren[i]);
          }
          collectChildren(actions[i].children, all);
        }
      }
      return all;
    })(actions);
  }, []);

  const emptySearch = !search;

  const filtered = React.useMemo(() => {
    if (emptySearch) return rootResults;
    return getDeepResults(rootResults);
  }, [getDeepResults, rootResults, emptySearch]);

  const fuse = React.useMemo(() => new Fuse(filtered, fuseOptions), [filtered]);

  const matches = useInternalMatches(filtered, search, fuse);

  const results = React.useMemo(() => {
    /**
     * Store a reference to a section and it's list of actions.
     * Alongside these actions, we'll keep a temporary record of the
     * final priority calculated by taking the commandScore + the
     * explicitly set `action.priority` value.
     */
    let map: Record<
      SectionName,
      {
        priority: number;
        action: {
          action: ActionImpl;
          matches?: readonly FuseResultMatch[];
        };
      }[]
    > = {};
    /**
     * Store another reference to a list of sections alongside
     * the section's final priority, calculated the same as above.
     */
    let list: { priority: number; name: SectionName }[] = [];
    /**
     * We'll take the list above and sort by its priority. Then we'll
     * collect all actions from the map above for this specific name and
     * sort by its priority as well.
     */
    let ordered: {
      name: SectionName;
      actions: {
        action: ActionImpl;
        matches?: readonly FuseResultMatch[];
      }[];
    }[] = [];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const action = match.action;
      const score = match.score || Priority.NORMAL;

      const section = {
        name:
          typeof action.section === 'string'
            ? action.section
            : action.section?.name || NO_GROUP.name,
        priority:
          typeof action.section === 'string'
            ? score
            : action.section?.priority || 0 + score,
      };

      if (!map[section.name]) {
        map[section.name] = [];
        list.push(section);
      }

      map[section.name].push({
        priority: action.priority + score,
        action: {
          action,
          matches: match?.matches,
        },
      });
    }

    ordered = list.sort(order).map((group) => ({
      name: group.name,
      actions: map[group.name].sort(order).map((item) => item.action),
    }));

    /**
     * Our final result is simply flattening the ordered list into
     * our familiar (ActionImpl | string)[] shape.
     */
    let results: (
      | string
      | {
          action: ActionImpl;
          matches?: readonly FuseResultMatch[];
        }
    )[] = [];
    for (let i = 0; i < ordered.length; i++) {
      let group = ordered[i];
      if (group.name !== NO_GROUP.name) results.push(group.name);
      for (let i = 0; i < group.actions.length; i++) {
        results.push({
          action: group.actions[i].action,
          matches: group.actions[i].matches,
        });
      }
    }
    return results;
  }, [matches]);

  // ensure that users have an accurate `currentRootActionId`
  // that syncs with the throttled return value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoRootActionId = React.useMemo(() => rootActionId, [results]);

  return React.useMemo(
    () => ({
      results,
      rootActionId: memoRootActionId,
    }),
    [memoRootActionId, results],
  );
}

type Match = {
  action: ActionImpl;
  /**
   * Represents the commandScore matchiness value which we use
   * in addition to the explicitly set `action.priority` to
   * calculate a more fine tuned fuzzy search.
   */
  score: number;
  matches?: readonly FuseResultMatch[];
};

function useInternalMatches(
  filtered: ActionImpl[],
  search: string,
  fuse: Fuse<ActionImpl>,
) {
  const value = React.useMemo(
    () => ({
      filtered,
      search,
    }),
    [filtered, search],
  );

  const { filtered: throttledFiltered, search: throttledSearch } =
    useThrottledValue(value);

  return React.useMemo(() => {
    if (throttledSearch.trim() === '') {
      return throttledFiltered.map((action) => ({ score: 0, action }));
    }

    let matches: Match[] = [];
    // Use Fuse's `search` method to perform the search efficiently
    let words = throttledSearch?.trim()?.split(' ');
    let wordCombinations = getAllCombinations(words);

    let query: any = {
      $or: [
        // all in name
        { $and: words?.map((word) => ({ name: word })) },
        // all in subtitle
        { $and: words?.map((word) => ({ subtitle: word })) },
        // name or subtitle
        ...wordCombinations?.map((words) => ({
          name: words[0],
          subtitle: words[1],
        })),
      ],
    };

    if (isPrompt(throttledSearch) && !isActionPrompt(throttledSearch)) {
      if (words.length === 1) {
        query = { keywords: words[0] };
      } else {
        let keywordPattern = { keywords: words[0] };

        words = words.slice(1);
        let wordCombinations = getAllCombinations(words);
        query = {
          $or: [
            // all in name
            { $and: words?.map((word) => ({ name: word, ...keywordPattern })) },
            // all in subtitle
            {
              $and: words?.map((word) => ({
                subtitle: word,
                ...keywordPattern,
              })),
            },
            // name or subtitle
            ...wordCombinations?.map((words) => ({
              name: words[0],
              subtitle: words[1],
              ...keywordPattern,
            })),
          ],
        };
      }
    } else if (isActionPrompt(throttledSearch)) {
      if (isQuickSearchPrompt(throttledSearch)) {
        query = { keywords: words[0] };
      } else {
        query = {
          $and: words?.map((word) => ({ keywords: word })),
        };
      }
    }

    const searchResults = fuse.search(query);

    // Format the search results to match the existing structure
    matches = searchResults
      .filter(({ item: action }) => {
        if (isQuickSearchPrompt(throttledSearch)) {
          if (typeof action?.section === 'string') {
            return action.section === QuickSearchSection;
          } else {
            return action.section?.name === QuickSearchSection;
          }
        } else if (isCommandPrompt(throttledSearch)) {
          if (typeof action?.section === 'string') {
            return action.section === CommandSection;
          } else {
            return action.section?.name === CommandSection;
          }
        } else if (isOpenedTabPrompt(throttledSearch)) {
          if (typeof action?.section === 'string') {
            return action.section === OpenedTabSection;
          } else {
            return action.section?.name === OpenedTabSection;
          }
        } else if (isBookmarkPrompt(throttledSearch)) {
          if (typeof action?.section === 'string') {
            return action.section === BookmarkSection;
          } else {
            return action.section?.name === BookmarkSection;
          }
        } else if (isHistoryPrimpt(throttledSearch)) {
          if (typeof action?.section === 'string') {
            return action.section === HistorySection;
          } else {
            return action.section?.name === HistorySection;
          }
        }
        return true;
      })
      .map(({ item: action, score, matches }) => ({
        score: 1 / ((score ?? 0) + 1), // Convert the Fuse score to the format used in the original code
        action,
        matches,
      }));
    return matches;
  }, [throttledFiltered, throttledSearch, fuse]) as Match[];
}

/**
 * @deprecated use useMatches
 */
export const useDeepMatches = useMatches;
