import { LogOut, PenLine, Trash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Profile.css';
import { devMode } from '../../utils/utils';
import { Navigate } from 'react-router-dom';
import ProfilePicture from '../../components/ProfilePicture';

type DeletionResponse = { success: true } | { success: false; error: string };

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleDelete = () => {
    if (devMode) {
      alert('Account deletion req would of been confirmed via modal before deleting.');
      logout();
      return;
    }

    components.setPopUp({
      title: 'Account Deletion',
      description:
        'This action is irreversible, all information, money and contacts linked to this account will be lost!',
      buttons: [
        {
          title: 'Cancel',
        },
        {
          title: 'Confirm',
          color: 'red',
          cb: () => {
            fetchNui<DeletionResponse>('fleecanow:deleteaccount', {}).then((res) => {
              if (!res.success) {
                components.setPopUp({
                  title: 'Unable to delete account',
                  description: res.error,
                  buttons: [
                    {
                      title: 'Close',
                    },
                  ],
                });
              } else {
                logout();
              }
            });
          },
        },
      ],
    });
  };

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='profile-container'>
      <header>
        <h2>Your profile</h2>
      </header>
      <div className='profile-card'>
        <div className='profile'>
          <ProfilePicture 
            className='avatar'
            src={user.avatar || '/icon.png'}
            alt={`${user.username}'s avatar`}
            fallback='/icon.png'
          />
          <h2 className='display-name'>{user.displayName || user.username}</h2>
          <p className='username'>@{user.username}</p>
          {user?.email && <p className='email'>{user.email}</p>}
        </div>
        <div className='actions'>
          <button onClick={logout} className='destructive'>
            <LogOut />
            <p>Log Out</p>
          </button>
          <button onClick={() => {}} className='edit'>
            <PenLine />
            <p>Edit Profile</p>
          </button>
          <button onClick={handleDelete} className='destructive'>
            <Trash />
            <p>Delete Profile</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
