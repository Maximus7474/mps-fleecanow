import { oxmysql as MySQL } from '@communityox/oxmysql';

export async function LogAccountAction(data: {
  account: number;
  action: 'transfer' | 'withdraw' | 'deposit';
  amount: number;
  related_account: number | null;
}): Promise<void> {
  await MySQL.insert(
    'INSERT INTO `phone_fleecanow_transfers` (`account`, `action`, `amount`, `related_account`) VALUES (?, ?, ?, ?)',
    [data.account, data.action, data.amount, data.related_account ?? null],
  );
}
