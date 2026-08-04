import type { FieldPoint, Play, PlayPhase } from "./plays";

/**
 * Simulated defensive "look" on offensive diagrams — contact points,
 * double-team targets, and GOD (Gap On Down) engagement cues.
 */
export interface LookDefender {
  id: string;
  tag: string;
  label: string;
  path: FieldPoint[];
  /**
   * Offensive role ids that engage this defender under GOD / scheme rules.
   * Two+ ids = double-team / combo.
   */
  engagedBy: string[];
  /** Emphasize as a double-team / combo landmark */
  doubleTeam?: boolean;
  job: string;
}

export interface PlayLook {
  /** Front label shown on the diagram */
  front: string;
  note: string;
  defenders: LookDefender[];
  /** Per-phase end progress 0–1 keyed by defender id (aligned to play.phases order) */
  phaseProgress: Record<string, number>[];
}

function d(
  id: string,
  tag: string,
  label: string,
  path: FieldPoint[],
  engagedBy: string[],
  job: string,
  doubleTeam?: boolean,
): LookDefender {
  return { id, tag, label, path, engagedBy, job, doubleTeam };
}

/** Even 4-3 over: shade strong (right) — common youth/high-school install front. */
function front43Over(opts: {
  /** playside for run (right = power/oz default) */
  playside?: "L" | "R";
  /** who doubles the down man (combo) */
  combo?: [string, string];
  comboTarget?: "N" | "T" | "E";
  /** FB/H iso target LB */
  isoLb?: "M" | "W" | "S";
  /** puller leave creates free runner risk */
  hingeVs?: string;
}): PlayLook["defenders"] {
  const ps = opts.playside ?? "R";
  // Alignments: DL on LOS just defense side of 50
  const deL = d(
    "look-de-l",
    "E",
    "LE",
    [
      [34, 49],
      [33, 48],
      [32, 46],
    ],
    ps === "L" ? ["lt", "y"] : ["lt"],
    "Edge — base/hinge or reach depending on call.",
  );
  const dtL = d(
    "look-dt-l",
    "N",
    "Nose / shade",
    [
      [46, 49],
      [46, 47],
      [45, 45],
    ],
    opts.comboTarget === "N" && opts.combo
      ? opts.combo
      : ["lg", "c"],
    "A/B shade — GOD gap + down rules.",
    opts.comboTarget === "N",
  );
  const dtR = d(
    "look-dt-r",
    "T",
    "3-tech",
    [
      [56, 49],
      [57, 47],
      [58, 45],
    ],
    opts.comboTarget === "T" && opts.combo
      ? opts.combo
      : ["rg", "c"],
    "3-tech — base, down, or combo post.",
    opts.comboTarget === "T",
  );
  const deR = d(
    "look-de-r",
    "E",
    "RE",
    [
      [66, 49],
      [67, 48],
      [68, 46],
    ],
    ps === "R" ? ["rt", "y"] : ["rt"],
    "Edge EMOL — reach/seal or base.",
    opts.comboTarget === "E",
  );

  const will = d(
    "look-will",
    "W",
    "Will",
    [
      [38, 45],
      [37, 43],
      [36, 41],
    ],
    opts.isoLb === "W" ? ["fb"] : ps === "L" ? ["lg", "lt"] : ["lt"],
    "Flow LB — climb / iso / scrape.",
    opts.isoLb === "W",
  );
  const mike = d(
    "look-mike",
    "M",
    "Mike",
    [
      [50, 45],
      [50, 43],
      [51, 41],
    ],
    opts.isoLb === "M"
      ? ["fb"]
      : opts.combo
        ? [opts.combo[1]!] // climber often peels here
        : ["c", "lg"],
    "Mike — combo peel, iso, or flow.",
    opts.isoLb === "M" || Boolean(opts.combo),
  );
  const sam = d(
    "look-sam",
    "S",
    "Sam",
    [
      [62, 45],
      [63, 43],
      [64, 41],
    ],
    opts.isoLb === "S" ? ["fb"] : ps === "R" ? ["rg", "rt"] : ["rt"],
    "Sam — force / scrape / kick target.",
    opts.isoLb === "S",
  );

  const fs = d(
    "look-fs",
    "FS",
    "Free safety",
    [
      [50, 34],
      [50, 32],
      [50, 30],
    ],
    [],
    "Deep middle — late alley / cutback.",
  );
  const ss = d(
    "look-ss",
    "SS",
    "Strong safety",
    [
      [64, 38],
      [65, 36],
      [66, 34],
    ],
    ps === "R" ? ["y", "z"] : ["y"],
    "Box/alley — force or fold.",
  );
  const cbL = d(
    "look-cb-l",
    "CB",
    "LCB",
    [
      [16, 48],
      [15, 46],
      [14, 44],
    ],
    ["x"],
    "Boundary corner — stalk block target.",
  );
  const cbR = d(
    "look-cb-r",
    "CB",
    "RCB",
    [
      [84, 48],
      [85, 46],
      [86, 44],
    ],
    ["z"],
    "Field corner — stalk / force.",
  );

  // Slight motion if play goes left — swap shade emphasis already via engagements
  return [deL, dtL, dtR, deR, will, mike, sam, fs, ss, cbL, cbR];
}

function prog(
  defenders: LookDefender[],
  values: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of defenders) {
    out[d.id] = values[d.id] ?? 0;
  }
  return out;
}

function standardPhases(
  defenders: LookDefender[],
  heavy: string[] = [],
): Record<string, number>[] {
  const light: Record<string, number> = {};
  const mid: Record<string, number> = {};
  const end: Record<string, number> = {};
  for (const d of defenders) {
    const boost = heavy.includes(d.id) ? 0.1 : 0;
    light[d.id] = 0.15 + boost;
    mid[d.id] = 0.55 + boost * 0.5;
    end[d.id] = 1;
  }
  return [prog(defenders, light), prog(defenders, mid), prog(defenders, end)];
}

const LOOKS: Record<string, PlayLook> = {
  dive: (() => {
    const defenders = front43Over({ playside: "R" });
    // GOD: base the man in front — 1-on-1 contact, no designed double
    defenders.forEach((x) => {
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg"];
        x.doubleTeam = false;
        x.job = "3-tech — GOD base by RG. Primary contact point.";
      }
      if (x.id === "look-dt-l") {
        x.engagedBy = ["lg", "c"];
        x.job = "Shade — C/LG gap+down. Possible accidental double.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["fb"];
        x.job = "Mike — FB lead / first color in the hole.";
        x.doubleTeam = false;
      }
    });
    return {
      front: "4-3 Over · GOD base",
      note: "Gap On Down: each OL owns gap + down. Contact points are mostly 1-on-1 — doubles only if uncovered rules create them.",
      defenders,
      phaseProgress: standardPhases(defenders, ["look-dt-r", "look-mike"]),
    };
  })(),

  iso: (() => {
    const defenders = front43Over({
      playside: "R",
      combo: ["lg", "c"],
      comboTarget: "N",
      isoLb: "M",
    });
    defenders.forEach((x) => {
      if (x.id === "look-dt-l") {
        x.engagedBy = ["lg", "c"];
        x.doubleTeam = true;
        x.job = "Double post — LG/C combo. Climb on flow to Mike.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["fb"];
        x.doubleTeam = true;
        x.job = "Iso target — FB alone. Combo peels here on flow.";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg"];
        x.job = "3-tech base/down — wall for the iso crease.";
      }
      if (x.id === "look-sam") {
        x.engagedBy = ["rt", "y"];
        x.job = "Sam scrape — edge of the wall.";
      }
    });
    return {
      front: "4-3 Over · GOD + combo",
      note: "First designed double (LG/C on down man) plus FB iso on Mike. Contact rings mark the combo and iso points.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-dt-l",
        "look-mike",
        "look-dt-r",
      ]),
    };
  })(),

  "inside-zone": (() => {
    const defenders = front43Over({
      playside: "R",
      combo: ["lg", "c"],
      comboTarget: "N",
    });
    defenders.forEach((x) => {
      if (x.id === "look-dt-l") {
        x.engagedBy = ["lg", "c"];
        x.doubleTeam = true;
        x.job = "Zone combo — slide to gap, drive as one, peel on flow.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["lg", "c"];
        x.doubleTeam = true;
        x.job = "Second-level peel from the combo — area, not jersey.";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg", "rt"];
        x.doubleTeam = true;
        x.job = "Playside zone combo / base — vertical seam.";
      }
      if (x.id === "look-de-r") {
        x.engagedBy = ["rt", "y"];
        x.job = "EMOL — zone reach or base depending on call.";
      }
      if (x.id === "look-will") {
        x.engagedBy = ["lt", "h"];
        x.job = "Backside flow — cutoff / climb.";
      }
    });
    return {
      front: "4-3 Over · Zone doubles",
      note: "Zone doubles are area-based: slide then drive. Rings show combo landmarks; peel to LB on flow.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-dt-l",
        "look-dt-r",
        "look-mike",
      ]),
    };
  })(),

  power: (() => {
    const defenders = front43Over({ playside: "R" });
    defenders.forEach((x) => {
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg", "rt"];
        x.doubleTeam = true;
        x.job = "Down wall — RG/RT (and Y) create the power wall.";
      }
      if (x.id === "look-de-r") {
        x.engagedBy = ["y", "rt"];
        x.doubleTeam = true;
        x.job = "Edge of the wall — down / hinge.";
      }
      if (x.id === "look-sam") {
        x.engagedBy = ["lg", "fb"];
        x.doubleTeam = true;
        x.job = "Kick/wrap target — puller + FB first color.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["lg", "fb"];
        x.job = "Wrap or lead — second level off the pull.";
      }
      if (x.id === "look-de-l") {
        x.engagedBy = ["lt"];
        x.job = "Hinge threat — free runner if BS tackle quits.";
      }
      if (x.id === "look-dt-l") {
        x.engagedBy = ["c"];
        x.job = "A-gap — center blocks back when G pulls.";
      }
    });
    return {
      front: "4-3 Over · Gap / GOD",
      note: "Down blocks wall playside; puller + FB meet Sam/Mike. Contact on the wall and at the kick/wrap point.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-dt-r",
        "look-de-r",
        "look-sam",
      ]),
    };
  })(),

  reach: (() => {
    const defenders = front43Over({ playside: "R" });
    defenders.forEach((x) => {
      if (x.id === "look-de-r") {
        x.engagedBy = ["rt", "y"];
        x.doubleTeam = true;
        x.job = "EMOL — THE reach/seal. Keep him inside so toss stays outside.";
      }
      if (x.id === "look-sam") {
        x.engagedBy = ["y", "h"];
        x.job = "Force/scrape — insert or crack help.";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg"];
        x.job = "Reach track — gain width with the line.";
      }
      if (x.id === "look-cb-r") {
        x.engagedBy = ["z"];
        x.job = "Perimeter stalk — toss finish.";
      }
      if (x.id === "look-ss") {
        x.engagedBy = ["z", "y"];
        x.job = "Alley — force or fold vs toss.";
      }
    });
    return {
      front: "4-3 Over · Outside / toss",
      note: "Pure outside run. Primary contact is the EMOL seal (RT/Y). No designed cutback double — edge or fail.",
      defenders,
      phaseProgress: standardPhases(defenders, ["look-de-r", "look-sam", "look-cb-r"]),
    };
  })(),

  "outside-zone": (() => {
    const defenders = front43Over({ playside: "R", combo: ["rg", "rt"], comboTarget: "T" });
    defenders.forEach((x) => {
      if (x.id === "look-de-r") {
        x.engagedBy = ["rt", "y"];
        x.doubleTeam = true;
        x.job = "EMOL — reach in unison with the five.";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["rg", "rt"];
        x.doubleTeam = true;
        x.job = "Zone combo — climb when reached.";
      }
      if (x.id === "look-sam") {
        x.engagedBy = ["rg", "y"];
        x.job = "Flow LB — cutback key if crease opens inside.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["c", "lg"];
        x.job = "Flow — second-level zone peel.";
      }
      if (x.id === "look-will") {
        x.engagedBy = ["lt", "lg"];
        x.job = "Backside chase — cutoff.";
      }
    });
    return {
      front: "4-3 Over · OZ stretch",
      note: "Full-line reach contact across the front. Cutback appears when a defender crosses face after the stretch.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-de-r",
        "look-dt-r",
        "look-sam",
      ]),
    };
  })(),

  "counter-simple": (() => {
    const defenders = front43Over({ playside: "L" });
    // Counter back to the left — only G pulls from right
    defenders.forEach((x) => {
      if (x.id === "look-dt-l") {
        x.engagedBy = ["lt", "lg"];
        x.doubleTeam = true;
        x.job = "Down wall — counter-side contact.";
      }
      if (x.id === "look-de-l") {
        x.engagedBy = ["lt", "x"];
        x.job = "Edge of counter wall.";
      }
      if (x.id === "look-will") {
        x.engagedBy = ["rg", "fb"];
        x.doubleTeam = true;
        x.job = "Kick/wrap — ONLY guard pulls to this color.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["rg", "fb"];
        x.job = "Second level off single puller.";
      }
      if (x.id === "look-de-r") {
        x.engagedBy = ["rt"];
        x.job = "Hinge side — RT stays home (no tackle pull).";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["c"];
        x.job = "Vacated by pull — center covers.";
      }
    });
    return {
      front: "4-3 Over · CTR-S (G only)",
      note: "Simplified counter: single puller (G). Contact on the down wall and at the kick. RT hinges vs DE — not a second puller.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-dt-l",
        "look-will",
        "look-de-r",
      ]),
    };
  })(),

  counter: (() => {
    const defenders = front43Over({ playside: "L" });
    defenders.forEach((x) => {
      if (x.id === "look-dt-l") {
        x.engagedBy = ["lt", "lg"];
        x.doubleTeam = true;
        x.job = "Down wall — full counter side.";
      }
      if (x.id === "look-de-l") {
        x.engagedBy = ["lt"];
        x.job = "Wall edge.";
      }
      if (x.id === "look-will") {
        x.engagedBy = ["rg", "rt"];
        x.doubleTeam = true;
        x.job = "Dual pull target — G lead, T trail.";
      }
      if (x.id === "look-mike") {
        x.engagedBy = ["rt", "fb"];
        x.doubleTeam = true;
        x.job = "Wrap / lead from second puller + FB.";
      }
      if (x.id === "look-de-r") {
        x.engagedBy = ["y"];
        x.job = "Backside cutoff — both G and T left.";
      }
      if (x.id === "look-dt-r") {
        x.engagedBy = ["c"];
        x.job = "Vacated B — center must cover.";
      }
    });
    return {
      front: "4-3 Over · Full CTR (G+T)",
      note: "Full counter: two pullers. Contact denser at the kick/wrap — G and T both arrive. Backside hinge replaced by TE cutoff.",
      defenders,
      phaseProgress: standardPhases(defenders, [
        "look-will",
        "look-mike",
        "look-dt-l",
      ]),
    };
  })(),
};

/** Attach look data onto offensive plays (mutates in place). */
export function applyPlayLooks(plays: Play[]): void {
  for (const play of plays) {
    if (play.side !== "offense") continue;
    const look = LOOKS[play.id];
    if (!look) continue;
    play.lookFront = look.front;
    play.lookNote = look.note;
    play.look = look.defenders;
    play.phases.forEach((phase: PlayPhase, i: number) => {
      phase.lookProgress = look.phaseProgress[i] ?? look.phaseProgress.at(-1);
    });
  }
}

export function lookProgressAtPhaseStart(
  play: Play,
  phaseIndex: number,
  lookId: string,
): number {
  if (phaseIndex <= 0) return 0;
  for (let i = phaseIndex - 1; i >= 0; i--) {
    const v = play.phases[i]?.lookProgress?.[lookId];
    if (typeof v === "number") return v;
  }
  return 0;
}

export function lookProgressAtPhaseEnd(
  play: Play,
  phaseIndex: number,
  lookId: string,
): number {
  for (let i = phaseIndex; i >= 0; i--) {
    const v = play.phases[i]?.lookProgress?.[lookId];
    if (typeof v === "number") return v;
  }
  return 0;
}
