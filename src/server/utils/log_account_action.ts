import { oxmysql as MySQL } from '@communityox/oxmysql';

export async function LogAccountAction(data: {
  account: number;
  action: 'transfer' | 'withdraw' | 'deposit';
  amount: number;
  related_account: number | null;
  message: string | null;
}): Promise<void> {
  const related_account = data.action === 'transfer' ? data.related_account : null;

  const message =
    data.message && data.action === 'transfer' && data.message.length > 0
      ? data.message.length > 255
        ? `${data.message.slice(0, 252)}...`
        : data.message
      : null;

  await MySQL.insert(
    'INSERT INTO `phone_fleecanow_transfers` (`account`, `action`, `amount`, `related_account`, `message`) VALUES (?, ?, ?, ?, ?)',
    [data.account, data.action, data.amount, related_account, message],
  );
}
