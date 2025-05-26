import { Undo2 } from 'lucide-react';
import { TransferProps } from './types';

const ProximuityTransfer: React.FC<TransferProps> = ({ setSection }) => {
  return (
    <>
      <button onClick={() => setSection('home')}>
        <Undo2 />
      </button>
    </>
  );
};

export default ProximuityTransfer;
