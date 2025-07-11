import { BasicResponse, UserSharedProfile } from '@common/types';
import { triggerServerCallback } from '../utils/callbacks';

RegisterNuiCallback(
  'fleecanow:isusernamevalid',
  async ({ username }: { username: string }, cb: (data: BasicResponse) => void) => {
    const response: BasicResponse = await triggerServerCallback('fleecanow:isusernamevalid', username);
    cb(response);
  },
);

RegisterNuiCallback(
  'fleecanow:getuserprofile',
  async ({ username }: { username: string }, cb: (data: UserSharedProfile | null) => void) => {
    const response: UserSharedProfile | null = await triggerServerCallback('fleecanow:getuserprofile', username);
    cb(response);
  },
);

RegisterNuiCallback(
  'fleecanow:sendtransfer',
  async (data: { destination: string; amount: number; public: boolean }, cb: (data: BasicResponse) => void) => {
    const response: BasicResponse = await triggerServerCallback('fleecanow:sendtransfer', data);
    cb(response);
  },
);
