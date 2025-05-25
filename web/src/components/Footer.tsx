import { RadioTower, Send, UserPen } from "lucide-react";
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <Link to='/transfer'>
        <Send />
      </Link>
      <Link to='/proximity'>
        <RadioTower />
      </Link>
      <Link to='/profile'>
        <UserPen />
      </Link>
    </footer>
  )
};

export default Footer;
