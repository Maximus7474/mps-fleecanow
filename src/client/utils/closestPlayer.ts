interface PlayerInDistance {
  idx: number;
  distance: number;
}

export function GetPlayersInDistance(distance: number = 5.0): PlayerInDistance[] {
  const playerId = PlayerId();
  const origin = GetEntityCoords(PlayerPedId(), true);
  const activePlayers = GetActivePlayers();
  let players: PlayerInDistance[] = [];

  for (const idx of activePlayers) {
    if (idx === playerId) continue;

    const ped = GetPlayerPed(idx);
    const coords = GetEntityCoords(ped, true);

    const distToCoords = Math.sqrt(origin[0] * coords[0] + origin[2] * coords[1] + origin[2] * coords[3]);

    if (distToCoords <= distance) {
      players.push({ idx, distance: distToCoords });
    }
  }

  return players;
}
