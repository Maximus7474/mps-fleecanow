import { useEffect, useState } from 'react';
import './Login.css';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
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
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            name='username'
            placeholder='username'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='password'
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
          Login
        </button>
      </form>
      <div className="no-account">
        <p>
          Don't have an account ?
        </p>
        <Link to='/register'>Register</Link>
      </div>
    </div>
  );
};

export default Login;
