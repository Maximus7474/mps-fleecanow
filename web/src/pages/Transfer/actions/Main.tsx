import { Radio, User } from 'lucide-react';
import type { TransferProps } from '@common/types';

import './Main.css';

const TransferTypeSelection: React.FC<TransferProps> = ({ setSection, T }) => {
  return (
    <div className='main'>
      <p>{T('TRANSFER.DESCRIPTION')}</p>
      <div className='actions'>
        <button onClick={() => setSection('username')}>
          <User size={96} />
          <h3>{T('TRANSFER.BY_USERNAME')}</h3>
        </button>
        <button onClick={() => setSection('proximity')}>
          <Radio size={96} />
          <h3>{T('TRANSFER.BY_PROXIMITY')}</h3>
        </button>
      </div>
    </div>
  );
};

export default TransferTypeSelection;
