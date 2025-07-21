import { oxmysql as MySQL } from '@communityox/oxmysql';
import { AccountHistory, GetBalanceResponse, RawUser } from '@common/types';
import { resourceExport } from '@common/export';
import { LogAccountAction } from '../utils/log_account_action';

interface ServerUser extends Omit<RawUser, 'balance'> {}

export class FleecaNowUser {
  private static users: { [key: string]: FleecaNowUser } = {};

  static getUser = (username: string): FleecaNowUser | undefined => {
    return this.users[username];
  };

  static getUserBySource = (source: number): FleecaNowUser | undefined => {
    const user = Object.values(this.users).find((user) => user.source === source);
    return user;
  };

  static removeUser = (username: string) => {
    const user = this.getUser(username);

    if (!user) return;

    user.cleanup();

    delete this.users[username];
  };

  static save = () => {
    const userList = Object.values(this.users);

    for (const user of userList) {
      user.save();
    }
  };

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

  getHistory = async (): Promise<AccountHistory[]> => {
    const raw = await MySQL.query(
      `SELECT
        T.action,
        T.amount,
        A.username AS related_account,
        T.timestamp
      FROM
        phone_fleecanow_transfers AS T
      LEFT JOIN
        phone_fleecanow_accounts AS A
      ON
        T.related_account = A.id
      WHERE
        T.account = ?
      ORDER BY
        T.timestamp ASC
      LIMIT 25;`,
      [this.user.id],
    );

    return raw as AccountHistory[];
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

  updateFunds = (action: 'add' | 'withdraw', amount: number): GetBalanceResponse => {
    if (action === 'add') {
      const result: boolean = resourceExport('mps-lb-fleecanow', 'RemoveMoney')(this.source, amount);

      if (!result) return { success: false, error: 'Unable to retrieve funds from bank account' };

      this.balance += amount;

      LogAccountAction({
        account: this.user.id,
        action: 'deposit',
        amount,
        related_account: null,
      });

      return { success: true, amount: this.balance };
    } else if (action === 'withdraw') {
      const result: boolean = resourceExport('mps-lb-fleecanow', 'AddMoney')(this.source, amount);

      if (!result) return { success: false, error: 'Unable to add funds to bank account' };

      this.balance -= amount;

      LogAccountAction({
        account: this.user.id,
        action: 'withdraw',
        amount,
        related_account: null,
      });

      return { success: true, amount: this.balance };
    }
  };

  transferMoney = (amount: number, receiver: number): boolean => {
    if (amount > this.balance) return false;

    this.balance -= amount;

    LogAccountAction({
      account: this.user.id,
      action: 'transfer',
      amount: -amount,
      related_account: receiver,
    });

    return true;
  };

  receiveMoney = (amount: number, sender: number) => {
    this.balance += amount;

    LogAccountAction({
      account: this.user.id,
      action: 'transfer',
      amount: amount,
      related_account: sender,
    });

    return true;
  };

  save = async () => {
    await MySQL.query('UPDATE `phone_fleecanow_accounts` SET `balance` = ? WHERE `username` = ?', [
      this.balance,
      this.user.username,
    ]);
  };

  cleanup = async () => {
    this.setPlayerStatebag(true);
    this.save();
  };
}
