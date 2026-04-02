import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { RootProviders } from '@/providers';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <RootProviders>
        <App />
      </RootProviders>
    </HashRouter>
  </StrictMode>,
);
