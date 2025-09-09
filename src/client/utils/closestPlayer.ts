interface PlayerInDistance {
  idx: number;
  distance: number;
}

export function GetPlayersInDistance(distance: number = 5.0): PlayerInDistance[] {
  const sqDist = distance * distance;
  const playerId = PlayerId();
  const origin = GetEntityCoords(PlayerPedId(), true);
  const activePlayers = GetActivePlayers();
  let players: PlayerInDistance[] = [];

  for (const idx of activePlayers) {
    if (idx === playerId) continue;

    const ped = GetPlayerPed(idx);
    const coords = GetEntityCoords(ped, true);

    const distToCoords = Vdist2(origin[0], origin[1], origin[2], coords[0], coords[1], coords[2]);

    if (distToCoords <= sqDist) {
      players.push({ idx, distance: distToCoords });
    }
  }

  return players;
}
