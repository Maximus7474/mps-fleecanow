import { useState } from 'react';
import { transferAction } from './subpages/types';

import ProximuityTransfer from './subpages/Proximity';
import UsernameTransfer from './subpages/Username';
import TransferTypeSelection from './subpages/Main';

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
