import { useEffect, useState } from 'react';
import './Login.css';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { T } = useLocale();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='login'>
      <img src='./icon.png' />

      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>{T('LOGIN.USERNAME.LABEL')}:</label>
          <input
            type='text'
            name='username'
            placeholder={T('LOGIN.USERNAME.PLACEHOLDER')}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='password'>{T('LOGIN.PASSWORD.LABEL')}:</label>
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder={T('LOGIN.PASSWORD.PLACEHOLDER')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='button' onClick={() => setShowPassword((prev) => !prev)} className='show-password'>
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        <button type='submit' className='login-button'>
          {T('LOGIN.LOGIN')}
        </button>
      </form>
      <div className="no-account">
        <p>
          {T('LOGIN.NO_ACCOUNT')}
        </p>
        <Link to='/register'>{T('LOGIN.REGISTER')}</Link>
      </div>
    </div>
  );
};

export default Login;
