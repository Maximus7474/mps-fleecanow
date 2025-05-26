export interface User {
  uuid: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}
