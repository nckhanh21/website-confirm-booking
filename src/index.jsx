import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './translation/i18n';
import GlobalProvider from './context/GlobalProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

