import ReactDOM from 'react-dom/client';
import { AuthProvider } from './components/provider/AuthProvider';
import App from './App';
import { devMode } from './utils/utils';

import './colors.css';
import './index.css';
import { HashRouter } from 'react-router-dom';
import { LocaleProvider } from './components/provider/LocaleProvider';

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (window.name === '' || devMode) {
  const renderApp = () => {
    root.render(
      <HashRouter>
        <AuthProvider>
          <LocaleProvider>
            <App />
          </LocaleProvider>
        </AuthProvider>
      </HashRouter>,
    );
  };

  if (devMode) {
    renderApp();
  } else {
    window.addEventListener('message', (event) => {
      if (event.data === 'componentsLoaded') renderApp();
    });
  }
}
