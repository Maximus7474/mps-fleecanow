import { useEffect, useState } from 'react';
import './History.css';
import { BanknoteArrowDown, BanknoteArrowUp, Loader } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import type { AccountHistory, HistoryResponse } from '@common/types';
import { devAccountHistory } from './debug';
import { formatBalanceValue } from '../../utils/utils';

const getIconForAction = (action: 'transfer' | 'withdraw' | 'deposit', amount: number): React.ReactNode => {
  if (action === 'deposit' || (action === 'transfer' && amount > 0)) {
    return <BanknoteArrowUp color='green' />;
  }
  if (action === 'withdraw' || (action === 'transfer' && amount < 0)) {
    return <BanknoteArrowDown color='red' />;
  }
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const History: React.FC = () => {
  const [history, setHistory] = useState<AccountHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchNui<HistoryResponse>('fleecanow:getHistory', {}, { success: true, history: devAccountHistory })
      .then((r) => {
        if (r.success) {
          setHistory(r.history);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch balance:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className='balance'>
        <Loader size={48} className='spinner' />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className='history'>
      <h2>Account history</h2>

      <div className='recap'>
        {history.map((item, idx) => (
          <div
            key={idx}
            className={expandedIdx === idx ? 'card expanded' : 'card'}
            onClick={() => {
              if (item.message) setExpandedIdx((prev) => (prev === idx ? null : idx));
            }}
          >
            {getIconForAction(item.action, item.amount)}
            <div>
              {item.action === 'withdraw' ? (
                'Withdrawal'
              ) : item.action === 'deposit' ? (
                'Deposit'
              ) : (
                <p>
                  {item.amount > 0 ? 'From' : 'To'} {item.related_account ?? 'Deleted user'}
                </p>
              )}
              {expandedIdx === idx && item.message && <p className='message'>{item.message}</p>}
              <p className='username'>{formatDate(item.timestamp)}</p>
            </div>
            <div>
              {item.amount < 0 && '-'}
              {formatBalanceValue(Math.abs(item.amount))}$
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
