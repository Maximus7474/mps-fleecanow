import { useEffect, useState } from 'react';
import './Balance.css';
import { BanknoteArrowDown, BanknoteArrowUp, Loader } from 'lucide-react';
import { fetchNui } from '../../utils/fetchNui';
import type { GetBalanceResponse } from '@common/types';
import { devMode } from '../../utils/utils';

const Balance: React.FC = () => {
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
        console.error("Failed to fetch balance:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatBalanceValue = (value: number) => {
    if (value > 1000000) {
      return `${parseFloat((value / 1000000).toFixed(1))}M `;
    } else if (value > 1000) {
      return `${parseFloat((value / 1000).toFixed(1))}k `;
    }
    return `${value}`;
  };

  const handleButtonPress = (Withdraw: boolean) => {

    if (devMode) {
      setBalance(prev => prev + (Withdraw ? -1 : 1) * 1000);
      return;
    }

    let amount = 0;
    components.setPopUp({
      title: `${Withdraw ? 'Withdraw' : 'Add'} funds`,
      description: `How much do you want to ${Withdraw ? 'withdraw' : 'add'} to your account ?`,
      input: {
        type: 'number',
        min: '0',
        placeholder: 'Amount',
        onChange: (value) => {
          amount = parseInt(value, 0);
        },
      },
      buttons: [
        {
          title: 'Confirm',
          color: 'blue',
          cb: () => {
            setLoading(true);
            fetchNui<GetBalanceResponse>(
              'fleecanow:handleFunds',
              { action: Withdraw ? 'withdraw' : 'add', amount },
            )
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
          title: 'Cancel',
          color: 'red',
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className='balance'>
        <Loader size={48} className='spinner' />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className='balance'>
      <div className='current-display'>
        <h3>Balance:</h3>
        <p>{formatBalanceValue(balance)}$</p>
      </div>

      <div className='actions'>
        <button className='success' onClick={() => handleButtonPress(false)}>
          <BanknoteArrowUp />
          Add funds
        </button>
        <button className='danger' onClick={() => handleButtonPress(true)}>
          <BanknoteArrowDown />
          Withdraw funds
        </button>
      </div>
    </div>
  );
};

export default Balance;
