import type { Intensity } from "./drills";
import { getDrillsByIds } from "./drills";

export type PracticePhase = "acclimate" | "build" | "sharpen";

export interface PracticeBlock {
  title: string;
  minutes: number;
  drillIds: string[];
  notes?: string;
}

export interface PracticePlan {
  id: string;
  day: number;
  title: string;
  phase: PracticePhase;
  focus: string;
  totalMinutes: number;
  intensity: Intensity;
  helmets: "none" | "helmets" | "shells";
  contact: "none";
  objectives: string[];
  blocks: PracticeBlock[];
  coachNotes: string[];
  /** Competitive games that fit this day */
  gameIds?: string[];
}

export const PHASE_LABELS: Record<PracticePhase, string> = {
  acclimate: "Acclimate",
  build: "Build",
  sharpen: "Sharpen",
};

export const practicePlans: PracticePlan[] = [
  {
    id: "day-1",
    day: 1,
    title: "Camp Opener — Move Well",
    phase: "acclimate",
    focus: "Movement quality, baselines, culture",
    totalMinutes: 75,
    intensity: "moderate",
    helmets: "none",
    contact: "none",
    objectives: [
      "Establish warm-up standards and spacing",
      "Install Base Inside/Outside Box from the cone sheet",
      "Baseline tempo fitness without max sprints",
    ],
    blocks: [
      {
        title: "Arrival activation",
        minutes: 12,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Cone sheet — base box",
        minutes: 14,
        drillIds: ["cone-base-inside-box", "cone-base-outside-box"],
        notes: "Walk patterns first; then live reps",
      },
      {
        title: "Position movement (air)",
        minutes: 16,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "lb-te-zone-drops",
          "specialists-tempo",
        ],
        notes: "Split by group simultaneously",
      },
      {
        title: "Team tempo",
        minutes: 16,
        drillIds: ["110-yard-tempo"],
        notes: "Volume by position group — not a gasser day",
      },
      {
        title: "Strength + recover",
        minutes: 14,
        drillIds: ["bodyweight-circuit", "mobility-cooldown"],
      },
    ],
    gameIds: ["red-light-green-light", "hot-potato-handoffs"],
    coachNotes: [
      "No competitive finish-line collisions on cone finishes",
      "Pull anyone with soft-tissue tightness early — replace with walk tempo",
      "Film the warm-up once so standards are clear for day 2",
    ],
  },
  {
    id: "day-2",
    day: 2,
    title: "Engine Day — Controlled Stress",
    phase: "acclimate",
    focus: "M patterns + COD introduction",
    totalMinutes: 80,
    intensity: "moderate",
    helmets: "none",
    contact: "none",
    objectives: [
      "Install Base Inside/Outside M",
      "Raise conditioning density carefully",
      "Lock in cool-down habits",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Cone sheet — M patterns",
        minutes: 16,
        drillIds: ["cone-base-inside-m", "cone-base-outside-m", "pro-agility-5-10-5"],
      },
      {
        title: "Position work",
        minutes: 18,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "lb-te-zone-drops",
          "ball-security-conditioning",
        ],
      },
      {
        title: "Conditioning",
        minutes: 16,
        drillIds: ["sprint-ladder"],
      },
      {
        title: "Core + cool-down",
        minutes: 14,
        drillIds: ["core-finisher", "mobility-cooldown"],
      },
    ],
    gameIds: ["steal-the-bacon", "mirror-mayhem"],
    coachNotes: [
      "Time a few pro-agility reps for curiosity, not ranking day",
      "Keep M valleys tight — center cone is a gate",
    ],
  },
  {
    id: "day-3",
    day: 3,
    title: "Power Introduction",
    phase: "acclimate",
    focus: "Advanced box intro + horizontal force",
    totalMinutes: 80,
    intensity: "moderate",
    helmets: "helmets",
    contact: "none",
    objectives: [
      "Introduce Advanced Inside Box (carioca + shuffle)",
      "Add sled drives for line/big skill",
      "Helmets only if required — still no contact",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Cone sheet — advanced box",
        minutes: 14,
        drillIds: ["cone-advanced-inside-box", "cone-base-inside-box"],
        notes: "Rehearse carioca/shuffle standards before speed",
      },
      {
        title: "Power / strength",
        minutes: 14,
        drillIds: ["sled-drive", "plyo-power-pack"],
      },
      {
        title: "Position installs",
        minutes: 18,
        drillIds: [
          "ol-dl-getoff-board",
          "wr-db-release-mirror",
          "lb-te-zone-drops",
          "specialists-tempo",
        ],
      },
      {
        title: "Finish",
        minutes: 12,
        drillIds: ["core-finisher", "mobility-cooldown"],
      },
    ],
    gameIds: ["line-getoff-duels", "whistle-reaction-wars"],
    coachNotes: [
      "Helmets are for posture awareness only — no thudding",
      "Carioca quality over carioca speed",
    ],
  },
  {
    id: "day-4",
    day: 4,
    title: "Change of Direction Lab",
    phase: "build",
    focus: "Pro agility + 360s + figure 8s",
    totalMinutes: 85,
    intensity: "high",
    helmets: "none",
    contact: "none",
    objectives: [
      "Own multi-direction COD under light fatigue",
      "Competitive reaction without contact",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "COD sheet",
        minutes: 20,
        drillIds: [
          "cone-360s",
          "cone-figure-8s",
          "pro-agility-5-10-5",
          "cone-advanced-inside-m",
        ],
      },
      {
        title: "Position COD",
        minutes: 18,
        drillIds: [
          "wr-db-release-mirror",
          "lb-te-zone-drops",
          "ball-security-conditioning",
        ],
      },
      {
        title: "Conditioning",
        minutes: 16,
        drillIds: ["hiit-gassers", "sprint-ladder"],
      },
      {
        title: "Recover",
        minutes: 12,
        drillIds: ["mobility-cooldown"],
      },
    ],
    gameIds: ["four-corner-chaos", "pursuit-angles", "partner-towels"],
    coachNotes: [
      "Games close practice — keep them non-contact and joyful",
      "Film one 5-10-5 for teaching angles",
    ],
  },
  {
    id: "day-5",
    day: 5,
    title: "Mid-Camp Compete",
    phase: "build",
    focus: "Team energy + mixed conditioning",
    totalMinutes: 85,
    intensity: "high",
    helmets: "helmets",
    contact: "none",
    objectives: [
      "Compete hard with zero tackling",
      "Mix relays and skill gauntlets",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Cone refresh",
        minutes: 12,
        drillIds: ["cone-base-inside-box", "cone-advanced-outside-box"],
      },
      {
        title: "Strength circuit",
        minutes: 14,
        drillIds: ["bodyweight-circuit", "sled-drive"],
      },
      {
        title: "Position compete (air)",
        minutes: 18,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "specialists-tempo",
        ],
      },
      {
        title: "Team conditioning",
        minutes: 14,
        drillIds: ["110-yard-tempo"],
      },
      {
        title: "Cool-down",
        minutes: 10,
        drillIds: ["mobility-cooldown"],
      },
    ],
    gameIds: [
      "cone-relay-gauntlet",
      "escape-artist",
      "around-the-world-relay",
      "flag-finish-dash",
    ],
    coachNotes: [
      "This is the fun day — still enforce spacing and soft tags only",
      "End on a team win, not individual shame",
    ],
  },
  {
    id: "day-6",
    day: 6,
    title: "Active Recovery + Skill",
    phase: "build",
    focus: "Lower volume, higher skill standards",
    totalMinutes: 70,
    intensity: "moderate",
    helmets: "none",
    contact: "none",
    objectives: [
      "Flush legs with tempo and mobility",
      "Touch ball security and accuracy",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 12,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Light COD",
        minutes: 12,
        drillIds: ["cone-figure-8s", "cone-base-outside-m"],
      },
      {
        title: "Skill stations",
        minutes: 20,
        drillIds: ["ball-security-conditioning", "specialists-tempo"],
      },
      {
        title: "Core + mobility",
        minutes: 16,
        drillIds: ["core-finisher", "mobility-cooldown"],
      },
    ],
    gameIds: ["qb-accuracy-gauntlet", "ultimate-air-ball", "king-of-the-grid"],
    coachNotes: ["Keep heart rates conversational on tempo segments"],
  },
  {
    id: "day-7",
    day: 7,
    title: "Advanced Patterns",
    phase: "build",
    focus: "X drills, advanced M, multi-style feet",
    totalMinutes: 85,
    intensity: "high",
    helmets: "none",
    contact: "none",
    objectives: [
      "Complete the cone sheet advanced set",
      "Compete on reaction and pursuit",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Advanced cone sheet",
        minutes: 22,
        drillIds: [
          "cone-advanced-inside-m",
          "cone-advanced-outside-m",
          "cone-inside-x",
          "cone-outside-x",
          "cone-360s",
        ],
      },
      {
        title: "Position",
        minutes: 18,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "lb-te-zone-drops",
        ],
      },
      {
        title: "Conditioning",
        minutes: 14,
        drillIds: ["hiit-gassers"],
      },
      {
        title: "Recover",
        minutes: 12,
        drillIds: ["mobility-cooldown"],
      },
    ],
    gameIds: ["pursuit-angles", "shark-tank-shuffles", "cod-ladder-wars"],
    coachNotes: ["X-drill bridges are controlled jogs, not sprints between starts"],
  },
  {
    id: "day-8",
    day: 8,
    title: "Sharpen — Speed Window",
    phase: "sharpen",
    focus: "Quality speed + clean competitive finishers",
    totalMinutes: 80,
    intensity: "high",
    helmets: "shells",
    contact: "none",
    objectives: [
      "Peak acceleration quality",
      "Shells for posture only if required",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 12,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Speed + COD",
        minutes: 18,
        drillIds: ["sprint-ladder", "pro-agility-5-10-5", "cone-base-inside-box"],
      },
      {
        title: "Power",
        minutes: 12,
        drillIds: ["plyo-power-pack", "sled-drive"],
      },
      {
        title: "Position",
        minutes: 16,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "specialists-tempo",
        ],
      },
      {
        title: "Cool-down",
        minutes: 12,
        drillIds: ["mobility-cooldown"],
      },
    ],
    gameIds: ["flag-finish-dash", "line-getoff-duels", "red-zone-burst"],
    coachNotes: ["Shells never mean contact — pull anyone who thuds"],
  },
  {
    id: "day-9",
    day: 9,
    title: "Game Day Rehearsal (Air)",
    phase: "sharpen",
    focus: "Team competitive block + standards",
    totalMinutes: 85,
    intensity: "high",
    helmets: "helmets",
    contact: "none",
    objectives: [
      "Run a full non-contact competitive period",
      "Rehearse communication under fatigue",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Team install (air)",
        minutes: 20,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "lb-te-zone-drops",
          "ball-security-conditioning",
        ],
      },
      {
        title: "Conditioning train",
        minutes: 16,
        drillIds: ["110-yard-tempo", "hiit-gassers"],
      },
      {
        title: "Strength + recover",
        minutes: 14,
        drillIds: ["bodyweight-circuit", "mobility-cooldown"],
      },
    ],
    gameIds: [
      "cone-relay-gauntlet",
      "ultimate-air-ball",
      "around-the-world-relay",
      "tempo-train",
    ],
    coachNotes: [
      "Games are the highlight — keep scoreboards visible",
      "Zero tolerance for contact celebrations that shove",
    ],
  },
  {
    id: "day-10",
    day: 10,
    title: "Camp Finale — Prove It",
    phase: "sharpen",
    focus: "Showcase standards, then celebrate",
    totalMinutes: 80,
    intensity: "high",
    helmets: "none",
    contact: "none",
    objectives: [
      "Retest key COD and tempo markers",
      "End camp with competitive joy",
    ],
    blocks: [
      {
        title: "Warm-up",
        minutes: 10,
        drillIds: ["dynamic-warmup-circuit"],
      },
      {
        title: "Retest window",
        minutes: 16,
        drillIds: ["pro-agility-5-10-5", "cone-advanced-inside-box", "sprint-ladder"],
      },
      {
        title: "Position pride",
        minutes: 16,
        drillIds: [
          "wr-db-release-mirror",
          "ol-dl-getoff-board",
          "lb-te-zone-drops",
          "specialists-tempo",
        ],
      },
      {
        title: "Team finisher",
        minutes: 14,
        drillIds: ["110-yard-tempo"],
      },
      {
        title: "Cool-down + close",
        minutes: 12,
        drillIds: ["mobility-cooldown"],
      },
    ],
    gameIds: [
      "four-corner-chaos",
      "steal-the-bacon",
      "flag-finish-dash",
      "cone-relay-gauntlet",
    ],
    coachNotes: [
      "Celebrate effort and standards, not just winners",
      "Preview next week's padded progression carefully",
    ],
  },
];

export function getPlanById(id: string): PracticePlan | undefined {
  return practicePlans.find((p) => p.id === id);
}

export function getPlanDrills(plan: PracticePlan) {
  return plan.blocks.flatMap((b) => getDrillsByIds(b.drillIds));
}

export function getPlanDrillCount(plan: PracticePlan): number {
  return plan.blocks.reduce((n, b) => n + b.drillIds.length, 0);
}
