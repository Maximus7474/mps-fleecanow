import { UserSharedProfile } from 'src/types';

export type transferAction = 'home' | 'username' | 'proximity';

export interface TransferProps {
  setSection: (section: transferAction) => void;
}

export interface ProximityShareProfile extends UserSharedProfile {
  distance: number;
}
