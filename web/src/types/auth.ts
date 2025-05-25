import { User } from './user';

export type LoginResponse = { success: true; user: User } | { success: false; error: string };
