import { GetBalanceResponse } from '@common/types';
import { RegisterServerCallback } from '../utils/callbacks';
import { FleecaNowUser } from './class';

RegisterServerCallback('fleecanow:getBalance', async (source: number): Promise<GetBalanceResponse> => {
  try {
    const user: FleecaNowUser = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: 'Unable to fetch balance' };

    return { success: true, amount: user.get('balance') as number };
  } catch (err) {
    console.error(`Unable to get player (svid: ${source}) balance`, err);
    return { success: false, error: 'Unable to fetch balance' };
  }
});

RegisterServerCallback(
  'fleecanow:handleFunds',
  async (source: number, data: { action: 'withdraw' | 'add'; amount: number }): Promise<GetBalanceResponse> => {
    console.log('fleecanow:handleFunds', source, data);
    const user: FleecaNowUser = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: 'Unable to fetch balance' };

    return user.updateFunds(data.action, data.amount);
  },
);
