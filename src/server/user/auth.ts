import { oxmysql as MySQL } from '@communityox/oxmysql';
import { resourceExport } from '@common/export';
import { LoginResponse, User } from '@common/types';
import { onClientCallback } from '@communityox/ox_lib/server';

interface ServerUser extends User {
  source: number;
  phone_number: string;
}

interface RawUser {
  username: string;
  display_name?: string;
  email?: string;
  avatar?: string;
}

let connectedUsers: { [key: string]: ServerUser } = {};
let userNameForSource: { [key: number]: string } = {};

const setPlayerStatebag = (src: number, user: User | null) => {
  Player(src).state.set('fleecanow-username', user ? user.username : null, true);
};

onClientCallback('fleecanow:getconnectedaccount', async (source: number): Promise<User | null> => {
  const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);
  if (!phone_number) return null;

  const username: string | null = await MySQL.single(
    'SELECT `username` FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `phone_number` = ?',
    [phone_number],
  );
  if (!username) return null;

  const rawUser: RawUser | null = await MySQL.single(
    'SELECT `username`, `display_name`, `email`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
    [username],
  );
  if (!rawUser) return null;

  const user: User = {
    username: rawUser.username,
    email: rawUser.email,
    displayName: rawUser.display_name,
    avatar: rawUser.avatar,
  };

  connectedUsers[user.username] = { ...user, source, phone_number };
  userNameForSource[source] = user.username;
  setPlayerStatebag(source, user);

  return user;
});

onClientCallback(
  'fleecanow:login',
  async (source: number, data: { username: string; password: string }): Promise<LoginResponse> => {
    const hashedPassword = GetPasswordHash(data.password);

    console.log('Login Request', data.username, hashedPassword);

    const rawUser: RawUser | null = await MySQL.single(
      'SELECT `username`, `display_name`, `email`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ? AND `password` = ?',
      [data.username, hashedPassword],
    );

    if (!rawUser) return { success: false, error: 'Invalid username or password' };

    const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);

    const user: User = {
      username: rawUser.username,
      email: rawUser.email,
      displayName: rawUser.display_name,
      avatar: rawUser.avatar,
    };

    connectedUsers[user.username] = { ...user, source, phone_number };
    userNameForSource[source] = user.username;
    setPlayerStatebag(source, user);

    return { success: true, user };
  },
);

onClientCallback(
  'fleecanow:register',
  async (source: number, data: { username: string; password: string }): Promise<LoginResponse> => {
    console.log('Registering new user', data.username, data.password);

    const exists = await MySQL.single('SELECT 1 FROM `phone_fleecanow_accounts` WHERE `username` = ? LIMIT 1', [
      data.username,
    ]);
    console.log('is username taken ?', exists !== null);

    if (exists) return { success: false, error: 'Username is taken' };

    const hashedPassword = GetPasswordHash(data.password);
    const id = await MySQL.insert('INSERT INTO `phone_fleecanow_accounts` (username, password) VALUES (?, ?)', [
      data.username,
      hashedPassword,
    ]);
    console.log('Inserted data:', data.username, hashedPassword, 'result:', id);

    if (!id) return { success: false, error: 'Unable to register account' };

    const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);

    const rawUser: RawUser | null = await MySQL.single(
      'SELECT `username`, `display_name`, `email`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
      [data.username],
    );

    const user: User = {
      username: rawUser.username,
      email: rawUser.email,
      displayName: rawUser.display_name,
      avatar: rawUser.avatar,
    };

    connectedUsers[user.username] = { ...user, source, phone_number };
    userNameForSource[source] = user.username;
    setPlayerStatebag(source, user);

    return { success: true, user };
  },
);

onClientCallback('fleecanow:logout', async (source: number) => {
  const user = connectedUsers[userNameForSource[source]];
  await MySQL.update(
    'DELETE FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `username` = ? AND `phone_number` = ?',
    [user.username, user.phone_number],
  );

  delete connectedUsers[user.username];
  delete userNameForSource[source];
  setPlayerStatebag(source, null);
});

on('playerDropped', () => {
  const source = global.source;
  const username = userNameForSource[source];
  delete connectedUsers[username];
  delete userNameForSource[source];
});
