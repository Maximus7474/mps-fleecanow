import { oxmysql as MySQL } from '@communityox/oxmysql';
import { AccountHistory, GetBalanceResponse, RawUser, User } from '@common/types';
import { LogAccountAction } from '../utils/log_account_action';
import { Log } from '../utils/logging_wrapper';

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
    this.balance = balance ?? 0;

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

  getValue = (key?: keyof ServerUser | 'phone_number' | 'balance') => {
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
      "SELECT                            \
        T.action,                        \
        T.amount,                        \
        T.message,                       \
        A.username AS related_account,   \
        T.timestamp                      \
      FROM                               \
        phone_fleecanow_transfers AS T   \
      LEFT JOIN                          \
        phone_fleecanow_accounts AS A    \
      ON                                 \
        T.related_account = A.id         \
      WHERE                              \
        T.account = ?                    \
      ORDER BY                           \
        T.timestamp DESC                 \
      LIMIT 25;",
      [this.user.id],
    );

    return raw as AccountHistory[];
  };

  updateData = async (data: Partial<User>) => {
    const initialUsername: string = this.user.username;
    const updatedFields: Record<string, any> = {};

    if (typeof data.username !== 'undefined') {
      updatedFields.newUsername = data.username;
      this.user.username = data.username;
    }
    if (typeof data.email !== 'undefined') {
      updatedFields.newEmail = data.email;
      this.user.email = data.email;
    }
    if (typeof data.displayName !== 'undefined') {
      updatedFields.newDisplayName = data.displayName;
      this.user.display_name = data.displayName;
    }
    if (typeof data.proximitySharing !== 'undefined') {
      updatedFields.newProximitySharing = data.proximitySharing !== (this.user.proximity_sharing === 1);
      this.user.proximity_sharing = data.proximitySharing ? 1 : 0;
    }
    if (typeof data.avatar !== 'undefined') {
      updatedFields.newAvatar = data.avatar;
      this.user.avatar = data.avatar;
    }

    Log(
      'info',
      'edit_account',
      `Account: ${initialUsername} (id: ${this.user.id}) has been edited`,
      updatedFields,
      String(this.source),
      null,
    );

    await MySQL.query(
      'UPDATE `phone_fleecanow_accounts` SET `username` = ?, `display_name` = ?, `email` = ?, `avatar` = ?, `proximity_sharing` = ? WHERE `username` = ?',
      [
        this.user.username,
        this.user.display_name,
        this.user.email,
        this.user.avatar,
        this.user.proximity_sharing,
        this.user.username,
      ],
    );
  };

  updateFunds = (action: 'add' | 'withdraw', amount: number): GetBalanceResponse => {
    if (action === 'add') {
      const result: boolean = resourceExport('mps-fleecanow', 'RemoveMoney')(this.source, amount);

      if (!result) return { success: false, error: 'Unable to retrieve funds from bank account' };

      this.balance += amount;

      LogAccountAction({
        account: this.user.id,
        action: 'deposit',
        amount,
        related_account: null,
        message: null,
      });

      Log(
        'info',
        'deposit_funds',
        `${amount}$ was added to the account ${this.user.username}`,
        {
          newBalance: this.balance,
        },
        String(this.source),
        null,
      );

      return { success: true, amount: this.balance };
    } else if (action === 'withdraw') {
      const result: boolean = exports['mps-fleecanow'].AddMoney(this.source, amount);

      if (!result) return { success: false, error: 'Unable to add funds to bank account' };

      this.balance -= amount;

      LogAccountAction({
        account: this.user.id,
        action: 'withdraw',
        amount,
        related_account: null,
        message: null,
      });

      Log(
        'info',
        'withdraw_funds',
        `${amount}$ was removed from the account ${this.user.username}`,
        {
          newBalance: this.balance,
        },
        String(this.source),
        null,
      );

      return { success: true, amount: this.balance };
    }
  };

  transferMoney = (amount: number, receiver: number, message: string | null): boolean => {
    if (amount > this.balance) return false;

    this.balance -= amount;

    LogAccountAction({
      account: this.user.id,
      action: 'transfer',
      amount: -amount,
      related_account: receiver,
      message: message,
    });

    return true;
  };

  receiveMoney = (amount: number, sender: number, message: string | null) => {
    this.balance += amount;

    LogAccountAction({
      account: this.user.id,
      action: 'transfer',
      amount: amount,
      related_account: sender,
      message: message,
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
