import { useState } from 'react';
import './Transfer.css';
import { Radio, Undo2, User } from 'lucide-react';

type transferAction = 'home' | 'username' | 'proximity';

const Transfer: React.FC = () => {
  const [currentAction, setAction] = useState<transferAction>('home');

  return (
    <div className='transfer-page'>
      <header>
        <h2>Transfer Money</h2>
      </header>
      <section>
        {currentAction === 'home' ? (
          <div className='main'>
            <p>How do you want to send money ?</p>
            <div className='actions'>
              <button onClick={() => setAction('username')}>
                <User size={128} />
                <h3>By username</h3>
              </button>
              <button onClick={() => setAction('proximity')}>
                <Radio size={128} />
                <h3>By proximity</h3>
              </button>
            </div>
          </div>
        ) : currentAction === 'username' ? (
          <>
            <button onClick={() => setAction('home')}>
              <Undo2 />
            </button>
            Huh ?
          </>
        ) : currentAction === 'proximity' ? (
          <>
            <button onClick={() => setAction('home')}>
              <Undo2 />
            </button>
            Double Huh ?
          </>
        ) : (
          <>Invalid</>
        )}
      </section>
    </div>
  );
};

export default Transfer;
