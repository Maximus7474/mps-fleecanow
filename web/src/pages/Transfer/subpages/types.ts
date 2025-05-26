export type transferAction = 'home' | 'username' | 'proximity';

export interface TransferProps {
  setSection: (section: transferAction) => void;
}
