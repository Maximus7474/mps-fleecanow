import { Radio, User } from 'lucide-react';
import { TransferProps } from '../../../types';

const TransferTypeSelection: React.FC<TransferProps> = ({ setSection }) => {
  return (
    <div className='main'>
      <p>How do you want to send money ?</p>
      <div className='actions'>
        <button onClick={() => setSection('username')}>
          <User size={128} />
          <h3>By username</h3>
        </button>
        <button onClick={() => setSection('proximity')}>
          <Radio size={128} />
          <h3>By proximity</h3>
        </button>
      </div>
    </div>
  );
};

export default TransferTypeSelection;
