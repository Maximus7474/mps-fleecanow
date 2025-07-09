import { GetBalanceResponse } from '@common/types';
import { RegisterServerCallback } from '../utils/callbacks';
import { resourceExport } from '@common/export';

RegisterServerCallback('fleecanow:getBalance', async (source: number): Promise<GetBalanceResponse> => {
  try {
    const result: number = resourceExport('mps-lb-fleecanow', 'GetBankBalance')(source);

    return { success: true, amount: result };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Unable to fetch balance' };
  }
});

RegisterServerCallback(
  'fleecanow:handleFunds',
  async (source: number, data: { action: 'withdraw' | 'add'; amount: number }): Promise<GetBalanceResponse> => {
    console.log('fleecanow:handleFunds', source, data);
    return { success: true, amount: 69 };
  },
);
