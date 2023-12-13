import { Action, Priority, useRegisterActions } from 'kbar';
import { useEffect, useMemo, useState } from 'react';

export const BookmarkSection = 'Bookmark';

export const isBookmarkPrompt = (text: string) => text.startsWith('/b');

export default function useBookmarkActions() {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [listening, setListening] = useState<boolean>(false);

  const actions = useMemo<Action[]>(
    () => deepParse(bookmarks, ''),
    [bookmarks],
  );

  useRegisterActions(actions, [actions]);

  useEffect(() => {
    const fetchData = () => {
      chrome.runtime.sendMessage(
        {
          type: 'listBookmarks',
        },
        function (bookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
          setBookmarks(bookmarks || []);
        },
      );
    };
    if (!listening) {
      chrome.runtime.onMessage.addListener((message: any) => {
        if (message.type === 'bookmarkUpdated') {
          fetchData();
        }
      });

      setListening(true);
    }

    fetchData();
  }, []);
}

const deepParse = (
  rootBookmarks: chrome.bookmarks.BookmarkTreeNode[],
  prefix: string,
): Action[] => {
  const resultList: Action[] = [];

  for (let i = 0; i < rootBookmarks?.length; i++) {
    const bookmark = rootBookmarks[i];
    if (bookmark.children) {
      resultList.push(
        ...deepParse(bookmark.children, prefix + bookmark.title + ' / '),
      );
    } else {
      resultList.push({
        id: bookmark.id,
        name: `${prefix} ${bookmark.title}`,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{
              width: '1rem',
              height: '1rem',
            }}
            width={16}
            height={16}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        ),
        section: {
          name: BookmarkSection,
          priority: Priority.NORMAL,
        },
        subtitle: bookmark.url,
        keywords: '/b',
        perform: (action) => {
          chrome.runtime.sendMessage({
            type: 'newTab',
            url: action.subtitle,
          });
        },
      });
    }
  }
  return resultList;
};
