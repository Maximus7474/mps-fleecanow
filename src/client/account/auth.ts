import { LoginResponse, User } from '@common/types';
import { triggerServerCallback } from '@communityox/ox_lib/client';

let currentUser: User | null;

export const getCurrentUser = () => {
  return currentUser;
};

RegisterNuiCallback('fleecanow:getconnectedaccount', async (_: null, cb: (data: User | null) => void) => {
  const user = await triggerServerCallback<User | null>('fleecanow:getconnectedaccount', null);
  if (!user) return cb(null);
  currentUser = user;
  cb(user);
});

RegisterNuiCallback(
  'fleecanow:login',
  async (data: { username: string; password: string }, cb: (response: LoginResponse) => void) => {
    const response = await triggerServerCallback<LoginResponse>('fleecanow:login', null, data);
    if (!response) return cb({ success: false, error: 'Unable to login' });
    if (response.success) currentUser = response.user;
    cb(response);
  },
);

RegisterNuiCallback(
  'fleecanow:register',
  async (data: { username: string; password: string }, cb: (response: LoginResponse) => void) => {
    const response = await triggerServerCallback<LoginResponse>('fleecanow:register', null, data);
    if (!response) return cb({ success: false, error: 'Unable to register' });
    if (response.success) currentUser = response.user;
    cb(response);
  },
);

RegisterNuiCallback('fleecanow:logout', async (_: null, cb: Function) => {
  TriggerServerEvent('fleecanow:logout');
  currentUser = null;
  cb({});
});
