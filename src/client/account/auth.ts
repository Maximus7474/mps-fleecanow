import { LoginResponse, User } from '@common/types';
import { awaitCallback } from '../utils/callbacks';

let currentUser: User | null;

export const getCurrentUser = () => {
  return currentUser;
};

RegisterNuiCallback('fleecanow:getconnectedaccount', async (_: null, cb: (data: User | null) => void) => {
  const user: User | null = await awaitCallback('fleecanow:getconnectedaccount');
  currentUser = user;
  cb(user);
});

RegisterNuiCallback(
  'fleecanow:login',
  async (data: { username: string; password: string }, cb: (response: LoginResponse) => void) => {
    const response: LoginResponse = await awaitCallback('fleecanow:login', data);
    if (response.success) currentUser = response.user;
    cb(response);
  },
);

RegisterNuiCallback('fleecanow:logout', async (_: null, cb: Function) => {
  TriggerServerEvent('fleecanow:logout');
  currentUser = null;
  cb({});
});
