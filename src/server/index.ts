import './user/auth';
import { FleecaNowUser } from './user/class';
import './user/funds';

// Save all players balance every 5 minutes
setInterval(FleecaNowUser.save, 5 * 60_000);

on('playerDropped', () => {
  const source = global.source;
  const user = FleecaNowUser.getUserBySource(source);

  if (!user) return;

  const username = user.get('username') as string;
  FleecaNowUser.removeUser(username);
});

on('onResourceStop', (resource: string) => {
  if (resource === 'mps-lb-fleecanow') {
    FleecaNowUser.save();
  }
});
