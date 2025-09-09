import { Undo2 } from 'lucide-react';
import type { ProximityShareProfile, TransferProps } from '@common/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNui } from '../../../utils/fetchNui';
import { proximityShareProfiles } from '../debug';
import ProfilePicture from '../../../components/ProfilePicture';

const ProximuityTransfer: React.FC<TransferProps> = ({ setSection, T }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [proximityUsers, setProximityUsers] = useState<ProximityShareProfile[]>([]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    fetchNui<ProximityShareProfile[]>('fleecanow:getcloseplayers', {}, proximityShareProfiles).then((resp) => {
      if (isMounted) {
        setProximityUsers(resp);
        setLoading(false);
      }

      if (!intervalId) {
        intervalId = setInterval(() => {
          fetchNui<ProximityShareProfile[]>('fleecanow:getcloseplayers', {}, proximityShareProfiles.slice(Math.floor(Math.random() * 2)))
          .then(resp => {
            setProximityUsers(resp);
          })
          .catch(() => {});
        }, 2_000);
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <button onClick={() => setSection('home')} className='return'>
          <Undo2 />
        </button>
        <h3 className='no-users'>{T('GLOBAL.LOADING')}</h3>
      </div>
    );
  }

  if (proximityUsers.length === 0) {
    return (
      <div>
        <button onClick={() => setSection('home')} className='return'>
          <Undo2 />
        </button>
        <h3>{T('TRANSFER.PROXIMITY.NO_USERS')}</h3>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setSection('home')} className='return'>
        <Undo2 />
      </button>
      <div className='closeby-users'>
        <p>{T('TRANSFER.PROXIMITY.HELP_TEXT')}</p>
        <div>
          {proximityUsers.map((user, i) => {
            const query = new URLSearchParams({
              username: user.username,
              previous: 'proximity',
            }).toString();

            return (
              <Link key={i} to={`/transfer/confirm?${query}`} className='card'>
                <ProfilePicture src={user.avatar && user.avatar?.length > 10 ? user.avatar : './icon.png'} fallback='./icon.png' className='' />
                <div>
                  <p>{user.displayName ?? user.username}</p>
                  <p className='username'>@{user.username}</p>
                </div>
                <div>
                  {user.distance}
                  {T('TRANSFER.PROXIMITY.DISTANCE_UNIT')}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProximuityTransfer;
