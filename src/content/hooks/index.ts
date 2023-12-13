import { isBookmarkPrompt } from './useBookmarkActions';
import { isCommandPrompt } from './useCommandActions';
import { isHistoryPrimpt } from './useHistoryActions';
import { isOpenedTabPrompt } from './useOpenedTabActions';
import { isQuickSearchPrompt } from './useQuickSearchActions';

export const isActionPrompt = (text: string) => {
  return isCommandPrompt(text) || isQuickSearchPrompt(text);
};

export const isPrompt = (text: string) => {
  return (
    isActionPrompt(text) ||
    isOpenedTabPrompt(text) ||
    isHistoryPrimpt(text) ||
    isBookmarkPrompt(text)
  );
};
