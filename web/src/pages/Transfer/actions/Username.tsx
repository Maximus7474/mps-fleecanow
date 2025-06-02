import { Search, Undo2 } from 'lucide-react';
import type { TransferProps, UsernameValidationResponse } from '@common/types';
import { useState } from 'react';
import { proximityShareProfiles } from '../debug';
import { useNavigate } from 'react-router-dom';
import { fetchNui } from '../../../utils/fetchNui';

const UsernameTransfer: React.FC<TransferProps> = ({ setSection }) => {
  const navigate = useNavigate();
  const [searchedUser, setSearchedUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const fallback = (): UsernameValidationResponse => {
      const user = proximityShareProfiles.find((user) => user.username === searchedUser);

      if (user) {
        return { success: true, username: user.username };
      } else {
        return { success: false, error: 'User not found' };
      }
    };

    fetchNui<UsernameValidationResponse>('fleecanow:isusernamevalid', { username: searchedUser }, fallback()).then(
      (data) => {
        if (data.success) {
          const query = new URLSearchParams({
            username: data.username,
            previous: 'username',
          }).toString();

          navigate(`/transfer/confirm?${query}`);
        } else {
          setError(data.error ?? 'User not found');
        }
      },
    );
  };

  return (
    <div>
      <button onClick={() => setSection('home')} className='return'>
        <Undo2 />
      </button>

      <div className='user-search'>
        <h2>User Search</h2>
        <p>Please enter the username for the user you wish to send money to.</p>

        <div className='search-field'>
          <label htmlFor='username'>Username</label>
          <input name='username' type='text' value={searchedUser} onChange={(e) => setSearchedUser(e.target.value)} />

          <button onClick={handleSearch}>
            <Search />
            Search
          </button>

          <p className={error ? 'error show' : 'error'}>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default UsernameTransfer;
