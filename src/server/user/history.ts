import { HistoryResponse } from '@common/types';
import { FleecaNowUser } from './class';
import { RegisterServerCallback } from '../utils/callbacks';

RegisterServerCallback('fleecanow:getHistory', async (source: number): Promise<HistoryResponse> => {
  try {
    const user: FleecaNowUser = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: 'Unable to fetch balance' };

    const history = await user.getHistory();

    return { success: true, history };
  } catch (err) {
    console.error(`Unable to get player (svid: ${source}) balance`, err);
    return { success: false, error: 'Unable to fetch balance' };
  }
});
