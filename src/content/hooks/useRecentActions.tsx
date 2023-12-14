import { Action, useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';
import { DefaultSvg } from '../../components/icons';

export const RecentSection = 'Recent';

export const useRecentActions = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [listening, setListening] = useState<boolean>(false);
  const actions = useMemo(() => {
    return tabs?.map(
      (tab): Action => ({
        id: `recent-${tab.windowId}_${tab?.id?.toString()}`,
        name: tab?.title ?? '',
        section: {
          name: RecentSection,
          priority: 2,
        },
        subtitle: tab?.url,
        priority: 100,
        icon: tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="icon" width={16} height={16} />
        ) : (
          <DefaultSvg />
        ),
        perform: (action) => {
          const [windowId, tabId] = action.id?.replace('recent-', '')?.split('_');
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
          type: 'recentTabs',
        },
        function (tabs: chrome.tabs.Tab[]) {
          setTabs(tabs);
        },
      );
    };

    if (!listening) {
      chrome.runtime.onMessage.addListener((message: any) => {
        if (message.type === 'tabTabActive') {
          fetchData();
        }
      });
      setListening(true);
    }

    fetchData();
  }, []);
};
