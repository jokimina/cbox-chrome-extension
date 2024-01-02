import { KBarProvider } from 'kbar';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import KbarCommand from './kbarCommand';
import { getConfig } from '../config';

const root = document.createElement('div');
root.id = 'cbox';
document.body.appendChild(root);

createRoot(root).render(<App />);

export default function App() {
  const [shortcutV, setShortcutV] = useState('');

  useEffect(() => {
    const readConfig = async () => {
      const { shortcut } = await getConfig();
      setShortcutV(shortcut);
      console.log(shortcut);
    };
    readConfig();
  }, []);

  return (
    <StrictMode>
      {shortcutV ? (
        <KBarProvider
          options={{
            enableHistory: true,
            // https://jamiebuilds.github.io/tinykeys/
            toggleShortcut: shortcutV,
          }}
        >
          <KbarCommand />
        </KBarProvider>
      ) : null}
    </StrictMode>
  );
}
