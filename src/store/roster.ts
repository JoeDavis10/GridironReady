import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  emptyTraits,
  type Measurables,
  type TraitId,
  type Traits,
} from "@/data/evaluation";
import type { PositionId } from "@/data/positions";
import {
  clearRosterCloud,
  deleteEvalCloud,
  deletePlayerCloud,
  fetchRosterCloud,
  insertEvalCloud,
  replaceRosterCloud,
  upsertPlayerCloud,
} from "@/lib/roster-api";

export interface DrillEvalLog {
  id: string;
  playerId: string;
  drillId: string;
  /** 1–10 coach grade */
  score: number;
  note?: string;
  at: string; // ISO
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number?: string;
  gradeOrYear?: string;
  /** Current / listed position */
  listedPosition?: PositionId;
  /** Coach shortlist */
  targetPositions: PositionId[];
  traits: Traits;
  measurables: Measurables;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface RosterState {
  players: Player[];
  evalLogs: DrillEvalLog[];
  compareIds: string[];
  /** Supabase auth user id — when set, mutations write through to cloud */
  cloudUserId: string | null;
  cloudStatus: "idle" | "loading" | "ready" | "error";
  cloudError: string | null;
  setCloudUser: (userId: string | null) => Promise<void>;
  addPlayer: (input: Omit<Player, "id" | "createdAt" | "updatedAt" | "traits" | "measurables" | "targetPositions" | "notes"> & {
    traits?: Partial<Traits>;
    measurables?: Measurables;
    targetPositions?: PositionId[];
    notes?: string;
  }) => string;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  setTrait: (id: string, trait: TraitId, value: number) => void;
  setMeasurable: (id: string, key: keyof Measurables, value: number | undefined) => void;
  logEval: (playerId: string, drillId: string, score: number, note?: string) => void;
  removeEval: (logId: string) => void;
  toggleCompare: (playerId: string) => void;
  clearCompare: () => void;
  seedDemoRoster: () => void;
  clearRoster: () => void;
}

function uid() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function now() {
  return new Date().toISOString();
}

function cloudCatch(err: unknown) {
  const msg = err instanceof Error ? err.message : "Cloud sync failed";
  console.error("[roster cloud]", err);
  useRosterStore.setState({ cloudError: msg });
}

const DEMO: Array<
  Omit<Player, "id" | "createdAt" | "updatedAt"> & { id?: string }
> = [
  {
    firstName: "Marcus",
    lastName: "Hale",
    number: "7",
    gradeOrYear: "Jr",
    listedPosition: "qb",
    targetPositions: ["qb", "st"],
    traits: {
      speed: 6,
      power: 5,
      agility: 7,
      hands: 8,
      toughness: 7,
      iq: 9,
      leadership: 9,
      bodyControl: 8,
      explosion: 6,
      competitiveness: 8,
    },
    measurables: {
      heightIn: 73,
      weightLb: 195,
      fortySec: 4.78,
      proAgilitySec: 4.35,
      verticalIn: 31,
    },
    notes: "High processor. Needs more velocity on deep outs.",
  },
  {
    firstName: "Jalen",
    lastName: "Brooks",
    number: "2",
    gradeOrYear: "Sr",
    listedPosition: "wr",
    targetPositions: ["wr", "db", "st"],
    traits: {
      speed: 9,
      power: 5,
      agility: 9,
      hands: 8,
      toughness: 6,
      iq: 7,
      leadership: 6,
      bodyControl: 9,
      explosion: 9,
      competitiveness: 8,
    },
    measurables: {
      heightIn: 71,
      weightLb: 175,
      fortySec: 4.48,
      proAgilitySec: 4.12,
      verticalIn: 36,
      broadIn: 120,
    },
    notes: "Burner. Press release still developing.",
  },
  {
    firstName: "Darius",
    lastName: "Cole",
    number: "44",
    gradeOrYear: "So",
    listedPosition: "lb",
    targetPositions: ["lb", "rb", "st"],
    traits: {
      speed: 7,
      power: 8,
      agility: 7,
      hands: 5,
      toughness: 9,
      iq: 8,
      leadership: 7,
      bodyControl: 7,
      explosion: 8,
      competitiveness: 9,
    },
    measurables: {
      heightIn: 72,
      weightLb: 215,
      fortySec: 4.72,
      proAgilitySec: 4.28,
      verticalIn: 33,
    },
    notes: "Violent closer. Watch false steps on zone.",
  },
  {
    firstName: "Eli",
    lastName: "Nguyen",
    number: "55",
    gradeOrYear: "Sr",
    listedPosition: "ol",
    targetPositions: ["ol", "dl"],
    traits: {
      speed: 4,
      power: 9,
      agility: 6,
      hands: 3,
      toughness: 9,
      iq: 8,
      leadership: 8,
      bodyControl: 7,
      explosion: 7,
      competitiveness: 8,
    },
    measurables: {
      heightIn: 75,
      weightLb: 285,
      fortySec: 5.35,
      proAgilitySec: 4.75,
      verticalIn: 26,
    },
    notes: "Anchor tackle. Can swing to 3T in emergency.",
  },
  {
    firstName: "Chris",
    lastName: "Patel",
    number: "11",
    gradeOrYear: "Fr",
    listedPosition: "db",
    targetPositions: ["db", "wr", "st"],
    traits: {
      speed: 8,
      power: 4,
      agility: 8,
      hands: 7,
      toughness: 6,
      iq: 6,
      leadership: 5,
      bodyControl: 8,
      explosion: 7,
      competitiveness: 7,
    },
    measurables: {
      heightIn: 70,
      weightLb: 165,
      fortySec: 4.58,
      proAgilitySec: 4.2,
      verticalIn: 34,
    },
    notes: "Raw freshman — project as boundary or slot.",
  },
  {
    firstName: "Andre",
    lastName: "Sims",
    number: "33",
    gradeOrYear: "Jr",
    listedPosition: "rb",
    targetPositions: ["rb", "lb", "st"],
    traits: {
      speed: 8,
      power: 7,
      agility: 8,
      hands: 7,
      toughness: 8,
      iq: 7,
      leadership: 6,
      bodyControl: 8,
      explosion: 8,
      competitiveness: 8,
    },
    measurables: {
      heightIn: 70,
      weightLb: 200,
      fortySec: 4.55,
      proAgilitySec: 4.18,
      verticalIn: 35,
      broadIn: 118,
    },
    notes: "Three-down back potential. Pass pro improving.",
  },
];

export const useRosterStore = create<RosterState>()(
  persist(
    (set, get) => ({
      players: [],
      evalLogs: [],
      compareIds: [],
      cloudUserId: null,
      cloudStatus: "idle",
      cloudError: null,

      setCloudUser: async (userId) => {
        if (!userId) {
          set({
            cloudUserId: null,
            cloudStatus: "idle",
            cloudError: null,
            // keep local/demo data when signing out of cloud
          });
          return;
        }
        set({ cloudUserId: userId, cloudStatus: "loading", cloudError: null });
        try {
          const data = await fetchRosterCloud(userId);
          set({
            players: data.players,
            evalLogs: data.evalLogs,
            compareIds: [],
            cloudStatus: "ready",
          });
        } catch (err) {
          cloudCatch(err);
          set({ cloudStatus: "error" });
        }
      },

      addPlayer: (input) => {
        const id = uid();
        const ts = now();
        const player: Player = {
          id,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          number: input.number,
          gradeOrYear: input.gradeOrYear,
          listedPosition: input.listedPosition,
          targetPositions: input.targetPositions ?? [],
          traits: { ...emptyTraits(5), ...input.traits },
          measurables: { ...input.measurables },
          notes: input.notes ?? "",
          createdAt: ts,
          updatedAt: ts,
        };
        set({ players: [...get().players, player] });
        const userId = get().cloudUserId;
        if (userId) {
          void upsertPlayerCloud(player, userId).catch(cloudCatch);
        }
        return id;
      },

      updatePlayer: (id, patch) => {
        set({
          players: get().players.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...patch,
                  traits: patch.traits ? { ...p.traits, ...patch.traits } : p.traits,
                  measurables: patch.measurables
                    ? { ...p.measurables, ...patch.measurables }
                    : p.measurables,
                  updatedAt: now(),
                }
              : p,
          ),
        });
        const userId = get().cloudUserId;
        const player = get().players.find((p) => p.id === id);
        if (userId && player) {
          void upsertPlayerCloud(player, userId).catch(cloudCatch);
        }
      },

      removePlayer: (id) => {
        set({
          players: get().players.filter((p) => p.id !== id),
          evalLogs: get().evalLogs.filter((e) => e.playerId !== id),
          compareIds: get().compareIds.filter((x) => x !== id),
        });
        const userId = get().cloudUserId;
        if (userId) {
          void deletePlayerCloud(id, userId).catch(cloudCatch);
        }
      },

      setTrait: (id, trait, value) => {
        const v = Math.max(1, Math.min(10, Math.round(value)));
        set({
          players: get().players.map((p) =>
            p.id === id
              ? {
                  ...p,
                  traits: { ...p.traits, [trait]: v },
                  updatedAt: now(),
                }
              : p,
          ),
        });
        const userId = get().cloudUserId;
        const player = get().players.find((p) => p.id === id);
        if (userId && player) {
          void upsertPlayerCloud(player, userId).catch(cloudCatch);
        }
      },

      setMeasurable: (id, key, value) => {
        set({
          players: get().players.map((p) =>
            p.id === id
              ? {
                  ...p,
                  measurables: {
                    ...p.measurables,
                    [key]: value == null || Number.isNaN(value) ? undefined : value,
                  },
                  updatedAt: now(),
                }
              : p,
          ),
        });
        const userId = get().cloudUserId;
        const player = get().players.find((p) => p.id === id);
        if (userId && player) {
          void upsertPlayerCloud(player, userId).catch(cloudCatch);
        }
      },

      logEval: (playerId, drillId, score, note) => {
        const entry: DrillEvalLog = {
          id: uid(),
          playerId,
          drillId,
          score: Math.max(1, Math.min(10, Math.round(score))),
          note,
          at: now(),
        };
        set({ evalLogs: [...get().evalLogs, entry] });
        const userId = get().cloudUserId;
        if (userId) {
          void insertEvalCloud(entry, userId).catch(cloudCatch);
        }
      },

      removeEval: (logId) => {
        set({ evalLogs: get().evalLogs.filter((e) => e.id !== logId) });
        const userId = get().cloudUserId;
        if (userId) {
          void deleteEvalCloud(logId, userId).catch(cloudCatch);
        }
      },

      toggleCompare: (playerId) => {
        const cur = get().compareIds;
        if (cur.includes(playerId)) {
          set({ compareIds: cur.filter((id) => id !== playerId) });
          return;
        }
        if (cur.length >= 4) return;
        set({ compareIds: [...cur, playerId] });
      },

      clearCompare: () => set({ compareIds: [] }),

      seedDemoRoster: () => {
        const ts = now();
        // Fresh ids every seed so multi-coach / multi-device never collide on PK
        const players: Player[] = DEMO.map((d) => ({
          ...d,
          id: uid(),
          createdAt: ts,
          updatedAt: ts,
        }));
        set({ players, evalLogs: [], compareIds: [] });
        const userId = get().cloudUserId;
        if (userId) {
          void replaceRosterCloud(players, userId).catch(cloudCatch);
        }
      },

      clearRoster: () => {
        set({ players: [], evalLogs: [], compareIds: [] });
        const userId = get().cloudUserId;
        if (userId) {
          void clearRosterCloud(userId).catch(cloudCatch);
        }
      },
    }),
    {
      name: "gridiron-ready-roster",
      // Don't persist cloud session fields — rehydrate from Supabase on login
      partialize: (s) => ({
        players: s.cloudUserId ? [] : s.players,
        evalLogs: s.cloudUserId ? [] : s.evalLogs,
        compareIds: s.compareIds,
      }),
    },
  ),
);

/** Average eval scores by trait for a player (from mapped drills). */
export function drillBoostsForPlayer(
  playerId: string,
  logs: DrillEvalLog[],
  evalMap: { drillId: string; traits: TraitId[] }[],
): Partial<Record<TraitId, number>> {
  const traitScores: Partial<Record<TraitId, number[]>> = {};
  for (const log of logs) {
    if (log.playerId !== playerId) continue;
    const map = evalMap.find((e) => e.drillId === log.drillId);
    if (!map) continue;
    for (const t of map.traits) {
      if (!traitScores[t]) traitScores[t] = [];
      traitScores[t]!.push(log.score);
    }
  }
  const out: Partial<Record<TraitId, number>> = {};
  for (const [t, arr] of Object.entries(traitScores) as [TraitId, number[]][]) {
    if (!arr?.length) continue;
    out[t] = arr.reduce((a, b) => a + b, 0) / arr.length;
  }
  return out;
}

export function playerDisplayName(p: Player): string {
  return `${p.firstName} ${p.lastName}`;
}

export function playerSortKey(p: Player): string {
  return `${p.lastName} ${p.firstName}`.toLowerCase();
}
