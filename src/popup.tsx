import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
import FootBar from './components/footBar';

const Popup = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <p className="text-lg">Press <kbd className="kbd kbd-sm">Ctrl</kbd>+<kbd className="kbd kbd-sm">Shift</kbd> + <kbd className="kbd kbd-sm">K</kbd> to call up the command panel</p>
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
