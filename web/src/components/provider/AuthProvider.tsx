import { useState, ReactNode, useEffect } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import { User, LoginResponse, UpdateProfileResponse } from '@common/types';
import { AuthContext } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const mockAccount: User = {
  username: 'maximusprime',
  displayName: 'Maximus Prime',
  email: 'maximus.prime@lbscripts.com',
  avatar: 'https://avatars.githubusercontent.com/u/94017712?v=4',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNui<User | null>('fleecanow:getconnectedaccount', {}, mockAccount).then((user) => {
      if (!user) return;

      setUser(user);
    });
  }, []);

  async function login(username: string, password: string) {
    setLoading(true);

    fetchNui<LoginResponse>(
      'fleecanow:login',
      { username, password },
      {
        success: true,
        user: mockAccount,
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

  async function updateUser(user: User) {
    const result = await fetchNui<UpdateProfileResponse>('fleecanow:updateProfile', user, {
      success: true,
      user,
    });

    if (result.success) {
      setUser(result.user);
      return result.user;
    } else {
      console.error('Unable to update user:', result.error);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginError, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
