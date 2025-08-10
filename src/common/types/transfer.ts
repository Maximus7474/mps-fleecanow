import { RawLocales, UserSharedProfile } from '@common/types';

export type transferAction = 'home' | 'username' | 'proximity';

export type UsernameValidationResponse = { success: true; username: string } | { success: false; error: string };

export type GetBalanceResponse = { success: true; amount: number } | { success: false; error: string };

export interface TransferProps {
  T: (key: RawLocales, args?: { [key: string]: string|number }) => string;
  setSection: (section: transferAction) => void;
}

export interface ProximityShareProfile extends UserSharedProfile {
  distance: number;
}

export interface TransferData {
  destination: string;
  amount: number;
  message?: string;
  public: boolean;
}
