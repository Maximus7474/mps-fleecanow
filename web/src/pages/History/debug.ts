import type { AccountHistory } from '@common/types';

export const devAccountHistory = [
  {
    action: 'deposit',
    amount: 500,
    related_account: null,
    timestamp: Math.floor(new Date('2025-07-15T10:00:00Z').getTime() / 1000),
  },
  {
    action: 'transfer',
    amount: 120,
    related_account: null,
    timestamp: Math.floor(new Date('2025-07-20T14:30:00Z').getTime() / 1000),
  },
  {
    action: 'withdraw',
    amount: -75,
    related_account: null,
    timestamp: Math.floor(new Date('2025-07-18T09:15:00Z').getTime() / 1000),
  },
  {
    action: 'transfer',
    amount: 300,
    related_account: 'user_abc456',
    timestamp: Math.floor(new Date('2025-07-19T11:45:00Z').getTime() / 1000),
  },
] as AccountHistory[];
