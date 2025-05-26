import { Undo2 } from 'lucide-react';
import { TransferProps } from './types';

const UsernameTransfer: React.FC<TransferProps> = ({ setSection }) => {
  return (
    <div>
      <button onClick={() => setSection('home')} className='return'>
        <Undo2 />
      </button>
    </div>
  );
};

export default UsernameTransfer;
