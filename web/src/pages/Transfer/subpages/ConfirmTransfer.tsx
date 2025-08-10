import { useEffect, useState } from 'react';
import './ConfirmTransfer.css';
import { devMode } from '../../../utils/utils';
import { proximityShareProfiles } from '../debug';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { TransferData, UserSharedProfile } from '@common/types';
import ProfilePicture from '../../../components/ProfilePicture';
import { Send, TriangleAlert, Undo2 } from 'lucide-react';
import { fetchNui } from '../../../utils/fetchNui';
import { useLocale } from 'src/hooks/useLocale';

const ConfirmTransfer: React.FC = () => {
  const navigate = useNavigate();
  const { T } = useLocale();
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
      title: T('TRANSFER.CONFIRM.POPUP.TITLE'),
      description: T(
        'TRANSFER.CONFIRM.POPUP.DESCRIPTION',
        { amount: transferData.amount, user: transferData.destination }
      ),
      buttons: [
        {
          title: T('TRANSFER.CONFIRM.POPUP.YES'),
          color: 'blue',
          cb: () => {
            fetchNui<{ success: boolean; message?: string }>('fleecanow:sendtransfer', transferData, {
              success: true,
            }).then((resp) => {
              if (resp.success) {
                sendNotification({
                  title: T('TRANSFER.CONFIRM.NOTIFICATION.TITLE'),
                  thumbnail: './icon.png',
                  content: T(
                    'TRANSFER.CONFIRM.NOTIFICATION.CONTENT',
                    { amount: transferData.amount, user: transferData.destination }
                  ),
                });
                navigate('/transfer');
              } else {
                components.setPopUp({
                  title: T('TRANSFER.CONFIRM.ERROR.TITLE'),
                  description: resp.message ??  T('TRANSFER.CONFIRM.ERROR.FALLBACK'),
                  buttons: [
                    {
                      title:  T('TRANSFER.CONFIRM.ERROR.OK'),
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
    return <div className='confirm-transfer-page'>{T('GLOBAL.LOADING')}</div>;
  }

  if (!targetUser) {
    return (
      <div className='confirm-transfer-page'>
        <TriangleAlert size={64} />
        <h3>{T('TRANSFER.CONFIRM.NO_USER_FOUND')}</h3>

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
          {T('TRANSFER.CONFIRM.BACK')}
        </button>
      </div>
    );
  }

  return (
    <div className='confirm-transfer-page'>
      <div className='profile'>
        <h3>{T('TRANSFER.CONFIRM.TITLE')}</h3>
        <ProfilePicture src={targetUser.avatar ?? './icon.png'} />
        <div>
          <h2 className='display-name'>{targetUser.displayName || targetUser.username}</h2>
          <p className='username'>@{targetUser.username}</p>
        </div>
        <div>
          <label htmlFor='amount'>{T('GLOBAL.AMOUNT')}:</label>
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
            {T('TRANSFER.CONFIRM.MESSAGE')}:<sub style={{ fontStyle: 'italic', fontSize: '12px' }}>({T('GLOBAL.OPTIONAL')})</sub>
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
          {T('TRANSFER.CONFIRM.SEND')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmTransfer;
