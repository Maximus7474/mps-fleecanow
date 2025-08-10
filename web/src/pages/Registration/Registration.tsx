import { useEffect, useState } from 'react';
import './Registration.css';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';

type formFields = 'username' | 'password' | 'confirmedPassword';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const { T } = useLocale();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [invalidFields, setInvalidFields] = useState<Map<formFields, string>>(new Map());
  const [registrationError, setRegistrationError] = useState<string | null>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;
    register(username, password).then((data) => {
      if (data.success) {
        navigate('/');
      } else {
        setRegistrationError(data.error);
      }
    });
  };

  const validateFields = () => {
    const newInvalidFields = new Map<formFields, string>();
    if (username.length < 6) newInvalidFields.set('username', T('REGISTER.ERRORS.USERNAME_TOO_SHORT'));
    if (password.length < 6) newInvalidFields.set('password', T('REGISTER.ERRORS.PASSWORD_TOO_SHORT'));
    else if (password !== confirmedPassword) newInvalidFields.set('confirmedPassword', T('REGISTER.ERRORS.PASSWORD_NOT_MATCH'));

    setInvalidFields(newInvalidFields);

    return newInvalidFields.size == 0;
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='register'>
      <img src='./icon.png' />

      <form className='register-form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>{T('REGISTER.USERNAME.LABEL')}:</label>
          <input
            type='text'
            name='username'
            placeholder={T('REGISTER.USERNAME.PLACEHOLDER')}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className='invalid-field'>{invalidFields.get('username')}</p>
        </div>

        <div>
          <label htmlFor='password'>{T('REGISTER.PASSWORD.LABEL')}:</label>
          <input
            type='password'
            name='password'
            placeholder={T('REGISTER.PASSWORD.PLACEHOLDER')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className='invalid-field'>{invalidFields.get('password')}</p>
        </div>

        <div>
          <label htmlFor='confirmedPassword'>{T('REGISTER.PASSWORD.CONFIRM')}:</label>
          <input
            type='password'
            name='confirmedPassword'
            placeholder={T('REGISTER.PASSWORD.PLACEHOLDER')}
            required
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
          <p className='invalid-field'>{invalidFields.get('confirmedPassword')}</p>
        </div>

        <div>
          <p className='invalid-registration'>{registrationError}</p>
        </div>

        <button type='submit' className='register-button'>
          {T('REGISTER.REGISTER')}
        </button>
      </form>
      <div className="no-account">
        <p>
          {T('REGISTER.HAVE_AN_ACCOUNT')}
        </p>
        <Link to='/register'>{T('REGISTER.LOGIN')}</Link>
      </div>
    </div>
  );
};

export default Registration;
