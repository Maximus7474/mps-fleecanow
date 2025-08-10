import { useState } from 'react';

import ProximuityTransfer from './actions/Proximity';
import UsernameTransfer from './actions/Username';
import TransferTypeSelection from './actions/Main';
import type { transferAction } from '@common/types';

import './Transfer.css';
import { useLocale } from 'src/hooks/useLocale';

const Transfer: React.FC = () => {
  const { T } = useLocale();
  const [currentAction, setAction] = useState<transferAction>('home');

  return (
    <div className='transfer-page'>
      <header>
        <h2>{T('TRANSFER.TITLE')}</h2>
      </header>
      <section>
        {currentAction === 'home' ? (
          <TransferTypeSelection setSection={setAction} T={T} />
        ) : currentAction === 'username' ? (
          <UsernameTransfer setSection={setAction} T={T} />
        ) : currentAction === 'proximity' ? (
          <ProximuityTransfer setSection={setAction} T={T} />
        ) : (
          <>Invalid</>
        )}
      </section>
    </div>
  );
};

export default Transfer;
