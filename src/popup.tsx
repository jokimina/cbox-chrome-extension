import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import FootBar from './components/footBar';
import { getConfig, setConfig } from './config';

const Popup = () => {
  const [shortcutV, setShortcutV] = useState('');
  const [message, setMessage] = useState('');

  const handleShortcutChange = (event: any) => {
    setShortcutV(event.target.value);
  };

  const handleSave = () => {
    setConfig({ shortcut: shortcutV });
    setMessage('保存成功');
  };

  useEffect(() => {
    getConfig().then((config) => {
      setShortcutV(config?.shortcut || 'Control+Shift+K');
    });
  }, []);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <form className="flex flex-col">
          <div>
            <label htmlFor="shortcut" className="font-semibold">
              快捷键：
            </label>
            <input
              type="text"
              id="shortcut"
              value={shortcutV}
              onChange={handleShortcutChange}
            />
            <button type="button" onClick={handleSave} className="ml-2">
              保存
            </button>
          </div>

          <div>
            {message && (
              <p className="block text-sm text-center text-green-500">
                {message}
              </p>
            )}
          </div>
          <div className="flex flex-row content-center mt-2">
            <a href="https://github.com/jamiebuilds/tinykeys?tab=readme-ov-file#commonly-used-keys-and-codes" target='_blank'>
              快捷键设置键位对照表
            </a>
            ，例如：Control+Shift+K
          </div>
          <div className="flex flex-row content-center mt-2">
            请注意，设置完成后刷新页面才会生效哦
          </div>
        </form>
      </div>
      <FootBar />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
