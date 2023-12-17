import dayjs from 'dayjs';
import { deduplicateArrayByProperty } from './content/utils';

class storageService {
  static previousLimit = 10;

  static setPreviousTab(tab: chrome.tabs.TabActiveInfo) {
    storageService.listPreviousTabs((previousTabs) => {
      previousTabs?.unshift(tab);
      previousTabs = deduplicateArrayByProperty(previousTabs, 'tabId');
      if (previousTabs?.length > storageService.previousLimit) {
        previousTabs.pop();
      }
      chrome.storage.local.set({
        previousTabs,
      });
    });
  }

  static removePreviousTab(tabId: number, callback: () => void) {
    storageService.listPreviousTabs((previousTabs) => {
      previousTabs?.splice(
        previousTabs.findIndex((tab) => tab.tabId === tabId),
        1,
      );
      chrome.storage.local.set(
        {
          previousTabs,
        },
        callback,
      );
    });
  }

  static listPreviousTabs(
    callback: (tab: chrome.tabs.TabActiveInfo[]) => void,
  ) {
    chrome.storage.local.get('previousTabs', (result) => {
      callback(result?.previousTabs?.filter((tab: any) => tab) ?? []);
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message?.type) {
    case 'openDownload':
      chrome.tabs.create({
        url: 'chrome://downloads/',
      });
      break;
    case 'listTabs':
      chrome.tabs.query({}, (tabs) => {
        sendResponse(tabs);
      });
      break;
    case 'recentTabs':
      chrome.tabs.query({}, (tabs) => {
        storageService.listPreviousTabs((recentTabs) => {
          sendResponse(
            recentTabs
              .map(
                (activeTab) => tabs.find((tab) => tab.id === activeTab.tabId)!,
              )
              .filter((tab) => tab),
          );
        });
      });
      break;
    case 'newTab':
      chrome.tabs.create({
        url: message.url ?? 'https://www.google.com',
      });
      break;
    case 'togglePinTab':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id!, {
          pinned: !tabs[0].pinned,
        });
      });
      break;
    case 'activeTab':
      chrome.windows.update(message.windowId!, {
        focused: true,
      });
      chrome.tabs.update(message.tabId!, {
        active: true,
      });
      break;
    case 'replicateTab':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.create({
          index: tabs[0].index + 100,
          url: tabs[0].url,
          active: true,
        });
      });
      break;
    case 'goBackTab':
      storageService.listPreviousTabs((tabs) => {
        if (!tabs) return;
        const tab = tabs[1];
        chrome.windows.update(tab.windowId, { focused: true });
        chrome.tabs.update(tab.tabId, { active: true });
      });
      break;
    case 'closeLeftTabs':
      let lActiveIndex = -1;
      chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(function (tab) {
          if (tab.active) {
            lActiveIndex = tab.index;
          }
        });

        tabs.forEach(function (tab) {
          if (tab.index < lActiveIndex && !tab.pinned) {
            chrome.tabs.remove(tab.id!);
          }
        });
      });

      break;
    case 'closeRightTabs':
      let activeIndex = 10000;
      chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(function (tab) {
          if (tab.active) {
            activeIndex = tab.index;
          }
          if (tab.index > activeIndex) {
            chrome.tabs.remove(tab.id!);
          }
        });
      });
      break;
    case 'closeOtherTabs':
      chrome.tabs.query(
        { active: false, currentWindow: true },
        function (tabs: chrome.tabs.Tab[]) {
          for (let tab of tabs) {
            if (tab.pinned) continue;
            chrome.tabs.remove(tab.id!);
          }
        },
      );
      break;
    case 'newWindow':
      chrome.windows.create({
        focused: true,
      });
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.update(tab!.id!, {
          active: true,
          url: message?.url ?? 'https://www.google.com',
        });
      });
      break;
    case 'newIncognitoWindow':
      chrome.windows.create({ incognito: true });
      break;
    case 'closeWindow':
      chrome.windows.getCurrent(function (window) {
        chrome.windows.remove(window.id!);
      });
      break;
    case 'closeOtherWindow':
      chrome.windows.getAll(function (windows) {
        for (let window of windows) {
          if (window.focused) continue;
          chrome.windows.remove(window.id!);
        }
      });
      break;
    case 'listHistorys':
      chrome.history.search(
        {
          text: '',
          maxResults: 3000,
          startTime: dayjs().subtract(1, 'month').unix(),
        },
        (historys) => {
          sendResponse(historys);
        },
      );
      break;
    case 'listBookmarks':
      chrome.bookmarks.getTree((bookmarkTree) => {
        sendResponse(bookmarkTree?.[0]?.children || []);
      });
      break;
  }
  return true;
});

const notifyAllTabs = (message: any) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id!, message);
    });
  });
};

const notifyTabUpdate = () => {
  notifyAllTabs({
    type: 'tabUpdated',
  });
};

const notifyTabActive = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (!tabs[0]) return;
    storageService.setPreviousTab({
      tabId: tabs[0].id!,
      windowId: tabs[0].windowId!,
    });
    notifyAllTabs({
      type: 'tabTabActive',
    });
  });
};

chrome.tabs.onCreated.addListener(() => {
  notifyTabUpdate();
});
chrome.tabs.onRemoved.addListener((tabId) => {
  storageService.removePreviousTab(tabId, () => {
    notifyTabUpdate();
  });
});
chrome.tabs.onUpdated.addListener(() => {
  notifyTabUpdate();
  notifyTabActive();
});
chrome.tabs.onActivated.addListener(notifyTabActive);
chrome.windows.onFocusChanged.addListener(notifyTabActive);

const notifyBookmarkUpdate = () => {
  notifyAllTabs({
    type: 'bookmarkUpdated',
  });
};
chrome.bookmarks.onCreated.addListener(notifyBookmarkUpdate);
chrome.bookmarks.onRemoved.addListener(notifyBookmarkUpdate);
chrome.bookmarks.onMoved.addListener(notifyBookmarkUpdate);
chrome.bookmarks.onChanged.addListener(notifyBookmarkUpdate);

const notifyHistoryUpdate = () => {
  notifyAllTabs({
    type: 'historyUpdated',
  });
};
chrome.history.onVisitRemoved.addListener(notifyHistoryUpdate);
chrome.history.onVisited.addListener(notifyHistoryUpdate);
