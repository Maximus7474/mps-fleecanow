export interface User {
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserSharedProfile {
  username: string;
  displayName?: string;
  avatar?: string;
}

export type DeletionResponse = { success: true } | { success: false; error: string };

export type LoginResponse = { success: true; user: User } | { success: false; error: string };

export type UpdateProfileResponse = { success: true; user: User } | { success: false; error: string };
