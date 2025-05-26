import { BookUser, Home, MessageSquareMore, Send, UserPen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NavItem } from '../types';

import './Footer.css';

const routes: NavItem[] = [
  {
    icon: <Send />,
    path: '/transfer',
    tooltip: 'Transfer Money',
    requiresAuth: true,
  },
  {
    icon: <MessageSquareMore />,
    path: '/feed',
    tooltip: 'Feed',
    requiresAuth: true,
  },
  {
    icon: <Home />,
    path: '/',
    tooltip: 'Home Screen',
    requiresAuth: false,
  },
  {
    icon: <BookUser />,
    path: '/contacts',
    tooltip: 'Contacts',
    requiresAuth: true,
  },
  {
    icon: <UserPen />,
    path: '/profile',
    tooltip: 'View your profile',
    requiresAuth: true,
  },
];

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <footer className='app-footer'>
      {routes.map(
        ({ icon, path, requiresAuth }, i) =>
          ((requiresAuth && user !== null) || !requiresAuth) && (
            <Link to={path} key={i} className={pathname === path ? 'selected' : undefined}>
              {icon}
            </Link>
          ),
      )}
    </footer>
  );
};

export default Footer;
