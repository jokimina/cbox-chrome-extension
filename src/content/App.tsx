import { KBarProvider } from 'kbar';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import KbarCommand from './kbarCommand';

const root = document.createElement('div');
root.id = 'cbox';
document.body.appendChild(root);

createRoot(root).render(<App />);

export default function App() {
  return (
    <StrictMode>
      <KBarProvider
        options={{
          enableHistory: true,
          // https://jamiebuilds.github.io/tinykeys/
          toggleShortcut: 'Control+Shift+K',
        }}
      >
        <KbarCommand />
      </KBarProvider>
    </StrictMode>
  );
}
