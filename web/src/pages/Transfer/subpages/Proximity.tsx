import { Undo2 } from 'lucide-react';
import { ProximityShareProfile, TransferProps } from '../../../types';
import { useEffect, useState } from 'react';
import { fetchNui } from '../../../utils/fetchNui';
import { proximityShareProfiles } from './debug';
import ProfilePicture from '../../../components/ProfilePicture';

const ProximuityTransfer: React.FC<TransferProps> = ({ setSection }) => {
  const [proximityUsers, setProximityUsers] = useState<ProximityShareProfile[]>([]);

  useEffect(() => {
    fetchNui<ProximityShareProfile[]>('fleecanow:getcloseplayers', {}, proximityShareProfiles).then((resp) => {
      setProximityUsers(resp);
    });
  }, []);

  return (
    <div>
      <button onClick={() => setSection('home')} className='return'>
        <Undo2 />
      </button>
      <div className='closeby-users'>
        <p>Select a user to send money to</p>
        <div>
          {
            proximityUsers.map((user, i) => (
              <div key={i} className='card'>
                <ProfilePicture
                  src={user.avatar ?? '/icon.png'}
                  fallback='/icon.png'
                  className=''
                />
                <div>
                  { user.displayName && <p>{user.displayName}</p> }
                  <p>{user.username}</p>
                </div>
                <div>
                  {user.distance}m
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ProximuityTransfer;
