import dayjs from 'dayjs';
import { Action, Priority, useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';

export const HistorySection = 'History';

export const isHistoryPrimpt = (text: string) => text.startsWith('/h');

export default function useHistoryActions() {
  const [historys, setHistorys] = useState<chrome.history.HistoryItem[]>([]);
  const [listening, setListening] = useState<boolean>(false);

  const actions = useMemo(() => {
    return historys?.map(
      (history): Action => ({
        id: history.id,
        name: history?.title ?? '',
        priority: 1,
        section: {
          name: HistorySection,
          priority: Priority.LOW,
        },
        subtitle: `${dayjs(history?.lastVisitTime).format('YYYY-MM-DD')} ${
          history?.url ?? ''
        }`,
        keywords: '/h',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              width: '1rem',
              height: '1rem',
            }}
            width={16}
            height={16}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        perform: (action) => {
          const [_, url] = action?.subtitle?.split(' ') ?? ['', ''];
          chrome.runtime.sendMessage({
            type: 'newTab',
            url: url,
          });
        },
      }),
    );
  }, [historys]);

  useRegisterActions(actions, [actions]);

  useEffect(() => {
    const fetchData = () => {
      chrome.runtime.sendMessage(
        {
          type: 'listHistorys',
        },
        function (historys: chrome.history.HistoryItem[]) {
          setHistorys(historys);
        },
      );
    };
    if (!listening) {
      chrome.runtime.onMessage.addListener((message: any) => {
        if (message.type === 'historyUpdated') {
          fetchData();
        }
      });
      setListening(true);
    }
    fetchData();
  }, []);
}
