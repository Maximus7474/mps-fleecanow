import { HistoryResponse } from '@common/types';
import { triggerServerCallback } from '../utils/callbacks';

RegisterNuiCallback('fleecanow:getHistory', async (_: null, cb: (data: HistoryResponse) => void) => {
  const response: HistoryResponse = await triggerServerCallback('fleecanow:getHistory');
  cb(response);
});
