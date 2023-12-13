import { Action, Priority, useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';

export const OpenedTabSection = 'Opened Tab';

export const isOpenedTabPrompt = (text: string) => text.startsWith('/o');

export default function useOpenedTabActions() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [listening, setListening] = useState<boolean>(false);
  const actions = useMemo(() => {
    return tabs?.map(
      (tab): Action => ({
        id: `${tab.windowId} ${tab?.id?.toString()}`,
        name: tab?.title ?? '',
        section: {
          name: OpenedTabSection,
          priority: Priority.HIGH,
        },
        subtitle: tab?.url,
        priority: 100,
        keywords: '/o',
        icon: tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="icon" width={16} height={16} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width={16}
            height={16}
            style={{
              width: 16,
              height: 16,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        ),
        perform: (action) => {
          const [windowId, tabId] = action.id.split(' ');
          if (tabId) {
            chrome.runtime.sendMessage({
              type: 'activeTab',
              tabId: Number(tabId),
              windowId: Number(windowId),
            });
          }
        },
      }),
    );
  }, [tabs]);

  useRegisterActions(actions, [actions]);

  useEffect(() => {
    const fetchData = () => {
      chrome.runtime.sendMessage(
        {
          type: 'listTabs',
        },
        function (tabs: chrome.tabs.Tab[]) {
          setTabs(tabs);
        },
      );
    };

    if (!listening) {
      chrome.runtime.onMessage.addListener((message: any) => {
        if (message.type === 'tabUpdated') {
          fetchData();
        }
      });
      setListening(true);
    }

    fetchData();
  }, []);
}
