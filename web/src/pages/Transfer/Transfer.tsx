import { useState } from 'react';

import ProximuityTransfer from './actions/Proximity';
import UsernameTransfer from './actions/Username';
import TransferTypeSelection from './actions/Main';
import type { transferAction } from '@common/types';

import './Transfer.css';

const Transfer: React.FC = () => {
  const [currentAction, setAction] = useState<transferAction>('home');

  return (
    <div className='transfer-page'>
      <header>
        <h2>Transfer Money</h2>
      </header>
      <section>
        {currentAction === 'home' ? (
          <TransferTypeSelection setSection={setAction} />
        ) : currentAction === 'username' ? (
          <UsernameTransfer setSection={setAction} />
        ) : currentAction === 'proximity' ? (
          <ProximuityTransfer setSection={setAction} />
        ) : (
          <>Invalid</>
        )}
      </section>
    </div>
  );
};

export default Transfer;
