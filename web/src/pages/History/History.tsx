import { useEffect, useState } from 'react';
import { BanknoteArrowDown, BanknoteArrowUp, Loader } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import type { AccountHistory, HistoryResponse } from '@common/types';
import { devAccountHistory } from './debug';
import { formatBalanceValue } from '../../utils/utils';
import { useLocale } from '../../hooks/useLocale';

import './History.css';

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
  const { T } = useLocale();
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
        <p>{T('GLOBAL.LOADING')}...</p>
      </div>
    );
  }

  return (
    <div className='history'>
      <h2>{T('HISTORY.TITLE')}</h2>

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
                T('HISTORY.ACTIONS.WITHDRAW')
              ) : item.action === 'deposit' ? (
                T('HISTORY.ACTIONS.DEPOSIT')
              ) : (
                <p>
                  {item.amount > 0 ? T('HISTORY.ACTIONS.RECEIVED') : T('HISTORY.ACTIONS.SENT')} {item.related_account ?? T('HISTORY.DELETED_USER')}
                </p>
              )}
              {expandedIdx === idx && item.message && <p className='message'>{item.message}</p>}
              <p className='username'>{formatDate(item.timestamp)}</p>
            </div>
            <div>
              {item.amount < 0 && '-'}
              {formatBalanceValue(Math.abs(item.amount))}{T('GLOBAL.CURRENCY')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
