import { oxmysql as MySQL } from '@communityox/oxmysql';

export async function LogAccountAction(data: {
  account: number;
  action: 'transfer' | 'withdraw' | 'deposit';
  amount: number;
  recepient: number | null;
}): Promise<void> {
  await MySQL.insert(
    'INSERT INTO `phone_fleecanow_transfers` (`account`, `action`, `amount`, `recipient`) VALUES (?, ?, ?, ?)',
    [data.account, data.action, data.amount, data.recepient ?? null],
  );
}
