import { LogOut, PenLine, Save, Trash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocale } from '../../hooks/useLocale';
import { devMode } from '../../utils/utils';
import { Navigate } from 'react-router-dom';
import ProfilePicture from '../../components/ProfilePicture';
import { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';
import type { DeletionResponse } from '@common/types';

import './Profile.css';

interface editProfileError {
  avatar?: string;
  displayName?: string;
  email?: string;
  username?: string;
}

const ProfilePage: React.FC = () => {
  const { T } = useLocale();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [username, setUsername] = useState<string>(user?.username || '');
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [proximitySharing, setProximitySharing] = useState<boolean>(user?.proximitySharing || false);
  const [errors, setErrors] = useState<editProfileError>({});

  if (!user) {
    return <Navigate to='/' replace />;
  }

  const handleDelete = () => {
    if (devMode) {
      alert('Account deletion req would of been confirmed via modal before deleting.');
      logout();
      return;
    }

    components.setPopUp({
      title: T('PROFILE.DELETE_POPUP.TITLE'),
      description: T('PROFILE.DELETE_POPUP.DESCRIPTION'),
      buttons: [
        {
          title: T('PROFILE.DELETE_POPUP.CANCEL'),
        },
        {
          title: T('PROFILE.DELETE_POPUP.CONFIRM'),
          color: 'red',
          cb: () => {
            fetchNui<DeletionResponse>('fleecanow:deleteaccount', {}).then((res) => {
              if (!res.success) {
                components.setPopUp({
                  title: T('PROFILE.DELETE_POPUP.FAILED.TITLE'),
                  description: res.error,
                  buttons: [
                    {
                      title: T('PROFILE.DELETE_POPUP.FAILED.CLOSE'),
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
    } else if (avatar.length < 5) {
      delete newData.avatar;
    } else {
      invalidData = true;
      errors.avatar = T('PROFILE.AVATAR.INVALID');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 10 && emailRegex.test(avatar)) {
      newData.email = email;
    } else if (email.length !== 0) {
      invalidData = true;
      errors.email = T('PROFILE.EMAIL.INVALID');
    }

    setErrors(errors);

    if (devMode) {
      alert('Simulated data being saved');
      setIsEditing(false);
    }

    if (invalidData) return;

    updateUser({
      avatar: avatar ?? user?.avatar,
      displayName,
      email,
      username,
      proximitySharing,
    }).then((r) => {
      if (r) {
        setIsEditing(false);
      } else {
        // ToDo: propagate to UI
        console.error('unable to update', r);
      }
    });
  };

  const profilePicSource = (temporary: string, current: string, fallback: string): string => {
    const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

    if (imageUrlRegex.test(temporary)) return temporary;
    if (current?.trim()) return current;
    return fallback;
  };

  return (
    <div className='profile-container'>
      <header>
        <h2>{T('PROFILE.TITLE')}</h2>
      </header>
      <div className='profile-card'>
        <div className='profile'>
          <ProfilePicture
            className='avatar'
            src={profilePicSource(avatar ?? '', user.avatar ?? '', './icon.png')}
            alt={`${user.username}'s avatar`}
            fallback='./icon.png'
          />
          {isEditing ? (
            <div className='profile-edit'>
              <div>
                <label htmlFor='avatar'>{T('PROFILE.AVATAR.LABEL')}</label>
                <input
                  type='url'
                  name='avatar'
                  value={avatar ?? ''}
                  placeholder={T('PROFILE.AVATAR.PLACEHOLDER')}
                  onChange={(e) => setAvatar(e.target.value)}
                />
                <p className='error'>{errors.username}</p>
              </div>
              <div>
                <label htmlFor='username'>{T('PROFILE.USERNAME.LABEL')}</label>
                <input
                  type='text'
                  name='username'
                  value={username}
                  placeholder={T('PROFILE.USERNAME.PLACEHOLDER')}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className='error'>{errors.username}</p>
              </div>
              <div>
                <label htmlFor='displayname'>{T('PROFILE.DISPLAY_NAME.LABEL')}</label>
                <input
                  type='text'
                  name='displayname'
                  value={displayName}
                  placeholder={T('PROFILE.DISPLAY_NAME.PLACEHOLDER')}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className='error'>{errors.displayName}</p>
              </div>
              <div>
                <label htmlFor='email'>{T('PROFILE.EMAIL.LABEL')}</label>
                <input
                  type='email'
                  name='email'
                  value={email}
                  placeholder={T('PROFILE.EMAIL.PLACEHOLDER')}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className='error'>{errors.email}</p>
              </div>
              <div className='proximity-sharing'>
                <input
                  type='checkbox'
                  id='proximitySharing'
                  name='proximitySharing'
                  checked={proximitySharing}
                  onChange={(e) => setProximitySharing(e.target.checked)}
                />
                <label htmlFor='proximitySharing'>{T('PROFILE.PROXIMITY.LABEL')}</label>
              </div>
            </div>
          ) : (
            <>
              <h2 className='display-name'>{user.displayName || user.username}</h2>
              <p className='username'>@{user.username}</p>
              {user.email && <p className='email'>{user.email}</p>}
              <p className='proximity'>
                {user.proximitySharing ? T('PROFILE.PROXIMITY.ACTIVE') : T('PROFILE.PROXIMITY.INACTIVE')}
              </p>
            </>
          )}
        </div>
        <div className='actions'>
          {isEditing ? (
            <button onClick={handleSave} className='edit'>
              <Save />
              <p>{T('PROFILE.SAVE')}</p>
            </button>
          ) : (
            <>
              <button onClick={logout} className='destructive'>
                <LogOut />
                <p>{T('PROFILE.LOGOUT')}</p>
              </button>
              <button onClick={() => setIsEditing(true)} className='edit'>
                <PenLine />
                <p>{T('PROFILE.EDIT')}</p>
              </button>
              <button onClick={handleDelete} className='destructive'>
                <Trash />
                <p>{T('PROFILE.DELETE')}</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
