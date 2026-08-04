import type { PositionId } from "./positions";

/** Coach-scored traits (1–10). */
export type TraitId =
  | "speed"
  | "power"
  | "agility"
  | "hands"
  | "toughness"
  | "iq"
  | "leadership"
  | "bodyControl"
  | "explosion"
  | "competitiveness";

export const TRAIT_LABELS: Record<TraitId, string> = {
  speed: "Speed",
  power: "Power / size",
  agility: "Agility / COD",
  hands: "Hands / ball skills",
  toughness: "Toughness",
  iq: "Football IQ",
  leadership: "Leadership",
  bodyControl: "Body control",
  explosion: "Explosion",
  competitiveness: "Competitiveness",
};

export const TRAIT_ORDER: TraitId[] = [
  "speed",
  "explosion",
  "agility",
  "power",
  "hands",
  "bodyControl",
  "iq",
  "toughness",
  "leadership",
  "competitiveness",
];

export type Traits = Record<TraitId, number>;

export function emptyTraits(fill = 5): Traits {
  return {
    speed: fill,
    power: fill,
    agility: fill,
    hands: fill,
    toughness: fill,
    iq: fill,
    leadership: fill,
    bodyControl: fill,
    explosion: fill,
    competitiveness: fill,
  };
}

/** Measurables — optional; used to nudge fit scores. */
export interface Measurables {
  heightIn?: number;
  weightLb?: number;
  fortySec?: number;
  proAgilitySec?: number;
  verticalIn?: number;
  broadIn?: number;
}

/** Ideal trait weights per position (sum need not be 1; normalized in scorer). */
export interface PositionProfile {
  positionId: PositionId;
  weights: Partial<Record<TraitId, number>>;
  /** Soft targets for measurables */
  ideal?: {
    minHeightIn?: number;
    maxHeightIn?: number;
    minWeightLb?: number;
    maxWeightLb?: number;
    maxFortySec?: number;
    maxProAgilitySec?: number;
    minVerticalIn?: number;
  };
  blurb: string;
}

export const POSITION_PROFILES: PositionProfile[] = [
  {
    positionId: "qb",
    blurb: "Processing, leadership, and accuracy under structure — mobility is a bonus.",
    weights: {
      iq: 1.4,
      leadership: 1.3,
      hands: 1.1,
      bodyControl: 1.0,
      competitiveness: 1.1,
      toughness: 0.9,
      speed: 0.7,
      agility: 0.8,
      explosion: 0.7,
      power: 0.6,
    },
    ideal: { minHeightIn: 70, maxFortySec: 5.1 },
  },
  {
    positionId: "rb",
    blurb: "Vision, contact balance, and burst — hands for the pass game.",
    weights: {
      explosion: 1.3,
      power: 1.2,
      agility: 1.2,
      speed: 1.1,
      toughness: 1.1,
      hands: 0.9,
      bodyControl: 1.1,
      iq: 0.9,
      competitiveness: 1.0,
      leadership: 0.6,
    },
    ideal: { maxFortySec: 4.7, maxProAgilitySec: 4.4, minVerticalIn: 30 },
  },
  {
    positionId: "wr",
    blurb: "Speed, separation agility, and contested-catch body control.",
    weights: {
      speed: 1.4,
      agility: 1.3,
      hands: 1.3,
      bodyControl: 1.2,
      explosion: 1.1,
      iq: 0.9,
      competitiveness: 1.0,
      toughness: 0.7,
      power: 0.6,
      leadership: 0.5,
    },
    ideal: { maxFortySec: 4.65, minHeightIn: 68, minVerticalIn: 32 },
  },
  {
    positionId: "te",
    blurb: "Hybrid size, reliable hands, and enough power to win inline.",
    weights: {
      hands: 1.2,
      power: 1.2,
      bodyControl: 1.1,
      toughness: 1.1,
      iq: 1.0,
      speed: 0.9,
      agility: 0.9,
      explosion: 1.0,
      competitiveness: 1.0,
      leadership: 0.7,
    },
    ideal: { minHeightIn: 74, minWeightLb: 220, maxFortySec: 5.0 },
  },
  {
    positionId: "ol",
    blurb: "Power, leverage toughness, and processing on protections.",
    weights: {
      power: 1.5,
      toughness: 1.3,
      iq: 1.2,
      bodyControl: 1.1,
      explosion: 1.0,
      competitiveness: 1.0,
      leadership: 0.9,
      agility: 0.8,
      hands: 0.5,
      speed: 0.5,
    },
    ideal: { minWeightLb: 250, minHeightIn: 72 },
  },
  {
    positionId: "dl",
    blurb: "First-step explosion, power at the point, and relentless effort.",
    weights: {
      explosion: 1.4,
      power: 1.4,
      toughness: 1.2,
      competitiveness: 1.2,
      agility: 1.0,
      bodyControl: 1.0,
      speed: 0.9,
      iq: 0.9,
      leadership: 0.6,
      hands: 0.4,
    },
    ideal: { minWeightLb: 230, maxFortySec: 5.2 },
  },
  {
    positionId: "lb",
    blurb: "Diagnostics, thrash toughness, and COD to fit the run and drop.",
    weights: {
      iq: 1.3,
      toughness: 1.2,
      agility: 1.2,
      speed: 1.1,
      explosion: 1.1,
      power: 1.0,
      competitiveness: 1.1,
      bodyControl: 1.0,
      leadership: 1.0,
      hands: 0.7,
    },
    ideal: { maxFortySec: 4.8, maxProAgilitySec: 4.4, minWeightLb: 200 },
  },
  {
    positionId: "db",
    blurb: "Speed, hip fluidity, ball skills, and open-field competitiveness.",
    weights: {
      speed: 1.4,
      agility: 1.4,
      hands: 1.2,
      bodyControl: 1.2,
      iq: 1.1,
      explosion: 1.1,
      competitiveness: 1.1,
      toughness: 0.9,
      leadership: 0.7,
      power: 0.6,
    },
    ideal: { maxFortySec: 4.65, maxProAgilitySec: 4.3, minVerticalIn: 32 },
  },
  {
    positionId: "st",
    blurb: "Effort, speed to the ball, and dependable competitiveness in space.",
    weights: {
      speed: 1.3,
      competitiveness: 1.3,
      toughness: 1.2,
      agility: 1.1,
      explosion: 1.1,
      bodyControl: 1.0,
      iq: 0.9,
      leadership: 0.8,
      power: 0.7,
      hands: 0.8,
    },
    ideal: { maxFortySec: 4.8 },
  },
];

export function getProfile(positionId: PositionId): PositionProfile {
  return POSITION_PROFILES.find((p) => p.positionId === positionId)!;
}

/** Drills that feed evaluation — logged scores boost related traits. */
export interface EvalDrillMap {
  drillId: string;
  traits: TraitId[];
  label: string;
}

export const EVAL_DRILLS: EvalDrillMap[] = [
  {
    drillId: "pro-agility-5-10-5",
    traits: ["agility", "explosion"],
    label: "COD / pro agility",
  },
  {
    drillId: "sprint-ladder",
    traits: ["speed", "explosion"],
    label: "Straight-line speed",
  },
  {
    drillId: "cone-base-inside-box",
    traits: ["agility", "bodyControl"],
    label: "Cone COD base",
  },
  {
    drillId: "cone-advanced-inside-box",
    traits: ["agility", "bodyControl", "competitiveness"],
    label: "Advanced COD",
  },
  {
    drillId: "form-tackle-fit-progression",
    traits: ["toughness", "bodyControl", "iq"],
    label: "Tackle form",
  },
  {
    drillId: "catch-and-secure-gauntlet",
    traits: ["hands", "bodyControl"],
    label: "Hands / secure",
  },
  {
    drillId: "wr-route-tree-air",
    traits: ["agility", "hands", "iq"],
    label: "Route tree",
  },
  {
    drillId: "qb-drop-progression",
    traits: ["iq", "bodyControl", "leadership"],
    label: "QB drops",
  },
  {
    drillId: "ol-drive-block-fit",
    traits: ["power", "toughness", "explosion"],
    label: "OL drive fit",
  },
  {
    drillId: "dl-hand-combat-circuit",
    traits: ["power", "explosion", "competitiveness"],
    label: "DL hands",
  },
  {
    drillId: "db-backpedal-break",
    traits: ["agility", "speed", "bodyControl"],
    label: "DB pedal / break",
  },
  {
    drillId: "lb-scrape-and-fit",
    traits: ["iq", "agility", "toughness"],
    label: "LB scrape fit",
  },
  {
    drillId: "pursuit-angle-air",
    traits: ["speed", "iq", "competitiveness"],
    label: "Pursuit angles",
  },
  {
    drillId: "seven-on-seven",
    traits: ["iq", "hands", "competitiveness"],
    label: "7-on-7 compete",
  },
  {
    drillId: "hiit-gassers",
    traits: ["toughness", "competitiveness", "speed"],
    label: "Conditioning engine",
  },
  {
    drillId: "ball-security-conditioning",
    traits: ["hands", "toughness"],
    label: "Ball security",
  },
  {
    drillId: "stance-start-all",
    traits: ["explosion", "bodyControl"],
    label: "Stance & start",
  },
  {
    drillId: "plyo-power-pack",
    traits: ["explosion", "power"],
    label: "Plyometric power",
  },
];

export function getEvalDrill(drillId: string): EvalDrillMap | undefined {
  return EVAL_DRILLS.find((e) => e.drillId === drillId);
}

export function isEvalDrill(drillId: string): boolean {
  return EVAL_DRILLS.some((e) => e.drillId === drillId);
}

export interface FitScore {
  positionId: PositionId;
  score: number; // 0–100
  traitContribution: Partial<Record<TraitId, number>>;
  measurableBonus: number;
  drillBonus: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Convert trait 1–10 to 0–100 contribution after weight normalize. */
export function scorePositionFit(
  traits: Traits,
  measurables: Measurables | undefined,
  positionId: PositionId,
  /** Average logged drill score 1–10 per trait (optional boosts) */
  drillTraitBoosts?: Partial<Record<TraitId, number>>,
): FitScore {
  const profile = getProfile(positionId);
  const weights = profile.weights;
  const totalW = Object.values(weights).reduce((a, b) => a + (b ?? 0), 0) || 1;

  let weighted = 0;
  const traitContribution: Partial<Record<TraitId, number>> = {};

  for (const [trait, w] of Object.entries(weights) as [TraitId, number][]) {
    if (!w) continue;
    const base = clamp(traits[trait] ?? 5, 1, 10);
    const boost = drillTraitBoosts?.[trait];
    const effective = boost != null ? clamp(base * 0.7 + boost * 0.3, 1, 10) : base;
    const part = (effective / 10) * (w / totalW) * 100;
    traitContribution[trait] = Math.round(part * 10) / 10;
    weighted += part;
  }

  let measurableBonus = 0;
  const ideal = profile.ideal;
  if (ideal && measurables) {
    let hits = 0;
    let checks = 0;
    const check = (ok: boolean) => {
      checks++;
      if (ok) hits++;
    };
    if (ideal.minHeightIn != null && measurables.heightIn != null)
      check(measurables.heightIn >= ideal.minHeightIn);
    if (ideal.maxHeightIn != null && measurables.heightIn != null)
      check(measurables.heightIn <= ideal.maxHeightIn);
    if (ideal.minWeightLb != null && measurables.weightLb != null)
      check(measurables.weightLb >= ideal.minWeightLb);
    if (ideal.maxWeightLb != null && measurables.weightLb != null)
      check(measurables.weightLb <= ideal.maxWeightLb);
    if (ideal.maxFortySec != null && measurables.fortySec != null)
      check(measurables.fortySec <= ideal.maxFortySec);
    if (ideal.maxProAgilitySec != null && measurables.proAgilitySec != null)
      check(measurables.proAgilitySec <= ideal.maxProAgilitySec);
    if (ideal.minVerticalIn != null && measurables.verticalIn != null)
      check(measurables.verticalIn >= ideal.minVerticalIn);
    if (checks > 0) {
      // up to +8 points for hitting measurable windows
      measurableBonus = (hits / checks) * 8;
    }
  }

  let drillBonus = 0;
  if (drillTraitBoosts) {
    const vals = Object.values(drillTraitBoosts).filter((v) => v != null) as number[];
    if (vals.length) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      // up to +5 from strong eval drill history
      drillBonus = ((avg - 5) / 5) * 5;
    }
  }

  const score = clamp(Math.round(weighted + measurableBonus + drillBonus), 0, 100);

  return {
    positionId,
    score,
    traitContribution,
    measurableBonus: Math.round(measurableBonus * 10) / 10,
    drillBonus: Math.round(drillBonus * 10) / 10,
  };
}

export function rankPositions(
  traits: Traits,
  measurables?: Measurables,
  drillTraitBoosts?: Partial<Record<TraitId, number>>,
): FitScore[] {
  return POSITION_PROFILES.map((p) =>
    scorePositionFit(traits, measurables, p.positionId, drillTraitBoosts),
  ).sort((a, b) => b.score - a.score);
}

export function formatHeight(inches?: number): string {
  if (inches == null || Number.isNaN(inches)) return "—";
  const ft = Math.floor(inches / 12);
  const inn = Math.round(inches % 12);
  return `${ft}'${inn}"`;
}
