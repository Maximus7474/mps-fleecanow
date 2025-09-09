import { ProximityShareProfile } from '@common/types';
import Config from '@common/config';
import { GetPlayersInDistance } from '../utils/closestPlayer';

const maxDistance = typeof Config.MaxDistanceForProximity === 'number' ? Config.MaxDistanceForProximity : 5.0;

function getPlayerFleecaNowData(idx: number, distance: number): ProximityShareProfile {
  const svId = GetPlayerServerId(idx);

  const accountData = Player(svId).state['fleecanow-user'] as Omit<ProximityShareProfile, 'distance'>;

  return {
    ...accountData,
    distance,
  };
}

RegisterNuiCallback('fleecanow:getcloseplayers', async (_: null, cb: Function) => {
  const players: ProximityShareProfile[] = [];

  const rawPlayers = GetPlayersInDistance(maxDistance);

  for (const { idx, distance } of rawPlayers) {
    players.push(getPlayerFleecaNowData(idx, distance));
  }

  cb(players);
});
