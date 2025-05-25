import { useEffect, useState } from 'react';
import './Registration.css';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

type formFields = 'username' | 'password' | 'confirmedPassword';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [invalidFields, setInvalidFields] = useState<Map<formFields, string>>(new Map());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;
    // register(username, password);
  };

  const validateFields = () => {
    const newInvalidFields = new Map<formFields, string>();
    if (username.length < 6) newInvalidFields.set('username', 'Username is too short');
    if (password.length < 6) newInvalidFields.set('password', 'Password is too short');
    else if (password !== confirmedPassword) newInvalidFields.set('confirmedPassword', "Password doesn't match");

    setInvalidFields(newInvalidFields);

    return newInvalidFields.size == 0;
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='login'>
      <img src='/icon.png' />

      <form className='register-form' onSubmit={handleSubmit}>
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
          <p className='invalid-field'>{invalidFields.get('username')}</p>
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            name='password'
            placeholder='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className='invalid-field'>{invalidFields.get('password')}</p>
        </div>

        <div>
          <label htmlFor='confirmedPassword'>Confirm Password:</label>
          <input
            type='password'
            name='confirmedPassword'
            placeholder='password'
            required
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <p className='invalid-field'>{invalidFields.get('confirmedPassword')}</p>
        </div>

        <button type='submit' className='register-button'>
          Register
        </button>
      </form>
      <div>
        <p>
          Already have an account ?<br />
          <Link to='/login'>Login</Link> here!
        </p>
      </div>
    </div>
  );
};

export default Registration;
