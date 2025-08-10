import { Search, Undo2 } from 'lucide-react';
import type { TransferProps, UsernameValidationResponse } from '@common/types';
import { useState } from 'react';
import { proximityShareProfiles } from '../debug';
import { useNavigate } from 'react-router-dom';
import { fetchNui } from '../../../utils/fetchNui';

const UsernameTransfer: React.FC<TransferProps> = ({ setSection, T }) => {
  const navigate = useNavigate();
  const [searchedUser, setSearchedUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const fallback = (): UsernameValidationResponse => {
      const user = proximityShareProfiles.find((user) => user.username === searchedUser);

      if (user) {
        return { success: true, username: user.username };
      } else {
        return { success: false, error: T('TRANSFER.USERNAME.NOT_FOUND') };
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
          setError(data.error ?? T('TRANSFER.USERNAME.NOT_FOUND'));
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
        <h2>{T('TRANSFER.USERNAME.HEADING')}</h2>
        <p>{T('TRANSFER.USERNAME.HELP_TEXT')}</p>

        <div className='search-field'>
          <label htmlFor='username'>{T('TRANSFER.USERNAME.USERNAME')}</label>
          <input name='username' type='text' value={searchedUser} onChange={(e) => setSearchedUser(e.target.value)} />

          <button onClick={handleSearch}>
            <Search />
            {T('TRANSFER.USERNAME.SEARCH')}
          </button>

          <p className={error ? 'error show' : 'error'}>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default UsernameTransfer;
