import { useEffect, useState } from 'react';
import './ConfirmTransfer.css';
import { devMode } from '../../../utils/utils';
import { proximityShareProfiles } from '../debug';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TransferData, UserSharedProfile } from '../../../types';
import ProfilePicture from '../../../components/ProfilePicture';
import { Send, TriangleAlert, Undo2 } from 'lucide-react';

const ConfirmTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [targetUser, setTargetUser] = useState<UserSharedProfile | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [transferData, setTransferData] = useState<TransferData>({
    destination: '',
    amount: 0,
    public: false,
  });

  useEffect(() => {
    const userName = searchParams.get('username');
    if (devMode) {
      const foundUser = proximityShareProfiles.find((user) => user.username === userName);
      if (foundUser) setTargetUser(foundUser);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className='confirm-transfer-page'>Loading</div>;
  }

  if (!targetUser) {
    return (
      <div className='confirm-transfer-page'>
        <TriangleAlert size={64} />
        <h3>No user found !</h3>

        {/* ToDo: add query params to go back to the same selection page */}
        <button
          onClick={() => navigate('/transfer')}
          style={{
            marginTop: '1em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1em',
          }}
        >
          <Undo2 />
          Back to selection
        </button>
      </div>
    );
  }

  return (
    <div className='confirm-transfer-page'>
      <div className='profile'>
        <h3>Sending money to</h3>
        <ProfilePicture src={targetUser.avatar ?? './icon.png'} />
        <div>
          <h2 className='display-name'>{targetUser.displayName || targetUser.username}</h2>
          <p className='username'>@{targetUser.username}</p>
        </div>
        <div>
          <label htmlFor='amount'>Amount:</label>
          <input
            type='number'
            value={transferData.amount}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                amount: e.target.value === '' ? 0 : Number(e.target.value),
              }))
            }
          />
        </div>
        <div>
          <label htmlFor='amount'>
            Message:<sub style={{ fontStyle: 'italic', fontSize: '12px' }}>(optional)</sub>
          </label>
          <input
            type='text'
            value={transferData.message ?? ''}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
          />
        </div>
        {/* Implemented at a later stage */}
        {/* <div style={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
          <input
            type='checkbox'
            id='public'
            style={{ width: '1.2em', height: '1.2em' }}
            checked={transferData.public}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                public: e.target.checked,
              }))
            }
          />
          <label htmlFor='public' style={{ margin: 0 }}>
            Public:
          </label>
        </div> */}
        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1em' }}>
          <Send />
          Send money
        </button>
      </div>
    </div>
  );
};

export default ConfirmTransfer;
