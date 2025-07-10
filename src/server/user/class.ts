import { oxmysql as MySQL } from '@communityox/oxmysql';
import { RawUser } from '@common/types';

interface ServerUser extends Omit<RawUser, 'balance'> {};

export class FleecaNowUser {
  private static users: { [key: string]: FleecaNowUser } = {};

  static getUser = (username: string) => {
    return this.users[username];
  }

  static getUserBySource = (source: number) => {
    const user = Object.values(this.users).find(user => user.source === source);
    return user;
  }

  static removeUser = (username: string) => {
    const user = this.getUser(username);

    if (!user) return;

    user.cleanup();

    delete this.users[username];
  }

  private user: ServerUser;
  private source: number;
  private balance: number;
  private phone_number: string;

  constructor(user: RawUser, source: number, phone_number: string) {
    const { balance, ...userWithoutBalance } = user;
    this.user = userWithoutBalance;
    this.balance = balance;

    this.source = source;
    this.phone_number = phone_number;
    
    delete user.balance;
    this.user = user;

    FleecaNowUser.users[this.user.username] = this; 
  }

  setPlayerStatebag = (clear: boolean = false): void => {
    const data = clear || !this.user.proximity_sharing ? null : this.getPublicData();

    Player(this.source).state.set('fleecanow-user', data, true);
  };

  get = (key?: keyof ServerUser | 'phone_number' | 'balance') => {
    if (!key) return { ...this.user, phone_number: this.phone_number };

    if (key === 'phone_number') return this.phone_number;
    else if (key === 'balance') return this.balance;
    else {
      return this.user[key];
    }
  };

  getPublicData = () => {
    return {
      username: this.user.username,
      avatar: this.user.avatar,
      displayName: this.user.display_name,
    };
  };

  getPrivateData = () => {
    return {
      username: this.user.username,
      email: this.user.email,
      displayName: this.user.display_name,
      avatar: this.user.avatar,
      proximitySharing: this.user.proximity_sharing === 1,
    };
  };

  updateData = async (data: Partial<ServerUser>) => {
    if (data.username) this.user.username = data.username;
    if (data.email) this.user.email = data.email;
    if (data.display_name) this.user.display_name = data.display_name;
    if (data.proximity_sharing) this.user.proximity_sharing = data.proximity_sharing;
    if (data.avatar) this.user.avatar = data.avatar;

    await MySQL.query(
      'UPDATE `phone_fleecanow_accounts` SET `username` = ?, `display_name` = ?, `email` = ?, `avatar` = ?, `proximity_sharing` = ? WHERE `username` = ?',
      [
        this.user.username,
        this.user.display_name,
        this.user.email,
        this.user.avatar,
        this.user.proximity_sharing ? 1 : 0,
        this.user.username,
      ],
    );
  };

  cleanup = async () => {
    this.setPlayerStatebag(true);

    await MySQL.query(
      'UPDATE `phone_fleecanow_accounts` SET `balance` = ? WHERE `username` = ?',
      [
        this.balance,
        this.user.username,
      ],
    );
  };
}
