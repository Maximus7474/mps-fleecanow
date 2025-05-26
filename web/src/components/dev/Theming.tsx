import React, { useState, useEffect } from 'react';

import './Theming.css';
import { Moon, Sun } from 'lucide-react';

const ThemeToggler: React.FC = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const appElement = document.querySelector('.app');
    if (appElement) {
      appElement.setAttribute('data-theme', theme);
    }
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className='menu'>
      <button onClick={toggleTheme}>
        {theme === 'light' ? <Sun /> : <Moon />}
        <span className="tooltip">Switch to<br/>{theme !== 'light' ? 'light' : 'dark'} theme</span>
      </button>
    </div>
  );
};

export default ThemeToggler;
