import { useState, ReactNode } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { User, LoginResponse } from '../../types';
import { AuthContext } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function login(username: string, password: string) {
    setLoading(true);

    fetchNui<LoginResponse>(
      'fleecanow:login',
      { username, password },
      {
        success: true,
        user: {
          uuid: '17fecfcd-c694-41a3-a647-118ccf7c6bed',
          username: 'maximusprime',
          displayName: 'Maximus Prime',
          email:'maximus.prime@lbscripts.com',
          avatar: undefined,
        },
      },
    ).then((data) => {
      if (data.success) {
        setUser(data.user);
        navigate('/profile');
      } else {
        setUser(null);
        setLoginError(data.error);
      }
      setLoading(false);
    });
  }

  function logout() {
    setUser(null);
    fetchNui('fleecanow:logout');
  }

  return <AuthContext.Provider value={{ user, loginError, login, logout, loading }}>{children}</AuthContext.Provider>;
}
