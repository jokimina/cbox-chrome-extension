import { useKBar, useRegisterActions } from 'kbar';
import {
  BingSvg,
  GithubSvg,
  GoogleSvg,
  RedditSvg,
  TwitterSvg,
} from '../../components/icons';

export const QuickSearchSection = 'Quick Search';

export const isQuickSearchPrompt = (query: string) => query.startsWith('@');

export const useQuickSearchActions = () => {
  const { queryValue } = useKBar((state) => ({
    queryValue: state.searchQuery,
  }));

  const rawValue = queryValue.replace(/^@\w+\s*/, '');

  useRegisterActions(
    [
      {
        id: 'google',
        name: 'Google',
        subtitle: '@g,@google',
        keywords: '@g,@google',
        section: QuickSearchSection,
        icon: <GoogleSvg />,
        perform: () => {
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(rawValue)}`,
            '_blank',
          );
        },
      },
      // bing
      {
        id: 'bing',
        name: 'Bing',
        subtitle: '@b,@bing',
        keywords: '@b,@bing',
        section: QuickSearchSection,
        icon: <BingSvg />,
        perform: () => {
          window.open(
            `https://www.bing.com/search?q=${encodeURIComponent(rawValue)}`,
            '_blank',
          );
        },
      },
      // twitter
      {
        id: 'twitter',
        name: 'Twitter',
        subtitle: '@t,@twitter',
        keywords: '@t,@twitter',
        section: QuickSearchSection,
        icon: <TwitterSvg />,
        perform: () => {
          window.open(
            `https://twitter.com/search?q=${encodeURIComponent(rawValue)}`,
            '_blank',
          );
        },
      },
      // github
      {
        id: 'github',
        name: 'GitHub',
        subtitle: '@gh,@github',
        keywords: '@gh,@github',
        section: QuickSearchSection,
        icon: <GithubSvg />,
        perform: () => {
          window.open(
            `https://github.com/search?type=repositories&q=${encodeURIComponent(rawValue)}`,
            '_blank',
          );
        },
      },
      // reddit
      {
        id: 'reddit',
        name: 'Reddit',
        subtitle: '@r,@reddit',
        keywords: '@r,@reddit',
        section: QuickSearchSection,
        icon: <RedditSvg />,
        perform: () => {
          window.open(
            `https://www.reddit.com/search/?q=${encodeURIComponent(rawValue)}`,
            '_blank',
          );
        },
      },
    ],
    [queryValue],
  );
};
