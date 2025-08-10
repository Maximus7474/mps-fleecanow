import { useEffect, useState } from 'react';
import { BanknoteArrowDown, BanknoteArrowUp, Loader } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import type { GetBalanceResponse } from '@common/types';
import { devMode, formatBalanceValue } from '../../utils/utils';
import { useLocale } from '../../hooks/useLocale';

import './Balance.css';

const Balance: React.FC = () => {
  const { T } = useLocale();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNui<GetBalanceResponse>('fleecanow:getBalance', {}, { success: true, amount: 42900 })
      .then((r) => {
        if (r.success) {
          setBalance(r.amount);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch balance:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleButtonPress = (Withdraw: boolean) => {
    if (devMode) {
      setBalance((prev) => prev + (Withdraw ? -1 : 1) * 1000);
      return;
    }

    let amount = 0;
    components.setPopUp({
      title: T(`BALANCE.CONFIRMATION_POPUP.TITLE.${Withdraw ? 'ADD' : 'REMOVE'}`),
      description: T(`BALANCE.CONFIRMATION_POPUP.DESCRIPTION.${Withdraw ? 'ADD' : 'REMOVE'}`),
      input: {
        type: 'number',
        min: '0',
        placeholder: T('GLOBAL.AMOUNT'),
        onChange: (value) => {
          amount = parseInt(value, 0);
        },
      },
      buttons: [
        {
          title: T('BALANCE.CONFIRMATION_POPUP.CONFIRM'),
          color: 'blue',
          cb: () => {
            setLoading(true);
            fetchNui<GetBalanceResponse>('fleecanow:handleFunds', { action: Withdraw ? 'withdraw' : 'add', amount })
              .then((r) => {
                if (r.success) {
                  setBalance(r.amount);
                }
              })
              .finally(() => {
                setLoading(false);
              });
          },
        },
        {
          title: T('BALANCE.CONFIRMATION_POPUP.CANCEL'),
          color: 'red',
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className='balance'>
        <Loader size={48} className='spinner' />
        <p>{T('GLOBAL.LOADING')}...</p>
      </div>
    );
  }

  return (
    <div className='balance'>
      <div className='current-display'>
        <h3>{T('BALANCE.BALANCE')}:</h3>
        <p>{formatBalanceValue(balance)}{T('GLOBAL.CURRENCY')}</p>
      </div>

      <div className='actions'>
        <button className='success' onClick={() => handleButtonPress(false)}>
          <BanknoteArrowUp />
          {T('BALANCE.ADD_FUNDS')}
        </button>
        <button className='danger' onClick={() => handleButtonPress(true)}>
          <BanknoteArrowDown />
          {T('BALANCE.REMOVE_FUNDS')}
        </button>
      </div>
    </div>
  );
};

export default Balance;
