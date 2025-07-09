import { ProximityShareProfile } from '@common/types';
import Config from '@common/config';
import { GetPlayersInDistance } from '../utils/closestPlayer';

let intervalCheck: null | NodeJS.Timeout = null;
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
  let players: ProximityShareProfile[] = [];

  const rawPlayers = GetPlayersInDistance(maxDistance);

  for (const { idx, distance } of rawPlayers) {
    players.push(getPlayerFleecaNowData(idx, distance));
  }

  intervalCheck = setInterval(() => {
    let players: ProximityShareProfile[] = [];

    const rawPlayers = GetPlayersInDistance(maxDistance);

    for (const { idx, distance } of rawPlayers) {
      players.push(getPlayerFleecaNowData(idx, distance));
    }

    SendNUIMessage({
      action: 'fleecanow:updatecloseplayers',
      data: players,
    });
  }, 2000);

  cb(players);
});

RegisterNuiCallback('fleecanow:stopcloseplayers', (_: null, cb: Function) => {
  clearInterval(intervalCheck);
  intervalCheck = null;
  cb({});
});
