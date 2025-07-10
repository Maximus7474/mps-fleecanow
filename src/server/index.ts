import './user/auth';
import { FleecaNowUser } from './user/class';
import './user/funds';

// Save all players balance every 5 minutes
setInterval(FleecaNowUser.save, 5 * 60_000);
