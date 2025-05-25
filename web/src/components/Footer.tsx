import { Home, RadioTower, Send, UserPen } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { NavItem } from "../types/navigation";

import './Footer.css';

const routes: NavItem[] = [
  {
    icon: <Send />,
    path: '/transfer',
    tooltip: 'Transfer Money',
    requiresAuth: true,
  },
  {
    icon: <RadioTower />,
    path: '/proximity',
    tooltip: undefined,
    requiresAuth: true,
  },
  {
    icon: <Home />,
    path: '/',
    tooltip: 'Home Screen',
    requiresAuth: false,
  },
  {
    icon: <UserPen />,
    path: '/profile',
    tooltip: 'View your profile',
    requiresAuth: true,
  },
];

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="app-footer">
      {
        routes.map(({ icon, path, requiresAuth }, i) => (
          ((requiresAuth && user !== null) || !requiresAuth) && (
            <Link to={path} key={i}>
              {icon}
            </Link>
          )
        ))
      }
    </footer>
  )
};

export default Footer;
