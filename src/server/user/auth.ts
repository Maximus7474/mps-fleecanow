import { oxmysql as MySQL } from '@communityox/oxmysql';
import { resourceExport } from '@common/export';
import type { DeletionResponse, LoginResponse, RawUser, UpdateProfileResponse, User } from '@common/types';
import { RegisterServerCallback } from '../utils/callbacks';
import { FleecaNowUser } from './class';

const setLoggedInAccount = async (phoneNumber: string, username: string) => {
  await MySQL.rawExecute(
    'INSERT INTO phone_logged_in_accounts (app, phone_number, username) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE username = VALUES(username)',
    ['FleecaNow', phoneNumber, username],
  );
};

RegisterServerCallback('fleecanow:getconnectedaccount', async (source: number): Promise<User | null> => {
  const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);
  if (!phone_number) return null;

  const username: { username: string } | null = await MySQL.single(
    'SELECT `username` FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `phone_number` = ?',
    [phone_number],
  );
  if (!username) return null;

  const rawUser: RawUser | null = await MySQL.single(
    'SELECT `username`, `display_name`, `email`, `avatar`, `proximity_sharing` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
    [username.username],
  );
  if (!rawUser) return null;

  const userClass = new FleecaNowUser(rawUser, source, phone_number);

  userClass.setPlayerStatebag();

  return userClass.getPrivateData();
});

RegisterServerCallback(
  'fleecanow:login',
  async (source: number, data: { username: string; password: string }): Promise<LoginResponse> => {
    const rawUser: (RawUser & { password: string }) | null = await MySQL.single(
      'SELECT `username`, `display_name`, `email`, `avatar`, `password`, `proximity_sharing` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
      [data.username],
    );

    if (!rawUser) return { success: false, error: 'Invalid username or password' };

    const passwordValid = VerifyPasswordHash(data.password, rawUser.password);
    if (!passwordValid) return { success: false, error: 'Invalid username or password' };

    const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);

    const userClass = new FleecaNowUser(rawUser, source, phone_number);

    userClass.setPlayerStatebag();

    setLoggedInAccount(phone_number, rawUser.username);

    return { success: true, user: userClass.getPrivateData() };
  },
);

RegisterServerCallback(
  'fleecanow:register',
  async (source: number, data: { username: string; password: string }): Promise<LoginResponse> => {
    const exists = await MySQL.single('SELECT 1 FROM `phone_fleecanow_accounts` WHERE `username` = ? LIMIT 1', [
      data.username,
    ]);

    if (exists) return { success: false, error: 'Username is taken' };

    const hashedPassword = GetPasswordHash(data.password);
    const id = await MySQL.insert('INSERT INTO `phone_fleecanow_accounts` (username, password) VALUES (?, ?)', [
      data.username,
      hashedPassword,
    ]);

    if (!id) return { success: false, error: 'Unable to register account' };

    const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);

    const rawUser: RawUser | null = await MySQL.single(
      'SELECT `username`, `display_name`, `email`, `avatar` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
      [data.username],
    );

    const userClass = new FleecaNowUser(rawUser, source, phone_number);

    userClass.setPlayerStatebag();

    setLoggedInAccount(phone_number, rawUser.username);

    return { success: true, user: userClass.getPrivateData() };
  },
);

RegisterServerCallback(
  'fleecanow:updateProfile',
  async (source: number, newUser: User): Promise<UpdateProfileResponse> => {
    const currentUser = FleecaNowUser.getUserBySource(source);
    if (!currentUser) {
      return { success: false, error: 'User not connected' };
    }

    const userName = currentUser.get('username') as string;

    if (userName !== newUser.username) {
      const existingUser: RawUser | null = await MySQL.single(
        'SELECT `username` FROM `phone_fleecanow_accounts` WHERE `username` = ?',
        [newUser.username],
      );

      if (existingUser) {
        return { success: false, error: 'Username already taken' };
      }
    }

    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const email = newUser.email && isValidEmail(newUser.email) ? newUser.email : null;

    currentUser.updateData({ ...newUser, email });

    currentUser.setPlayerStatebag();

    return { success: true, user: currentUser.getPrivateData() };
  },
);

RegisterServerCallback('fleecanow:deleteaccount', async (source: number): Promise<DeletionResponse> => {
  const phone_number = resourceExport('lb-phone', 'GetEquippedPhoneNumber')(source);
  if (!phone_number) return { success: false, error: 'No phone number found' };

  const usernameResult: { username: string } | null = await MySQL.single(
    'SELECT `username` FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `phone_number` = ?',
    [phone_number],
  );
  if (!usernameResult) return { success: false, error: 'User not logged in' };

  const username = usernameResult.username;

  await MySQL.query('DELETE FROM `phone_fleecanow_accounts` WHERE `username` = ?', [username]);

  await MySQL.query('DELETE FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `phone_number` = ?', [
    phone_number,
  ]);

  FleecaNowUser.removeUser(username);

  return { success: true };
});

onNet('fleecanow:logout', async () => {
  const source = global.source;
  const user = FleecaNowUser.getUserBySource(source);

  if (!user) return;

  const username = user.get('username') as string;
  const phone_number = user.get('phone_number');

  await MySQL.update(
    'DELETE FROM `phone_logged_in_accounts` WHERE `app` = "FleecaNow" AND `username` = ? AND `phone_number` = ?',
    [username, phone_number],
  );

  FleecaNowUser.removeUser(username);
});

on('playerDropped', () => {
  const source = global.source;
  const user = FleecaNowUser.getUserBySource(source);

  if (!user) return;

  const username = user.get('username') as string;
  FleecaNowUser.removeUser(username);
});
