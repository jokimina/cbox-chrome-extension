interface Config {
  shortcut: string;
}

export const setConfig = (config: Config) => {
  chrome.storage.sync.set({ config });
};

export const getConfig = async () => {
  const { config = {
    shortcut: 'Control+Shift+K',
  } } = await chrome.storage.sync.get('config');
  return config;
};
