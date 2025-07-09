import { GetBalanceResponse } from '@common/types';
import { triggerServerCallback } from '../utils/callbacks';

RegisterNuiCallback('fleecanow:getBalance', async (_: null, cb: (data: GetBalanceResponse) => void) => {
  const response: GetBalanceResponse = await triggerServerCallback('fleecanow:getBalance');
  cb(response);
});

RegisterNuiCallback(
  'fleecanow:handleFunds',
  async (data: { action: 'withdraw' | 'add'; amount: number }, cb: (data: GetBalanceResponse) => void) => {
    const response: GetBalanceResponse = await triggerServerCallback('fleecanow:handleFunds', data);
    cb(response);
  },
);
