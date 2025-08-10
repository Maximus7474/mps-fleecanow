import { HistoryResponse } from '@common/types';
import { FleecaNowUser } from './class';
import { RegisterServerCallback } from '../utils/callbacks';
import Locale from '@common/locale';

RegisterServerCallback('fleecanow:getHistory', async (source: number): Promise<HistoryResponse> => {
  try {
    const user: FleecaNowUser = FleecaNowUser.getUserBySource(source);

    if (!user) return { success: false, error: Locale('CORE.HISTORY.UNABLE_TO_GET_HISTORY') };

    const history = await user.getHistory();

    return { success: true, history };
  } catch (err) {
    console.error(`Unable to get player (svid: ${source}) history`, err);
    return { success: false, error: Locale('CORE.HISTORY.UNABLE_TO_GET_HISTORY') };
  }
});
