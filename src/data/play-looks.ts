import type { FieldPoint, Play, PlayPhase, PlayRole } from "./plays";

/**
 * Simulated defensive looks + GOD blocking assignment detector.
 * Fronts are switchable; assignments recompute against the active front.
 */

export interface LookDefender {
  id: string;
  tag: string;
  label: string;
  path: FieldPoint[];
  /** Offensive role ids that engage this defender (2+ = double / combo). */
  engagedBy: string[];
  doubleTeam?: boolean;
  job: string;
}

export interface PlayLook {
  front: string;
  frontId: DefFrontId;
  note: string;
  defenders: LookDefender[];
  phaseProgress: Record<string, number>[];
}

export type DefFrontId =
  | "43-over"
  | "43-under"
  | "52"
  | "34"
  | "bear"
  | "33-stack";

export interface DefFrontMeta {
  id: DefFrontId;
  label: string;
  short: string;
  blurb: string;
}

export const DEF_FRONTS: DefFrontMeta[] = [
  {
    id: "43-over",
    label: "4-3 Over",
    short: "4-3 O",
    blurb: "Even front, shade strong — base install.",
  },
  {
    id: "43-under",
    label: "4-3 Under",
    short: "4-3 U",
    blurb: "Even front, shade weak — flips the 3-tech.",
  },
  {
    id: "52",
    label: "5-2 Eagle",
    short: "5-2",
    blurb: "Odd/even hybrid — five down, two LBs.",
  },
  {
    id: "34",
    label: "3-4 Odd",
    short: "3-4",
    blurb: "Odd front — nose + two ends, four LBs.",
  },
  {
    id: "bear",
    label: "Bear / Goal",
    short: "Bear",
    blurb: "Tight six-man surface — short yardage.",
  },
  {
    id: "33-stack",
    label: "3-3 Stack",
    short: "3-3",
    blurb: "Light box, stacked LBs — space + scrapes.",
  },
];

export type SchemeId =
  | "dive"
  | "iso"
  | "inside-zone"
  | "power"
  | "reach"
  | "outside-zone"
  | "counter-simple"
  | "counter";

function schemeOf(playId: string): SchemeId | null {
  const known: SchemeId[] = [
    "dive",
    "iso",
    "inside-zone",
    "power",
    "reach",
    "outside-zone",
    "counter-simple",
    "counter",
  ];
  return (known as string[]).includes(playId) ? (playId as SchemeId) : null;
}

function playsideOf(scheme: SchemeId): "L" | "R" {
  if (scheme === "counter" || scheme === "counter-simple") return "L";
  return "R";
}

function d(
  id: string,
  tag: string,
  label: string,
  path: FieldPoint[],
  job = "Alignment",
): LookDefender {
  return { id, tag, label, path, engagedBy: [], job };
}

/** Build raw front alignments (no assignments yet). */
export function buildFrontAlignments(frontId: DefFrontId): LookDefender[] {
  // Secondary stays fairly constant; front varies.
  const fs = d("look-fs", "FS", "Free safety", [[50, 34], [50, 32], [50, 30]], "Deep middle");
  const ss = d("look-ss", "SS", "Strong safety", [[64, 38], [65, 36], [66, 34]], "Box / alley");
  const cbL = d("look-cb-l", "CB", "LCB", [[16, 48], [15, 46], [14, 44]], "Boundary corner");
  const cbR = d("look-cb-r", "CB", "RCB", [[84, 48], [85, 46], [86, 44]], "Field corner");

  if (frontId === "43-over") {
    return [
      d("look-de-l", "E", "LE", [[34, 49], [33, 48], [32, 46]], "Weak end"),
      d("look-dt-l", "N", "1-tech / shade", [[46, 49], [46, 47], [45, 45]], "A-gap shade"),
      d("look-dt-r", "T", "3-tech", [[56, 49], [57, 47], [58, 45]], "Strong 3-tech"),
      d("look-de-r", "E", "RE", [[66, 49], [67, 48], [68, 46]], "Strong end"),
      d("look-will", "W", "Will", [[38, 45], [37, 43], [36, 41]], "Weak LB"),
      d("look-mike", "M", "Mike", [[50, 45], [50, 43], [51, 41]], "Mike"),
      d("look-sam", "S", "Sam", [[62, 45], [63, 43], [64, 41]], "Sam"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "43-under") {
    // Shade weak: 3-tech to offense left, 1-tech strong
    return [
      d("look-de-l", "E", "LE", [[34, 49], [33, 48], [32, 46]], "Weak end"),
      d("look-dt-l", "T", "3-tech (weak)", [[42, 49], [41, 47], [40, 45]], "Weak 3-tech"),
      d("look-dt-r", "N", "1-tech / shade", [[54, 49], [54, 47], [55, 45]], "Strong shade"),
      d("look-de-r", "E", "RE", [[66, 49], [67, 48], [68, 46]], "Strong end"),
      d("look-will", "W", "Will", [[36, 45], [35, 43], [34, 41]], "Will"),
      d("look-mike", "M", "Mike", [[50, 45], [50, 43], [49, 41]], "Mike"),
      d("look-sam", "S", "Sam", [[64, 45], [65, 43], [66, 41]], "Sam"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "52") {
    return [
      d("look-de-l", "E", "LE", [[30, 49], [29, 48], [28, 46]], "Wide end"),
      d("look-dt-l", "T", "DT", [[42, 49], [42, 47], [41, 45]], "Down tackle"),
      d("look-dt-r", "N", "Nose", [[50, 49], [50, 47], [50, 45]], "0-tech nose"),
      d("look-de-r", "T", "DT", [[58, 49], [58, 47], [59, 45]], "Down tackle"),
      d("look-edge-r", "E", "RE", [[70, 49], [71, 48], [72, 46]], "Wide end"),
      d("look-will", "W", "ILB", [[42, 44], [41, 42], [40, 40]], "ILB weak"),
      d("look-mike", "M", "ILB", [[58, 44], [59, 42], [60, 40]], "ILB strong"),
      d("look-sam", "S", "OLB", [[74, 46], [75, 44], [76, 42]], "Force OLB"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "34") {
    return [
      d("look-de-l", "E", "LE", [[38, 49], [37, 48], [36, 46]], "5-tech end"),
      d("look-dt-l", "N", "Nose", [[50, 49], [50, 47], [50, 45]], "0-tech nose"),
      d("look-de-r", "E", "RE", [[62, 49], [63, 48], [64, 46]], "5-tech end"),
      d("look-will", "W", "Will", [[34, 45], [33, 43], [32, 41]], "OLB weak"),
      d("look-mike", "M", "Mike", [[46, 44], [46, 42], [45, 40]], "ILB"),
      d("look-mike-r", "M", "Mo", [[54, 44], [54, 42], [55, 40]], "ILB"),
      d("look-sam", "S", "Sam", [[66, 45], [67, 43], [68, 41]], "OLB strong"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "bear") {
    return [
      d("look-de-l", "E", "LE", [[36, 49], [35, 48], [34, 47]], "Tight end"),
      d("look-dt-l", "T", "DT", [[44, 49], [44, 48], [43, 46]], "3-tech"),
      d("look-dt-r", "N", "Nose", [[50, 49], [50, 48], [50, 46]], "0-tech"),
      d("look-de-r", "T", "DT", [[56, 49], [56, 48], [57, 46]], "3-tech"),
      d("look-edge-r", "E", "RE", [[64, 49], [65, 48], [66, 47]], "Tight end"),
      d("look-will", "W", "LB", [[40, 44], [39, 43], [38, 41]], "LB"),
      d("look-mike", "M", "LB", [[50, 44], [50, 43], [50, 41]], "LB"),
      d("look-sam", "S", "LB", [[60, 44], [61, 43], [62, 41]], "LB"),
      fs,
      d("look-ss", "SS", "SS", [[60, 36], [61, 34], [62, 32]], "Alley"),
      cbL, cbR,
    ];
  }

  // 3-3 stack
  return [
    d("look-de-l", "E", "LE", [[36, 49], [35, 48], [34, 46]], "End"),
    d("look-dt-l", "N", "Nose", [[50, 49], [50, 47], [50, 45]], "Nose"),
    d("look-de-r", "E", "RE", [[64, 49], [65, 48], [66, 46]], "End"),
    d("look-will", "W", "Stack W", [[36, 44], [35, 42], [34, 40]], "Stacked"),
    d("look-mike", "M", "Stack M", [[50, 44], [50, 42], [50, 40]], "Stacked"),
    d("look-sam", "S", "Stack S", [[64, 44], [65, 42], [66, 40]], "Stacked"),
    d("look-ss", "SS", "Apex", [[70, 40], [71, 38], [72, 36]], "Apex / force"),
    fs, cbL, cbR,
    d("look-cb-slot", "N", "Slot", [[72, 48], [73, 46], [74, 44]], "Slot / edge"),
  ];
}

function cloneDefs(defs: LookDefender[]): LookDefender[] {
  return defs.map((x) => ({
    ...x,
    path: x.path.map((p) => [p[0], p[1]] as FieldPoint),
    engagedBy: [...x.engagedBy],
  }));
}

function setEng(
  defs: LookDefender[],
  id: string,
  engagedBy: string[],
  job: string,
  doubleTeam?: boolean,
) {
  const x = defs.find((d) => d.id === id);
  if (!x) return;
  x.engagedBy = engagedBy;
  x.job = job;
  if (doubleTeam !== undefined) x.doubleTeam = doubleTeam;
  else x.doubleTeam = engagedBy.length >= 2;
}

function dlIds(defs: LookDefender[]): string[] {
  return defs
    .filter((d) => {
      const t = d.tag.toUpperCase();
      return t === "E" || t === "T" || t === "N";
    })
    .sort((a, b) => a.path[0]![0] - b.path[0]![0])
    .map((d) => d.id);
}

function lbIds(defs: LookDefender[]): string[] {
  return defs
    .filter((d) => {
      const t = d.tag.toUpperCase();
      return t === "M" || t === "W" || t === "S";
    })
    .sort((a, b) => a.path[0]![0] - b.path[0]![0])
    .map((d) => d.id);
}

function nearestToX(defs: LookDefender[], ids: string[], x: number): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const id of ids) {
    const def = defs.find((d) => d.id === id);
    if (!def) continue;
    const dx = Math.abs(def.path[0]![0] - x);
    if (dx < bestD) {
      bestD = dx;
      best = id;
    }
  }
  return best;
}

/** OL slot x anchors (I-form center = 50) */
const OL_X: Record<string, number> = {
  lt: 38,
  lg: 44,
  c: 50,
  rg: 56,
  rt: 62,
  y: 68,
  te: 68,
  fb: 50,
  h: 46,
  rb: 50,
  x: 16,
  z: 84,
};

/**
 * GOD + scheme assignment detector.
 * Maps each defender to OL engagers based on front geometry + play scheme.
 */
export function assignBlocking(
  raw: LookDefender[],
  scheme: SchemeId,
): LookDefender[] {
  const defs = cloneDefs(raw);
  const ps = playsideOf(scheme);
  const dls = dlIds(defs);
  const lbs = lbIds(defs);

  // Map OL to nearest DL by gap (base GOD)
  const olSlots = ["lt", "lg", "c", "rg", "rt"] as const;
  const covered = new Map<string, string>(); // ol -> dl
  const dlCover = new Map<string, string[]>(); // dl -> ols

  for (const ol of olSlots) {
    const dl = nearestToX(defs, dls, OL_X[ol]!);
    if (!dl) continue;
    covered.set(ol, dl);
    const list = dlCover.get(dl) ?? [];
    list.push(ol);
    dlCover.set(dl, list);
  }

  // Clear and apply base 1-on-1 GOD
  for (const def of defs) {
    def.engagedBy = [];
    def.doubleTeam = false;
  }

  for (const [dl, ols] of dlCover) {
    if (ols.length === 1) {
      setEng(defs, dl, [ols[0]!], "GOD base — man in front.", false);
    } else if (ols.length >= 2) {
      // Uncovered rule / shared — double possible
      setEng(defs, dl, ols.slice(0, 2), "GOD shared surface — combo candidate.", true);
    }
  }

  // Edge DE vs RT/LT/Y
  const leftmost = dls[0];
  const rightmost = dls[dls.length - 1];
  if (leftmost && !dlCover.has(leftmost)) {
    setEng(defs, leftmost, ["lt"], "Edge — base / hinge / reach.", false);
  }
  if (rightmost && !dlCover.has(rightmost)) {
    setEng(defs, rightmost, ps === "R" ? ["rt", "y"] : ["rt"], "Edge EMOL.", false);
  }

  // Secondary defaults
  setEng(defs, "look-cb-l", ["x"], "Stalk / force.", false);
  setEng(defs, "look-cb-r", ["z"], "Stalk / force.", false);
  setEng(defs, "look-ss", ps === "R" ? ["y", "z"] : ["y"], "Alley / force.", false);
  setEng(defs, "look-fs", [], "Deep middle — late alley.", false);
  setEng(defs, "look-cb-slot", ["z", "y"], "Slot edge.", false);
  setEng(defs, "look-edge-r", ["rt", "y"], "Wide edge.", false);

  // Scheme overlays
  const playsideDl = ps === "R" ? rightmost : leftmost;
  const backsideDl = ps === "R" ? leftmost : rightmost;
  const playsideLb =
    nearestToX(defs, lbs, ps === "R" ? 62 : 38) ?? lbs[lbs.length - 1];
  const mike =
    nearestToX(defs, lbs, 50) ?? lbs[Math.floor(lbs.length / 2)];
  const backsideLb =
    nearestToX(defs, lbs, ps === "R" ? 38 : 62) ?? lbs[0];

  const nose =
    nearestToX(defs, dls, 50) ?? dls[Math.floor(dls.length / 2)];
  const threeTech =
    nearestToX(defs, dls, ps === "R" ? 56 : 44) ?? playsideDl;

  if (scheme === "dive") {
    // Fixed hole, base blocks, FB lead
    if (threeTech) setEng(defs, threeTech, ["rg"], "3-tech / down man — GOD base by RG.", false);
    if (nose && nose !== threeTech)
      setEng(defs, nose, ["lg", "c"], "Shade — C/LG gap+down.", false);
    if (mike) setEng(defs, mike, ["fb"], "Mike — FB lead / first color.", false);
    if (playsideLb && playsideLb !== mike)
      setEng(defs, playsideLb, ["rt", "y"], "Sam scrape — wall edge.", false);
  }

  if (scheme === "iso") {
    if (nose) setEng(defs, nose, ["lg", "c"], "Double post — LG/C combo. Climb on flow.", true);
    if (mike) setEng(defs, mike, ["fb"], "Iso target — FB alone.", true);
    if (threeTech) setEng(defs, threeTech, ["rg"], "Base/down — wall for iso crease.", false);
    if (playsideLb && playsideLb !== mike)
      setEng(defs, playsideLb, ["rt", "y"], "Sam scrape — edge of wall.", false);
  }

  if (scheme === "inside-zone") {
    if (nose) setEng(defs, nose, ["lg", "c"], "Zone combo — slide, drive, peel.", true);
    if (mike) setEng(defs, mike, ["lg", "c"], "Second-level peel — area, not jersey.", true);
    if (threeTech)
      setEng(defs, threeTech, ["rg", "rt"], "Playside zone combo.", true);
    if (playsideDl)
      setEng(defs, playsideDl, ["rt", "y"], "EMOL — zone reach / base.", false);
    if (backsideLb)
      setEng(defs, backsideLb, ["lt", "h"], "Backside flow — cutoff.", false);
  }

  if (scheme === "power") {
    if (threeTech)
      setEng(defs, threeTech, ["rg", "rt"], "Down wall — power crease.", true);
    if (playsideDl)
      setEng(defs, playsideDl, ["y", "rt"], "Edge of wall — down / hinge.", true);
    if (playsideLb)
      setEng(defs, playsideLb, ["lg", "fb"], "Kick/wrap — puller + FB.", true);
    if (mike && mike !== playsideLb)
      setEng(defs, mike, ["lg", "fb"], "Wrap / lead second level.", false);
    if (backsideDl) setEng(defs, backsideDl, ["lt"], "Hinge threat — free runner risk.", false);
    if (nose && nose !== threeTech)
      setEng(defs, nose, ["c"], "A-gap — center blocks back on pull.", false);
  }

  if (scheme === "reach") {
    if (playsideDl)
      setEng(defs, playsideDl, ["rt", "y"], "EMOL — THE reach/seal for toss.", true);
    if (playsideLb)
      setEng(defs, playsideLb, ["y", "h"], "Force/scrape — insert/crack.", false);
    if (threeTech) setEng(defs, threeTech, ["rg"], "Reach track — gain width.", false);
    setEng(defs, "look-cb-r", ["z"], "Perimeter stalk — toss finish.", false);
    setEng(defs, "look-ss", ["z", "y"], "Alley vs toss.", false);
  }

  if (scheme === "outside-zone") {
    if (playsideDl)
      setEng(defs, playsideDl, ["rt", "y"], "EMOL — full-line reach.", true);
    if (threeTech)
      setEng(defs, threeTech, ["rg", "rt"], "Zone combo — climb when reached.", true);
    if (playsideLb)
      setEng(defs, playsideLb, ["rg", "y"], "Flow LB — cutback key.", false);
    if (mike) setEng(defs, mike, ["c", "lg"], "Flow — second-level peel.", false);
    if (backsideLb)
      setEng(defs, backsideLb, ["lt", "lg"], "Backside chase — cutoff.", false);
  }

  if (scheme === "counter-simple") {
    // Counter left, G only pulls
    if (leftmost) setEng(defs, leftmost, ["lt", "x"], "Edge of counter wall.", false);
    const leftDl = dls[1] ?? nose;
    if (leftDl) setEng(defs, leftDl, ["lt", "lg"], "Down wall — counter side.", true);
    if (backsideLb)
      setEng(defs, backsideLb, ["rg", "fb"], "Kick/wrap — ONLY guard pulls.", true);
    if (mike) setEng(defs, mike, ["rg", "fb"], "Second level off single puller.", false);
    if (rightmost) setEng(defs, rightmost, ["rt"], "Hinge — RT stays home.", false);
    if (threeTech && threeTech !== leftDl)
      setEng(defs, threeTech, ["c"], "Vacated by pull — center covers.", false);
  }

  if (scheme === "counter") {
    if (leftmost) setEng(defs, leftmost, ["lt"], "Wall edge.", false);
    const leftDl = dls[1] ?? nose;
    if (leftDl) setEng(defs, leftDl, ["lt", "lg"], "Down wall — full counter.", true);
    if (backsideLb)
      setEng(defs, backsideLb, ["rg", "rt"], "Dual pull target — G lead, T trail.", true);
    if (mike)
      setEng(defs, mike, ["rt", "fb"], "Wrap / lead from second puller + FB.", true);
    if (rightmost) setEng(defs, rightmost, ["y"], "Backside cutoff — G+T left.", false);
    if (threeTech && threeTech !== leftDl)
      setEng(defs, threeTech, ["c"], "Vacated B — center covers.", false);
  }

  // Ensure every DL has someone if still empty
  for (const id of dls) {
    const def = defs.find((d) => d.id === id);
    if (def && def.engagedBy.length === 0) {
      let bestOl: (typeof olSlots)[number] = "c";
      let best = Infinity;
      for (const s of olSlots) {
        const dx = Math.abs(OL_X[s]! - def.path[0]![0]);
        if (dx < best) {
          best = dx;
          bestOl = s;
        }
      }
      setEng(defs, id, [bestOl], "GOD fill — nearest OL.", false);
    }
  }

  return defs;
}

function prog(
  defenders: LookDefender[],
  values: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const def of defenders) {
    out[def.id] = values[def.id] ?? 0;
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
  for (const def of defenders) {
    const boost = heavy.includes(def.id) ? 0.1 : 0;
    light[def.id] = 0.15 + boost;
    mid[def.id] = 0.55 + boost * 0.5;
    end[def.id] = 1;
  }
  return [prog(defenders, light), prog(defenders, mid), prog(defenders, end)];
}

function frontLabel(frontId: DefFrontId): string {
  return DEF_FRONTS.find((f) => f.id === frontId)?.label ?? frontId;
}

function schemeNote(scheme: SchemeId, frontId: DefFrontId): string {
  const f = frontLabel(frontId);
  const base: Record<SchemeId, string> = {
    dive: `GOD base vs ${f}. Each OL owns gap + down; FB leads first color.`,
    iso: `Combo + FB iso vs ${f}. Double the down man, climb on flow; FB isolates Mike.`,
    "inside-zone": `Zone doubles vs ${f}. Slide-then-drive area blocks; peel to LB on flow.`,
    power: `Gap/GOD vs ${f}. Down wall playside; puller + FB kick/wrap.`,
    reach: `Outside/toss reach vs ${f}. Seal EMOL inside — no cutback design.`,
    "outside-zone": `Full-line reach + cutback vs ${f}. Stretch then climb.`,
    "counter-simple": `Simplified counter vs ${f}. Guard-only pull; RT hinges.`,
    counter: `Full counter vs ${f}. Guard + tackle pull; dual kick/wrap.`,
  };
  return base[scheme];
}

/** Primary export: resolve look for a play against a chosen front. */
export function resolvePlayLook(
  playId: string,
  frontId: DefFrontId = "43-over",
): PlayLook | null {
  const scheme = schemeOf(playId);
  if (!scheme) return null;
  const raw = buildFrontAlignments(frontId);
  const defenders = assignBlocking(raw, scheme);
  const heavy = defenders
    .filter((d) => d.doubleTeam || d.engagedBy.length >= 2)
    .map((d) => d.id)
    .slice(0, 4);
  return {
    frontId,
    front: `${frontLabel(frontId)} · ${schemeLabel(scheme)}`,
    note: schemeNote(scheme, frontId),
    defenders,
    phaseProgress: standardPhases(defenders, heavy),
  };
}

function schemeLabel(scheme: SchemeId): string {
  const m: Record<SchemeId, string> = {
    dive: "GOD base",
    iso: "combo + iso",
    "inside-zone": "zone doubles",
    power: "gap / pull",
    reach: "outside / toss",
    "outside-zone": "OZ stretch",
    "counter-simple": "CTR-S (G)",
    counter: "CTR (G+T)",
  };
  return m[scheme];
}

/**
 * Build OL (and skill) assignment paths toward engaged defenders.
 * Used when "Blocking assignment" mode is on.
 */
export function buildAssignmentPaths(
  play: Play,
  defenders: LookDefender[],
): { paths: Record<string, FieldPoint[]>; jobs: Record<string, string> } {
  const paths: Record<string, FieldPoint[]> = {};
  const jobs: Record<string, string> = {};
  const byId = new Map(defenders.map((d) => [d.id, d]));

  // Reverse map: offense role -> list of defenders they engage
  const targets = new Map<string, LookDefender[]>();
  for (const def of defenders) {
    for (const oid of def.engagedBy) {
      const list = targets.get(oid) ?? [];
      list.push(def);
      targets.set(oid, list);
    }
  }

  const scheme = schemeOf(play.id);
  const ps = scheme ? playsideOf(scheme) : "R";

  for (const role of play.roles) {
    const start = role.path[0] ?? ([50, 52] as FieldPoint);
    const assigned = targets.get(role.id) ?? [];
    if (assigned.length === 0) {
      // Keep a subtle settle path — skill players without assignment
      if (["qb", "rb", "x", "z", "h"].includes(role.id)) {
        continue; // keep generic ball-carrier / route paths
      }
      paths[role.id] = [
        start,
        [start[0], start[1] - 2],
        [start[0], start[1] - 4],
      ];
      jobs[role.id] = "Uncovered — climb to first color / help.";
      continue;
    }

    // Sort assigned by depth (DL first, then LB)
    const sorted = [...assigned].sort(
      (a, b) => (a.path[0]?.[1] ?? 50) - (b.path[0]?.[1] ?? 50),
    );
    const primary = sorted[0]!;
    const secondary = sorted[1];
    const pAlign = primary.path[0]!;
    const isPull =
      /pull/i.test(role.job) ||
      /pull/i.test(role.label) ||
      (scheme === "power" && role.id === "lg") ||
      (scheme === "counter-simple" && role.id === "rg") ||
      (scheme === "counter" && (role.id === "rg" || role.id === "rt"));

    if (isPull) {
      // Keep lateral pull shape but finish at assignment
      const pullY = start[1];
      const midX = (start[0] + pAlign[0]) / 2;
      paths[role.id] = [
        start,
        [start[0] + (ps === "R" ? -4 : 4), pullY],
        [midX, pullY - 0.5],
        [pAlign[0], pAlign[1] + 1],
        [pAlign[0], pAlign[1] - 2],
      ];
      jobs[role.id] = primary.job;
      continue;
    }

    const isReach =
      scheme === "reach" ||
      scheme === "outside-zone" ||
      /reach/i.test(role.job);

    if (isReach && ["lt", "lg", "c", "rg", "rt", "y"].includes(role.id)) {
      const dir = ps === "R" ? 1 : -1;
      paths[role.id] = [
        start,
        [start[0] + dir * 3, start[1] - 0.5],
        [pAlign[0] - dir * 0.5, pAlign[1] + 0.8],
        [pAlign[0] + dir * 1.5, pAlign[1] - 1.5],
        secondary
          ? [secondary.path[0]![0], secondary.path[0]![1] - 1]
          : [pAlign[0] + dir * 2, pAlign[1] - 4],
      ];
      jobs[role.id] = secondary
        ? `${primary.job} → climb ${secondary.tag}`
        : primary.job;
      continue;
    }

    // Base / down / combo
    if (secondary && primary.doubleTeam) {
      // Combo: post on primary, climb secondary
      paths[role.id] = [
        start,
        [(start[0] + pAlign[0]) / 2, (start[1] + pAlign[1]) / 2 + 0.5],
        [pAlign[0], pAlign[1] + 0.6],
        [
          (pAlign[0] + secondary.path[0]![0]) / 2,
          (pAlign[1] + secondary.path[0]![1]) / 2,
        ],
        [secondary.path[0]![0], secondary.path[0]![1] - 1.5],
      ];
      jobs[role.id] = `Combo ${primary.tag} → climb ${secondary.tag}`;
    } else {
      const downDir =
        pAlign[0] < start[0] - 1 ? -1 : pAlign[0] > start[0] + 1 ? 1 : 0;
      paths[role.id] = [
        start,
        [start[0] + downDir * 1.2, start[1] - 1],
        [pAlign[0], pAlign[1] + 0.8],
        [pAlign[0] + downDir * 0.8, pAlign[1] - 2.5],
        [pAlign[0] + downDir * 1.2, pAlign[1] - 5],
      ];
      jobs[role.id] = primary.job;
    }
  }

  // QB / RB keep generic play paths for ball path clarity
  for (const role of play.roles) {
    if (role.id === "qb" || role.id === "rb") {
      delete paths[role.id];
      delete jobs[role.id];
    }
  }

  return { paths, jobs };
}

/** Apply default 4-3 Over looks onto offensive plays (mutates in place). */
export function applyPlayLooks(plays: Play[]): void {
  for (const play of plays) {
    if (play.side !== "offense") continue;
    const look = resolvePlayLook(play.id, "43-over");
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

/** Build a play snapshot for the simulator with front + OL path mode. */
export function buildSimPlay(
  play: Play,
  frontId: DefFrontId,
  olMode: "generic" | "assignment",
): Play {
  const look = resolvePlayLook(play.id, frontId);
  if (!look) {
    return play;
  }

  let roles: PlayRole[] = play.roles;
  if (olMode === "assignment") {
    const { paths, jobs } = buildAssignmentPaths(play, look.defenders);
    roles = play.roles.map((r) => {
      const path = paths[r.id];
      if (!path) return r;
      return {
        ...r,
        path,
        job: jobs[r.id] ?? r.job,
      };
    });
  }

  return {
    ...play,
    look: look.defenders,
    lookFront: look.front,
    lookNote: look.note,
    roles,
    phases: play.phases.map((ph, i) => ({
      ...ph,
      lookProgress: look.phaseProgress[i] ?? look.phaseProgress.at(-1),
    })),
  };
}
