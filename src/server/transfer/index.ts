import { BasicResponse, RawUser, TransferData, UsernameValidationResponse, UserSharedProfile } from '@common/types';
import Locale from '@common/locale';
import { oxmysql as MySQL } from '@communityox/oxmysql';
import { RegisterServerCallback } from '../utils/callbacks';
import { FleecaNowUser } from '../user/class';
import { LogAccountAction } from '../utils/log_account_action';
import { Log } from '../utils/logging_wrapper';

RegisterServerCallback('fleecanow:isusernamevalid', async (_, data: string): Promise<UsernameValidationResponse> => {
  const exists = await MySQL.single('SELECT 1 FROM `phone_fleecanow_accounts` WHERE `username` = ?', [data]);

  if (exists) return { success: true, username: data };
  else return { success: false, error: Locale('CORE.TRANSFER.UNKNOWN_ACCOUNT') };
});

RegisterServerCallback('fleecanow:getuserprofile', async (_, username: string): Promise<UserSharedProfile | null> => {
  const account: Partial<RawUser> = await MySQL.single(
    'SELECT `username`, `display_name`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
    [username],
  );

  if (!account) return null;

  return {
    username: account.username,
    displayName: account.display_name,
    avatar: account.avatar,
  };
});

RegisterServerCallback('fleecanow:sendtransfer', async (source, data: TransferData): Promise<BasicResponse> => {
  const sender = FleecaNowUser.getUserBySource(source);
  const receiver = FleecaNowUser.getUser(data.destination);

  if (!sender) {
    return { success: false, message: Locale('CORE.GLOBAL.NOT_AUTHENTICATED') };
  }

  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    return { success: false, message: Locale('CORE.TRANSFER.INVALID_AMOUNT') };
  }

  const senderBalance = sender.get('balance') as number;

  if (senderBalance < data.amount) return { success: false, message: Locale('CORE.TRANSFER.INSUFFICIENT_FUNDS') };

  let receiverId;
  if (receiver) {
    receiverId = receiver.get('id');
    receiver.receiveMoney(data.amount, sender.get('id') as number, data?.message);
  } else {
    const receiver: { balance: number; id: number } = await MySQL.single(
      'SELECT `id`, `balance` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
      [data.destination],
    );

    if (typeof receiver?.balance !== 'number')
      return { success: false, message: Locale('CORE.TRANSFER.UNKNOWN_ACCOUNT') };

    receiverId = receiver.id;

    const result = await MySQL.update('UPDATE `phone_fleecanow_accounts` SET `balance` = ? WHERE `username` = ?', [
      receiver.balance + data.amount,
      data.destination,
    ]);

    LogAccountAction({
      account: receiver.id,
      action: 'transfer',
      amount: data.amount,
      related_account: sender.get('id') as number,
      message: data.message,
    });

    if (result === 0) return { success: false, message: Locale('CORE.TRANSFER.UNABLE_TO_TRANSFER') };
  }

  Log(
    'info',
    'transfer',
    `${data.amount}$ was transfered from @${sender.get('username')} to @${data.destination}`,
    null,
    String(source),
    null,
  );

  sender.transferMoney(data.amount, receiverId as number, data?.message);

  return { success: true };
});
