import {
  getSupabase,
  type EvalLogRow,
  type PlayerRow,
} from "@/lib/supabase";
import type { DrillEvalLog, Player } from "@/store/roster";
import type { PositionId } from "@/data/positions";
import { emptyTraits, type Traits } from "@/data/evaluation";

function asTraits(raw: Record<string, number> | null | undefined): Traits {
  const base = emptyTraits(5);
  if (!raw || typeof raw !== "object") return base;
  for (const k of Object.keys(base) as (keyof Traits)[]) {
    const v = raw[k];
    if (typeof v === "number" && v >= 1 && v <= 10) base[k] = Math.round(v);
  }
  return base;
}

export function playerFromRow(row: PlayerRow): Player {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    number: row.number ?? undefined,
    gradeOrYear: row.grade_or_year ?? undefined,
    listedPosition: (row.listed_position as PositionId | null) ?? undefined,
    targetPositions: (row.target_positions ?? []) as PositionId[],
    traits: asTraits(row.traits),
    measurables: { ...(row.measurables ?? {}) },
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function playerToRow(player: Player, userId: string): PlayerRow {
  return {
    id: player.id,
    user_id: userId,
    first_name: player.firstName,
    last_name: player.lastName,
    number: player.number ?? null,
    grade_or_year: player.gradeOrYear ?? null,
    listed_position: player.listedPosition ?? null,
    target_positions: player.targetPositions ?? [],
    traits: player.traits as unknown as Record<string, number>,
    measurables: player.measurables as unknown as Record<string, number>,
    notes: player.notes ?? "",
    created_at: player.createdAt,
    updated_at: player.updatedAt,
  };
}

export function evalFromRow(row: EvalLogRow): DrillEvalLog {
  return {
    id: row.id,
    playerId: row.player_id,
    drillId: row.drill_id,
    score: row.score,
    note: row.note ?? undefined,
    at: row.at,
  };
}

export function evalToRow(
  log: DrillEvalLog,
  userId: string,
): EvalLogRow {
  return {
    id: log.id,
    user_id: userId,
    player_id: log.playerId,
    drill_id: log.drillId,
    score: log.score,
    note: log.note ?? null,
    at: log.at,
  };
}

export async function fetchRosterCloud(userId: string): Promise<{
  players: Player[];
  evalLogs: DrillEvalLog[];
}> {
  const sb = getSupabase();
  if (!sb) return { players: [], evalLogs: [] };

  const [playersRes, evalsRes] = await Promise.all([
    sb.from("players").select("*").eq("user_id", userId).order("last_name"),
    sb.from("drill_eval_logs").select("*").eq("user_id", userId).order("at", {
      ascending: false,
    }),
  ]);

  if (playersRes.error) throw playersRes.error;
  if (evalsRes.error) throw evalsRes.error;

  return {
    players: (playersRes.data as PlayerRow[]).map(playerFromRow),
    evalLogs: (evalsRes.data as EvalLogRow[]).map(evalFromRow),
  };
}

export async function upsertPlayerCloud(
  player: Player,
  userId: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("players")
    .upsert(playerToRow(player, userId), { onConflict: "id" });
  if (error) throw error;
}

export async function deletePlayerCloud(
  playerId: string,
  userId: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("players")
    .delete()
    .eq("id", playerId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function insertEvalCloud(
  log: DrillEvalLog,
  userId: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from("drill_eval_logs").insert(evalToRow(log, userId));
  if (error) throw error;
}

export async function deleteEvalCloud(
  logId: string,
  userId: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("drill_eval_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function replaceRosterCloud(
  players: Player[],
  userId: string,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  // Clear existing then insert — used for demo seed
  const { error: delErr } = await sb
    .from("players")
    .delete()
    .eq("user_id", userId);
  if (delErr) throw delErr;
  if (!players.length) return;
  const { error } = await sb
    .from("players")
    .insert(players.map((p) => playerToRow(p, userId)));
  if (error) throw error;
}

export async function clearRosterCloud(userId: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  // cascade deletes evals via FK
  const { error } = await sb.from("players").delete().eq("user_id", userId);
  if (error) throw error;
}
