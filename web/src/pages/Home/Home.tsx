import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';

import './Home.css';

const Home: React.FC = () => {
  const { T } = useLocale();
  const { user, logout } = useAuth();

  /* 
    ToDo:
    - Show current money on account
    - Add button to add money
  */

  return (
    <div className='home'>
      <div className='logo'>
        <img src='./icon.png' alt='App Icon' />
      </div>

      {user ? (
        <section className='welcome'>
          <h2>{T('HOME.WELCOME_BACK', { username: user.displayName ?? user.username })}</h2>
          <button onClick={logout}>{T('HOME.LOGOUT')}</button>
        </section>
      ) : (
        <section className='connect'>
          <h2>{T('HOME.NOT_CONNECTED')}</h2>
          <p>
            {T('HOME.LOGIN_OR_REGISTER')}
          </p>
          <div>
            <Link to='/register'>{T('HOME.REGISTER')}</Link>
            <p>{T('HOME.OR')}</p>
            <Link to='/login'>{T('HOME.LOGIN')}</Link>
          </div>
        </section>
      )}

      <section className='about'>
        <h3>{T('HOME.ABOUT.HEADING')}</h3>
        <p>
          {T('HOME.ABOUT.DESCRIPTION')}
        </p>
      </section>

      {/* <details className='news'>
        <summary>
          <ChevronDown />
          <h3>Latest News</h3>
        </summary>
        <ul>
          <li>📅 May 22: New dark mode released!</li>
          <li>🔥 April 30: Feature X is now available to all users.</li>
          <li>🔧 April 15: We've fixed several bugs to improve your experience.</li>
        </ul>
      </details> */}
    </div>
  );
};

export default Home;
