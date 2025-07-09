import { RawUser } from '@common/types';

export class FleecaNowUser {
  private user: RawUser;
  private source: number;
  private phone_number: string;

  constructor(user: RawUser, source: number, phone_number: string) {
    this.user = user;
    this.source = source;
    this.phone_number = phone_number;
  }

  setPlayerStatebag = (clear: boolean = false): void => {
    const data = clear || !this.user.proximity_sharing ? null : this.getPublicData();

    Player(this.source).state.set('fleecanow-user', data, true);
  };

  get = (key?: keyof RawUser | 'phone_number') => {
    if (!key) return { ...this.user, phone_number: this.phone_number };

    if (key === 'phone_number') return this.phone_number;
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

  updateData = (data: Partial<RawUser>) => {
    if (data.username) this.user.username = data.username;
    if (data.email) this.user.email = data.email;
    if (data.display_name) this.user.display_name = data.display_name;
    if (data.proximity_sharing) this.user.proximity_sharing = data.proximity_sharing;
    if (data.avatar) this.user.avatar = data.avatar;
  };
}
