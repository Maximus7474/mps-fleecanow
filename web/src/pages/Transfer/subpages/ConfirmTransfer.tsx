import { useEffect, useState } from 'react';
import './ConfirmTransfer.css';
import { devMode } from '../../../utils/utils';
import { proximityShareProfiles } from '../debug';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { TransferData, UserSharedProfile } from '@common/types';
import ProfilePicture from '../../../components/ProfilePicture';
import { Send, TriangleAlert, Undo2 } from 'lucide-react';
import { fetchNui } from '../../../utils/fetchNui';

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
    const username = searchParams.get('username');
    if (devMode) {
      const foundUser = proximityShareProfiles.find((user) => user.username === username);
      if (foundUser) setTargetUser(foundUser);
      setLoading(false);
    } else {
      fetchNui<UserSharedProfile | null>('fleecanow:getuserprofile', { username })
        .then((user) => {
          setTargetUser(user);
          setTransferData((prev) => ({ ...prev, destination: username! }))
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const confirmTransfer = () => {
    components.setPopUp({
      title: 'Send Money',
      description: `Are you sure you want to send ${transferData.amount}$ to @${transferData.destination} ?`,
      buttons: [
        {
          title: 'Yes',
          color: 'blue',
          cb: () => {
            fetchNui<{ success: boolean; message?: string }>('fleecanow:sendtransfer', transferData, {
              success: true,
            }).then((resp) => {
              if (resp.success) {
                sendNotification({
                  title: 'Money Transfer',
                  thumbnail: './icon.png',
                  content: `${transferData.amount}$ was sent to @${transferData.destination}`,
                });
                navigate('/transfer');
              } else {
                components.setPopUp({
                  title: 'Unable to send',
                  description: resp.message ?? 'We were unable to send the money',
                  buttons: [
                    {
                      title: 'Okay',
                    },
                  ],
                });
              }
            });
          },
        },
      ],
    });
  };

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
            min={0}
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
            maxLength={255}
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
        <button className='send-money' onClick={confirmTransfer}>
          <Send />
          Send money
        </button>
      </div>
    </div>
  );
};

export default ConfirmTransfer;
