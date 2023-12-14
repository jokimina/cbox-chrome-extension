import { Action, Priority, useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';
import { DefaultSvg } from '../../components/icons';

export const OpenedTabSection = 'Opened Tab';

export const isOpenedTabPrompt = (text: string) => text.startsWith('/o');

export default function useOpenedTabActions() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [listening, setListening] = useState<boolean>(false);
  const actions = useMemo(() => {
    return tabs?.map(
      (tab): Action => ({
        id: `opened-tab-${tab.windowId}_${tab?.id?.toString()}`,
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
          <DefaultSvg />
        ),
        perform: (action) => {
          const [windowId, tabId] = action.id
            ?.replace('opened-tab-', '')
            ?.split('_');
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
