import { createContext, useContext } from 'react';
import { LoginResponse, User } from '@common/types';

type AuthContextType = {
  user: User | null;
  loginError: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  updateUser: (user: User) => Promise<User | false>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
