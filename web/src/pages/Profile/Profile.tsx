import { LogOut, PenLine, Save, Trash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Profile.css';
import { devMode } from '../../utils/utils';
import { Navigate } from 'react-router-dom';
import ProfilePicture from '../../components/ProfilePicture';
import { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

type DeletionResponse = { success: true } | { success: false; error: string };
interface editProfileError {
  avatar?: string;
  displayName?: string;
  email?: string;
  username?: string
}

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [username, setUsername] = useState<string>(user?.username || '');
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [errors, setErrors] = useState<editProfileError>({});

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

  const handleSave = () => {

    let invalidData = false;
    const newData = {
      ...user,
    };
    const errors: editProfileError = {};
    
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (avatar.length > 20 && urlRegex.test(avatar)) {
      newData.avatar = avatar;
    } else {
      invalidData = true;
      errors.avatar = 'Avatar image URL is invalid';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 10 && emailRegex.test(avatar)) {
      newData.email = email;
    } else {
      invalidData = true;
      errors.email = 'Email address is invalid';
    }

    setErrors(errors);

    if (devMode) {
      alert('Simulated data being saved');
      setIsEditing(false);
    }

    updateUser({
      uuid: user!.uuid, // Woops
      avatar: avatar ?? user?.avatar,
      displayName,
      email,
      username,
    })
    .then(r => {
      if (r) {
        setIsEditing(false);
      } else {
        // ToDo: propagate to UI
        console.error('unable to update');
      }
    });
  }

  const profilePicSource = (temporary: string, current: string, fallback: string): string => {
    const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    if (imageUrlRegex.test(temporary)) return temporary;
    if (current?.trim()) return current;
    return fallback;
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
            src={profilePicSource(avatar ?? '', user.avatar ?? '', '/icon.png')}
            alt={`${user.username}'s avatar`}
            fallback='/icon.png'
          />
          {isEditing ? (
            <div className='profile-edit'>
              <div>
                <label htmlFor='avatar'>Avatar</label>
                <input
                  type='url'
                  name='avatar'
                  value={avatar ?? ''}
                  placeholder='www.imagehost.com/image.png'
                  onChange={(e) => setAvatar(e.target.value)}
                />
                <p className='error'>{errors.username}</p>
              </div>
              <div>
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  name='username'
                  value={username}
                  placeholder='Display name'
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className='error'>{errors.username}</p>
              </div>
              <div>
                <label htmlFor='displayname'>Display Name</label>
                <input
                  type='text'
                  name='displayname'
                  value={displayName}
                  placeholder='Display name'
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className='error'>{errors.displayName}</p>
              </div>
              <div>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={email}
                  placeholder='Email (optional)'
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className='error'>{errors.email}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className='display-name'>{user.displayName || user.username}</h2>
              <p className='username'>@{user.username}</p>
              {user.email && <p className='email'>{user.email}</p>}
            </>
          )}
        </div>
        <div className='actions'>
          {
            isEditing ? (
              <button onClick={handleSave} className='edit'>
                <Save />
                <p>Save</p>
              </button>
            ) : (<>
              <button onClick={logout} className='destructive'>
                <LogOut />
                <p>Log Out</p>
              </button>
              <button onClick={() => setIsEditing(true)} className='edit'>
                <PenLine />
                <p>Edit Profile</p>
              </button>
              <button onClick={handleDelete} className='destructive'>
                <Trash />
                <p>Delete Profile</p>
              </button>
            </>)
          }
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
