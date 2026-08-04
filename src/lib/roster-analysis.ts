import {
  EVAL_DRILLS,
  rankPositions,
  type FitScore,
  type Traits,
} from "@/data/evaluation";
import {
  drillBoostsForPlayer,
  type DrillEvalLog,
  type Player,
} from "@/store/roster";

export function analyzePlayer(
  player: Player,
  logs: DrillEvalLog[],
): {
  rankings: FitScore[];
  best: FitScore;
  boosts: ReturnType<typeof drillBoostsForPlayer>;
} {
  const boosts = drillBoostsForPlayer(player.id, logs, EVAL_DRILLS);
  const rankings = rankPositions(player.traits, player.measurables, boosts);
  return { rankings, best: rankings[0]!, boosts };
}

export function compareTrait(
  players: Player[],
  trait: keyof Traits,
): { playerId: string; value: number }[] {
  return players
    .map((p) => ({ playerId: p.id, value: p.traits[trait] }))
    .sort((a, b) => b.value - a.value);
}

export function bestAtTrait(
  players: Player[],
  trait: keyof Traits,
): Player | undefined {
  if (!players.length) return undefined;
  return [...players].sort((a, b) => b.traits[trait] - a.traits[trait])[0];
}
