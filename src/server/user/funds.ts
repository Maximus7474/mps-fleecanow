import { GetBalanceResponse } from '@common/types';
import { RegisterServerCallback } from '../utils/callbacks';
import { FleecaNowUser } from './class';
import Locale from '@common/locale';

RegisterServerCallback('fleecanow:getBalance', async (source: number): Promise<GetBalanceResponse> => {
  try {
    const user = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: Locale('CORE.FUNDS.UNABLE_TO_GET_BALANCE') };

    return { success: true, amount: user.getValue('balance') as number };
  } catch (err) {
    console.error(`Unable to get player (svid: ${source}) balance`, err);
    return { success: false, error: Locale('CORE.FUNDS.UNABLE_TO_GET_BALANCE') };
  }
});

RegisterServerCallback(
  'fleecanow:handleFunds',
  async (source: number, data: { action: 'withdraw' | 'add'; amount: number }): Promise<GetBalanceResponse> => {
    const user = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: Locale('CORE.FUNDS.UNABLE_TO_GET_BALANCE') };

    return user.updateFunds(data.action, data.amount);
  },
);
