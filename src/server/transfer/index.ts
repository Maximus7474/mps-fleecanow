import { BasicResponse, RawUser, TransferData, UserSharedProfile } from '@common/types';
import { oxmysql as MySQL } from '@communityox/oxmysql';
import { RegisterServerCallback } from '../utils/callbacks';
import { FleecaNowUser } from '../user/class';
import { LogAccountAction } from '../utils/log_account_action';

RegisterServerCallback('fleecanow:isusernamevalid', async (_, data: string): Promise<BasicResponse> => {
  const exists = await MySQL.single('SELECT 1 FROM `phone_fleecanow_accounts` WHERE `username` = ?', [data]);

  if (exists) return { success: true };
  else return { success: false, message: 'Username was not found' };
});

RegisterServerCallback('fleecanow:getuserprofile', async (_, data: string): Promise<UserSharedProfile | null> => {
  const account: Partial<RawUser> = await MySQL.single(
    'SELECT `username`, `display_name`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
    [data],
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
    return { success: false, message: 'No logged in account' };
  }

  const senderBalance = sender.get('balance') as number;

  if (senderBalance < data.amount) return { success: false, message: 'Insufficient funds' };

  if (receiver) {
    receiver.receiveMoney(data.amount, sender.get('id') as number, data?.message);
  } else {
    const receiver: { balance: number; id: number } = await MySQL.single(
      'SELECT `id`, `balance` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
      [data.destination],
    );

    if (typeof receiver?.balance !== 'number') return { success: false, message: 'Unknown account' };

    const result = await MySQL.update('UPDATE `balance` = ? FROM `phone_fleecanow_accounts` WHERE `username` = ?', [
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

    if (result === 0) return { success: false, message: 'Unable to transfer' };
  }

  sender.transferMoney(data.amount, receiver.get('id') as number, data?.message);

  return { success: true };
});
