import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { devMode } from './utils/utils';

import Frame from './components/dev/Frame';
import ThemeToggler from './components/dev/Theming';
import PageLayout from './components/PageLayout';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ProfilePage from './pages/Profile/Profile';
import Registration from './pages/Registration/Registration';
import Transfer from './pages/Transfer/Transfer';
import ConfirmTransfer from './pages/Transfer/subpages/ConfirmTransfer';

import './App.css';

const App = () => {
  const { user } = useAuth();
  const appDiv = useRef(null);

  useEffect(() => {
    if (devMode) {
      document.body.style.visibility = 'visible';
      return;
    }
  }, []);

  return (
    <AppProvider>
      <div className='app' ref={appDiv}>
        <Routes>
          <Route path='/' element={<PageLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Registration />} />

            {user && (
              <>
                <Route path='profile' element={<ProfilePage />} />
                <Route path='transfer'>
                  <Route index element={<Transfer />} />
                  <Route path='confirm' element={<ConfirmTransfer />} />
                </Route>
                <Route path='feed' element={'<Feed />'} />
                <Route path='contacts' element={'<Contacts />'} />
              </>
            )}

            {/* Redirect if accessing an unknown or unauthorised page */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Route>
        </Routes>
      </div>
      <ThemeToggler />
    </AppProvider>
  );
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  if (devMode) {
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;

      const aspectRatio = innerWidth / innerHeight;
      const phoneAspectRatio = 27.6 / 59;

      if (phoneAspectRatio < aspectRatio) {
        document.documentElement.style.fontSize = '1.66vh';
      } else {
        document.documentElement.style.fontSize = '3.4vw';
      }
    };

    useEffect(() => {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    handleResize();

    return (
      <div className='dev-wrapper'>
        <Frame>{children}</Frame>
      </div>
    );
  } else return children;
};

export default App;
