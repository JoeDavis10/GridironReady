import type { FieldPoint, Play, PlayPhase, PlayRole } from "./plays";

/**
 * Defensive looks + Gap-On-Down (GOD) assignment detector.
 *
 * Field: LOS at y=50. Offense y>50, defense y<50. ~1 unit ≈ 1 yard near LOS.
 * LBs default 4 yards off the ball (y = 46).
 */

export interface LookDefender {
  id: string;
  tag: string;
  label: string;
  path: FieldPoint[];
  engagedBy: string[];
  doubleTeam?: boolean;
  job: string;
  /**
   * Desired drive line once engaged — blocker aims to displace the defender
   * along this path (angle of drive). Used by block physics + diagram overlay.
   */
  drivePath?: FieldPoint[];
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
  | "33-stack"
  | "custom";

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
    blurb: "Even front, shade strong — base GOD install.",
  },
  {
    id: "43-under",
    label: "4-3 Under",
    short: "4-3 U",
    blurb: "Even front, shade weak — 3-tech flips.",
  },
  {
    id: "52",
    label: "5-2 Eagle",
    short: "5-2",
    blurb: "Five down, two ILBs — crowded GOD surface.",
  },
  {
    id: "34",
    label: "3-4 Odd",
    short: "3-4",
    blurb: "Odd nose + four LBs — more uncovered doubles.",
  },
  {
    id: "bear",
    label: "Bear / Goal",
    short: "Bear",
    blurb: "Tight six-man surface — short yardage GOD.",
  },
  {
    id: "33-stack",
    label: "3-3 Stack",
    short: "3-3",
    blurb: "Light box, stacked LBs — wide gaps.",
  },
  {
    id: "custom",
    label: "Custom",
    short: "Custom",
    blurb: "Drag defenders — assignments recompute live (GOD + scheme).",
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

/** Per-OL (and skill) assignment for teaching */
export interface RoleAssignment {
  roleId: string;
  rule: "god-base" | "god-down" | "god-combo" | "zone" | "pull" | "hinge" | "reach" | "lead" | "stalk" | "cutoff" | "none";
  usesGod: boolean;
  why: string;
  whyNotGod?: string;
  targetIds: string[];
  targetTags: string[];
  gap?: string;
  path: FieldPoint[];
  job: string;
}

export interface AssignmentReport {
  scheme: SchemeId;
  schemeUsesGod: boolean;
  schemeNote: string;
  frontLabel: string;
  defenders: LookDefender[];
  roles: RoleAssignment[];
  gaps: { id: string; label: string; x: number; covered: boolean }[];
}

export const LOS_Y = 50;
export const LB_DEPTH = 4; // yards off LOS
export const DL_Y = 49;
export const LB_Y = LOS_Y - LB_DEPTH; // 46

export type SchemeIdOrNull = SchemeId | null;

export function schemeOf(playId: string): SchemeId | null {
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

export function playsideOf(scheme: SchemeId): "L" | "R" {
  if (scheme === "counter" || scheme === "counter-simple") return "L";
  return "R";
}

/** Schemes that are primarily GOD / gap-on-down for the OL */
export function schemeUsesGod(scheme: SchemeId): boolean {
  return (
    scheme === "dive" ||
    scheme === "iso" ||
    scheme === "power" ||
    scheme === "counter-simple" ||
    scheme === "counter"
  );
}

export function schemeGodExplanation(scheme: SchemeId): string {
  switch (scheme) {
    case "dive":
      return "GOD applies fully. Gap = your playside gap, On = man in that gap, Down = next down defender. Base the man in front — no freelancing.";
    case "iso":
      return "GOD for the base wall + uncovered combo rules. Covered OL bases On; uncovered doubles the down man and climbs. FB is NOT GOD — pure iso lead on the LB.";
    case "inside-zone":
      return "GOD does NOT fully apply. This is zone: block the area (slide to gap, drive as one, peel on flow). Same landmarks, different rule set — area not jersey.";
    case "power":
      return "GOD on the down wall (playside bases/downs). Puller is the exception — he leaves his gap to kick/wrap. Backside hinge is gap responsibility, not a classic base.";
    case "reach":
      return "GOD does NOT apply the same way. Outside/toss is reach/seal the EMOL — gain width, keep him inside. Not gap-on-down base rules.";
    case "outside-zone":
      return "GOD does NOT apply. Full-line zone stretch: everyone reaches playside; climb/cutback is flow-based, not man-on GOD.";
    case "counter-simple":
      return "GOD on the down wall (counter side). Guard pull is the exception to GOD (leaves gap). RT hinges — stays home. Same as power, one puller only.";
    case "counter":
      return "GOD on the down wall. Guard AND tackle pull — both leave GOD base. Backside TE/cutoff replaces hinge. Down blocks still pure GOD.";
  }
}

function d(
  id: string,
  tag: string,
  label: string,
  align: FieldPoint,
  job = "Alignment",
): LookDefender {
  // Short reactive path from alignment
  const [x, y] = align;
  return {
    id,
    tag,
    label,
    path: [
      [x, y],
      [x, y - 1.5],
      [x, y - 3],
    ],
    engagedBy: [],
    job,
  };
}

function movePath(def: LookDefender, x: number, y: number): LookDefender {
  return {
    ...def,
    path: [
      [x, y],
      [x + (def.path[1]?.[0] ?? x) - (def.path[0]?.[0] ?? x), y - 1.5],
      [x, y - 3],
    ],
  };
}

/** Build raw front alignments (LBs at 4 yards). */
export function buildFrontAlignments(frontId: DefFrontId): LookDefender[] {
  const fs = d("look-fs", "FS", "Free safety", [50, 34], "Deep middle");
  const ss = d("look-ss", "SS", "Strong safety", [64, 38], "Box / alley");
  const cbL = d("look-cb-l", "CB", "LCB", [16, 48], "Boundary corner");
  const cbR = d("look-cb-r", "CB", "RCB", [84, 48], "Field corner");
  const lb = LB_Y;

  if (frontId === "custom" || frontId === "43-over") {
    return [
      d("look-de-l", "E", "LE", [34, DL_Y], "Weak end"),
      d("look-dt-l", "N", "1-tech / shade", [46, DL_Y], "A-gap shade"),
      d("look-dt-r", "T", "3-tech", [56, DL_Y], "Strong 3-tech"),
      d("look-de-r", "E", "RE", [66, DL_Y], "Strong end"),
      d("look-will", "W", "Will", [38, lb], "Weak LB · 4 yd"),
      d("look-mike", "M", "Mike", [50, lb], "Mike · 4 yd"),
      d("look-sam", "S", "Sam", [62, lb], "Sam · 4 yd"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "43-under") {
    return [
      d("look-de-l", "E", "LE", [34, DL_Y], "Weak end"),
      d("look-dt-l", "T", "3-tech (weak)", [42, DL_Y], "Weak 3-tech"),
      d("look-dt-r", "N", "1-tech / shade", [54, DL_Y], "Strong shade"),
      d("look-de-r", "E", "RE", [66, DL_Y], "Strong end"),
      d("look-will", "W", "Will", [36, lb], "Will · 4 yd"),
      d("look-mike", "M", "Mike", [50, lb], "Mike · 4 yd"),
      d("look-sam", "S", "Sam", [64, lb], "Sam · 4 yd"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "52") {
    return [
      d("look-de-l", "E", "LE", [30, DL_Y], "Wide end"),
      d("look-dt-l", "T", "DT", [42, DL_Y], "Down tackle"),
      d("look-dt-r", "N", "Nose", [50, DL_Y], "0-tech nose"),
      d("look-de-r", "T", "DT", [58, DL_Y], "Down tackle"),
      d("look-edge-r", "E", "RE", [70, DL_Y], "Wide end"),
      d("look-will", "W", "ILB", [42, lb], "ILB weak · 4 yd"),
      d("look-mike", "M", "ILB", [58, lb], "ILB strong · 4 yd"),
      d("look-sam", "S", "OLB", [74, lb], "Force OLB · 4 yd"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "34") {
    return [
      d("look-de-l", "E", "LE", [38, DL_Y], "5-tech end"),
      d("look-dt-l", "N", "Nose", [50, DL_Y], "0-tech nose"),
      d("look-de-r", "E", "RE", [62, DL_Y], "5-tech end"),
      d("look-will", "W", "Will", [34, lb], "OLB weak · 4 yd"),
      d("look-mike", "M", "Mike", [46, lb], "ILB · 4 yd"),
      d("look-mike-r", "M", "Mo", [54, lb], "ILB · 4 yd"),
      d("look-sam", "S", "Sam", [66, lb], "OLB strong · 4 yd"),
      fs, ss, cbL, cbR,
    ];
  }

  if (frontId === "bear") {
    return [
      d("look-de-l", "E", "LE", [36, DL_Y], "Tight end"),
      d("look-dt-l", "T", "DT", [44, DL_Y], "3-tech"),
      d("look-dt-r", "N", "Nose", [50, DL_Y], "0-tech"),
      d("look-de-r", "T", "DT", [56, DL_Y], "3-tech"),
      d("look-edge-r", "E", "RE", [64, DL_Y], "Tight end"),
      d("look-will", "W", "LB", [40, lb], "LB · 4 yd"),
      d("look-mike", "M", "LB", [50, lb], "LB · 4 yd"),
      d("look-sam", "S", "LB", [60, lb], "LB · 4 yd"),
      fs,
      d("look-ss", "SS", "SS", [60, 36], "Alley"),
      cbL, cbR,
    ];
  }

  // 3-3 stack — stack LBs still ~4 yd off
  return [
    d("look-de-l", "E", "LE", [36, DL_Y], "End"),
    d("look-dt-l", "N", "Nose", [50, DL_Y], "Nose"),
    d("look-de-r", "E", "RE", [64, DL_Y], "End"),
    d("look-will", "W", "Stack W", [36, lb], "Stacked · 4 yd"),
    d("look-mike", "M", "Stack M", [50, lb], "Stacked · 4 yd"),
    d("look-sam", "S", "Stack S", [64, lb], "Stacked · 4 yd"),
    d("look-ss", "SS", "Apex", [70, 40], "Apex / force"),
    fs, cbL, cbR,
    d("look-nick-r", "NB", "Nickel", [72, 48], "Slot nickel — not DL"),
  ];
}

/** Apply custom x,y overrides (from drag) onto a base alignment. */
export function applyPositionOverrides(
  defs: LookDefender[],
  overrides: Record<string, FieldPoint>,
): LookDefender[] {
  return defs.map((def) => {
    const o = overrides[def.id];
    if (!o) return { ...def, path: def.path.map((p) => [p[0], p[1]] as FieldPoint) };
    return movePath(def, o[0], o[1]);
  });
}

export const OL_X: Record<string, number> = {
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
  qb: 50,
  x: 16,
  z: 84,
};

const OL_ORDER = ["lt", "lg", "c", "rg", "rt"] as const;
const GAP_NAMES = ["D", "C", "B", "A", "A", "B", "C", "D"] as const;
// Gaps between: outside LT, LT-LG, LG-C, C-RG, RG-RT, outside RT — use A/B/C for interior

function cloneDefs(defs: LookDefender[]): LookDefender[] {
  return defs.map((x) => ({
    ...x,
    path: x.path.map((p) => [p[0], p[1]] as FieldPoint),
    engagedBy: [...x.engagedBy],
    drivePath: x.drivePath?.map((p) => [p[0], p[1]] as FieldPoint),
  }));
}

/** Defensive levels for GOD — secondary/nickel must NEVER count as On for OL. */
export type DefLevel = "dl" | "lb" | "db";

/**
 * Classify by id + depth first, tags only as last resort.
 * Critical: tag "N" alone is ambiguous (Nose vs Nickel) — depth/id decides.
 */
export function classifyDefender(def: LookDefender): DefLevel {
  const id = def.id.toLowerCase();
  const tag = def.tag.toUpperCase();
  const depth = LOS_Y - alignY(def); // yards off LOS

  // Explicit id roles
  if (
    id.includes("nick") ||
    id.includes("slot") ||
    id.includes("cb") ||
    id.includes("fs") ||
    id.includes("ss") ||
    id.includes("safety")
  ) {
    return "db";
  }
  if (
    id.includes("will") ||
    id.includes("mike") ||
    id.includes("sam") ||
    id.includes("-lb") ||
    id.endsWith("lb") ||
    id.includes("ilb") ||
    id.includes("olb")
  ) {
    return "lb";
  }
  if (
    id.includes("de-") ||
    id.includes("dt-") ||
    id.includes("edge") ||
    id.includes("nose") ||
    id.includes("look-de") ||
    id.includes("look-dt")
  ) {
    return "dl";
  }

  // Tag-based (safe tags)
  if (tag === "CB" || tag === "FS" || tag === "SS" || tag === "NB" || tag === "$" || tag === "NIC") {
    return "db";
  }
  if (tag === "M" || tag === "W" || tag === "S" || tag === "LB" || tag === "ILB" || tag === "OLB") {
    return "lb";
  }
  if (tag === "E" || tag === "T" || tag === "NT" || tag === "DT" || tag === "DE") {
    return "dl";
  }

  // Ambiguous "N": Nose if on LOS, Nickel/DB if off ball / wide
  if (tag === "N") {
    if (depth <= 2.2 && Math.abs(alignX(def) - 50) < 18) return "dl";
    return "db";
  }

  // Geometry fallback for custom drag
  if (depth <= 2.2) return "dl";
  if (depth <= 6.5) return "lb";
  return "db";
}

function isDl(def: LookDefender): boolean {
  return classifyDefender(def) === "dl";
}
function isLb(def: LookDefender): boolean {
  return classifyDefender(def) === "lb";
}
function isDb(def: LookDefender): boolean {
  return classifyDefender(def) === "db";
}

function alignX(def: LookDefender): number {
  return def.path[0]?.[0] ?? 50;
}
function alignY(def: LookDefender): number {
  return def.path[0]?.[1] ?? 48;
}

function dist2d(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

/** OL landmark y (helmet line) */
const OL_Y = 52;


function gapLabelForOl(ol: string, playside: "L" | "R"): string {
  // Playside gap name for teaching
  const mapR: Record<string, string> = {
    lt: "C (backside)",
    lg: "B (backside)",
    c: "A",
    rg: "B (playside)",
    rt: "C (playside)",
  };
  const mapL: Record<string, string> = {
    rt: "C (backside)",
    rg: "B (backside)",
    c: "A",
    lg: "B (playside)",
    lt: "C (playside)",
  };
  return (playside === "R" ? mapR : mapL)[ol] ?? "gap";
}

/**
 * Core geometric GOD detector + scheme overlay.
 * Works on ANY defender positions (presets or custom drag).
 */
export function evaluateAssignments(
  raw: LookDefender[],
  scheme: SchemeId,
): AssignmentReport {
  const defs = cloneDefs(raw);
  const ps = playsideOf(scheme);
  const godScheme = schemeUsesGod(scheme);

  // ONLY true down linemen count for GOD On. LBs / nickel / CBs never.
  const dls = defs
    .filter((d) => isDl(d))
    .sort((a, b) => alignX(a) - alignX(b));
  const lbs = defs
    .filter((d) => isLb(d))
    .sort((a, b) => alignX(a) - alignX(b));
  const dbs = defs.filter((d) => isDb(d));

  // Clear engagements
  for (const def of defs) {
    def.engagedBy = [];
    def.doubleTeam = false;
    def.job = `${def.label} · ${classifyDefender(def).toUpperCase()}`;
  }

  /**
   * GOD distance model
   * - On: nearest DL by 2D distance to OL landmark, exclusive claim first (closest pairs),
   *       then residual OL may share a DL if still within COVER (combo surface).
   * - Gap: playside gap name from OL slot + call side.
   * - Down: when uncovered, nearest DL by distance that sits toward the ball / call
   *       (not a wide secondary player — DL list only).
   */
  const COVER_THRESH = 6.0; // yards — head-up / shade On window
  const olToDl = new Map<string, LookDefender | null>();
  const dlToOl = new Map<string, string[]>();

  // Pair distances OL↔DL
  type Pair = { ol: string; dl: LookDefender; dist: number };
  const pairs: Pair[] = [];
  for (const ol of OL_ORDER) {
    const ox = OL_X[ol]!;
    for (const dl of dls) {
      pairs.push({
        ol,
        dl,
        dist: dist2d(ox, OL_Y, alignX(dl), alignY(dl)),
      });
    }
  }
  pairs.sort((a, b) => a.dist - b.dist);

  // Pass 1: exclusive On — each OL and each DL claimed at most once if within COVER
  const olClaimed = new Set<string>();
  const dlClaimed = new Set<string>();
  for (const p of pairs) {
    if (p.dist > COVER_THRESH) break;
    if (olClaimed.has(p.ol) || dlClaimed.has(p.dl.id)) continue;
    olClaimed.add(p.ol);
    dlClaimed.add(p.dl.id);
    olToDl.set(p.ol, p.dl);
    dlToOl.set(p.dl.id, [p.ol]);
  }

  // Pass 2: residual OL within COVER of a claimed DL → shared surface (combo candidate)
  for (const ol of OL_ORDER) {
    if (olToDl.has(ol)) continue;
    const ox = OL_X[ol]!;
    let best: LookDefender | null = null;
    let bestD = Infinity;
    for (const dl of dls) {
      const dist = dist2d(ox, OL_Y, alignX(dl), alignY(dl));
      if (dist < bestD) {
        bestD = dist;
        best = dl;
      }
    }
    if (best && bestD <= COVER_THRESH) {
      olToDl.set(ol, best);
      const list = dlToOl.get(best.id) ?? [];
      if (!list.includes(ol)) list.push(ol);
      dlToOl.set(best.id, list);
    } else {
      olToDl.set(ol, null); // uncovered
    }
  }

  // Build gap landmarks between DL only (true front)
  const gaps: AssignmentReport["gaps"] = [];
  // Named gaps relative to OL landmarks
  const gapAnchors: { label: string; x: number }[] = [
    { label: "D weak", x: 32 },
    { label: "C weak", x: 41 },
    { label: "B weak", x: 47 },
    { label: "A weak", x: 50 },
    { label: "A strong", x: 50 },
    { label: "B strong", x: 53 },
    { label: "C strong", x: 59 },
    { label: "D strong", x: 68 },
  ];
  for (let i = 0; i < dls.length - 1; i++) {
    const a = dls[i]!;
    const b = dls[i + 1]!;
    const mid = (alignX(a) + alignX(b)) / 2;
    const width = alignX(b) - alignX(a);
    const nearestAnchor =
      gapAnchors.slice().sort((g1, g2) => Math.abs(g1.x - mid) - Math.abs(g2.x - mid))[0]!;
    gaps.push({
      id: `gap-${a.id}-${b.id}`,
      label: `${nearestAnchor.label} ${width.toFixed(1)}yd (${a.tag}-${b.tag})`,
      x: mid,
      covered: width < 5.5,
    });
  }
  // Outside edges
  if (dls.length) {
    gaps.unshift({
      id: `gap-out-l-${dls[0]!.id}`,
      label: `EMOL weak outside ${dls[0]!.tag}`,
      x: alignX(dls[0]!) - 4,
      covered: false,
    });
    gaps.push({
      id: `gap-out-r-${dls[dls.length - 1]!.id}`,
      label: `EMOL strong outside ${dls[dls.length - 1]!.tag}`,
      x: alignX(dls[dls.length - 1]!) + 4,
      covered: false,
    });
  }

  const roleMap = new Map<string, RoleAssignment>();
  const ensureRole = (roleId: string): RoleAssignment => {
    let r = roleMap.get(roleId);
    if (!r) {
      r = {
        roleId,
        rule: "none",
        usesGod: false,
        why: "",
        targetIds: [],
        targetTags: [],
        path: [],
        job: "",
      };
      roleMap.set(roleId, r);
    }
    return r;
  };

  const setDefEng = (
    def: LookDefender,
    ols: string[],
    job: string,
    double: boolean,
  ) => {
    def.engagedBy = ols;
    def.job = job;
    def.doubleTeam = double;
  };

  // --- Base GOD assignment for man/gap schemes ---
  const assignGodBase = () => {
    for (const ol of OL_ORDER) {
      const dl = olToDl.get(ol) ?? null;
      const ra = ensureRole(ol);
      const gap = gapLabelForOl(ol, ps);
      ra.gap = gap;
      const ox = OL_X[ol]!;

      if (dl) {
        const others = dlToOl.get(dl.id) ?? [ol];
        const onDist = dist2d(ox, OL_Y, alignX(dl), alignY(dl));
        if (others.length === 1) {
          setDefEng(
            dl,
            [ol],
            `GOD On: ${ol.toUpperCase()} bases ${dl.tag} (${onDist.toFixed(1)} yd). Gap ${gap}.`,
            false,
          );
          ra.rule = "god-base";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `COVERED by distance. On = ${dl.tag} at ${onDist.toFixed(1)} yd (only DL in your On window). Gap ${gap}. Base him — do not freestyle to nickel/DB.`;
          ra.job = `Base ${dl.tag} · On ${onDist.toFixed(1)}yd · gap ${gap}`;
          ra.path = pathBase([ox, OL_Y], [alignX(dl), alignY(dl)]);
        } else {
          // Shared — combo in finalize
          ra.rule = "god-combo";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `Shared On surface: ${others.map((x) => x.toUpperCase()).join("+")} all nearest to ${dl.tag} (${onDist.toFixed(1)} yd). GOD combo/post rules.`;
          ra.job = `Combo ${dl.tag}`;
        }
      } else {
        const down = findDownDefender(ol, dls, ps);
        ra.rule = "god-down";
        ra.usesGod = true;
        if (down) {
          const dd = dist2d(ox, OL_Y, alignX(down), alignY(down));
          ra.targetIds = [down.id];
          ra.targetTags = [down.tag];
          ra.why = `UNCOVERED (no DL within ${COVER_THRESH} yd On window). Down by distance = ${down.tag} at ${dd.toFixed(1)} yd — double him, climb LB on flow. Nickel/DB are not Down.`;
          ra.job = `Down ${down.tag} ${dd.toFixed(1)}yd → climb`;
          ra.path = pathCombo(
            [ox, OL_Y],
            [alignX(down), alignY(down)],
            nearestLb(lbs, ox),
          );
          const list = [...down.engagedBy];
          if (!list.includes(ol)) list.push(ol);
          setDefEng(
            down,
            list,
            `GOD Down: ${list.map((x) => x.toUpperCase()).join("+")} on ${down.tag} (${dd.toFixed(1)} yd).`,
            list.length >= 2,
          );
        } else {
          ra.why =
            "Uncovered and no DL on the field — climb first LB color in your gap (no first-level On).";
          ra.job = "Climb first color";
          ra.path = pathClimb([ox, OL_Y], nearestLb(lbs, ox));
        }
      }
    }

    // Combo finalize for multi-OL On
    for (const dl of dls) {
      const ols = dlToOl.get(dl.id) ?? [];
      if (ols.length >= 2) {
        setDefEng(
          dl,
          ols.slice(0, 2),
          `GOD combo: ${ols
            .slice(0, 2)
            .map((x) => x.toUpperCase())
            .join("+")} on ${dl.tag} (shared On by distance).`,
          true,
        );
        for (const ol of ols) {
          const ra = ensureRole(ol);
          const partner = ols.find((x) => x !== ol);
          const onDist = dist2d(OL_X[ol]!, OL_Y, alignX(dl), alignY(dl));
          ra.rule = "god-combo";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `Combo On ${dl.tag} (${onDist.toFixed(1)} yd) with ${partner?.toUpperCase() ?? "partner"}. Drive as one; one climbs LB on flow.`;
          ra.job = `Combo ${dl.tag} w/ ${partner?.toUpperCase() ?? "?"}`;
          ra.path = pathCombo(
            [OL_X[ol]!, OL_Y],
            [alignX(dl), alignY(dl)],
            nearestLb(lbs, OL_X[ol]!),
          );
        }
      } else if (ols.length === 1 && dl.engagedBy.length === 0) {
        // Ensure engagement applied
        setDefEng(
          dl,
          ols,
          `GOD On: ${ols[0]!.toUpperCase()} bases ${dl.tag}.`,
          false,
        );
      }
    }

    // Unclaimed DL: only true EMOL (outermost) → nearest end OL by distance, never force RT to nickel
    for (const dl of dls) {
      if (dl.engagedBy.length > 0) continue;
      // Only outermost DLs get edge claim
      const isLeftEdge = dls[0]?.id === dl.id;
      const isRightEdge = dls[dls.length - 1]?.id === dl.id;
      if (!isLeftEdge && !isRightEdge) {
        // Interior unclaimed — nearest OL by distance as secondary On
        let bestOl: (typeof OL_ORDER)[number] = "c";
        let bestD = Infinity;
        for (const ol of OL_ORDER) {
          const dist = dist2d(OL_X[ol]!, OL_Y, alignX(dl), alignY(dl));
          if (dist < bestD) {
            bestD = dist;
            bestOl = ol;
          }
        }
        setDefEng(
          dl,
          [bestOl],
          `GOD residual On by distance: ${bestOl.toUpperCase()} → ${dl.tag} (${bestD.toFixed(1)} yd).`,
          false,
        );
        const ra = ensureRole(bestOl);
        if (!ra.targetIds.includes(dl.id)) {
          ra.targetIds.push(dl.id);
          ra.targetTags.push(dl.tag);
        }
        continue;
      }
      const edgeOl = isLeftEdge ? "lt" : "rt";
      const dist = dist2d(OL_X[edgeOl]!, OL_Y, alignX(dl), alignY(dl));
      // Cap: if EMOL is absurdly wide (>14 yd), leave unassigned to OL (force/SS problem, not RT base)
      if (dist > 14) {
        dl.job = `${dl.tag} too wide for OL On (${dist.toFixed(1)} yd) — force/perimeter, not GOD base.`;
        continue;
      }
      setDefEng(
        dl,
        [edgeOl],
        `GOD EMOL On by distance: ${edgeOl.toUpperCase()} → ${dl.tag} (${dist.toFixed(1)} yd).`,
        false,
      );
      const ra = ensureRole(edgeOl);
      if (!ra.targetIds.includes(dl.id)) {
        ra.targetIds = [dl.id];
        ra.targetTags = [dl.tag];
      }
      if (ra.rule === "none" || (ra.rule === "god-base" && ra.targetIds[0] === dl.id)) {
        ra.rule = "god-base";
        ra.usesGod = true;
        ra.why = `EMOL by distance: ${dl.tag} is outermost DL at ${dist.toFixed(1)} yd. Your On. (Secondary/nickel ignored.)`;
        ra.job = `EMOL ${dl.tag} ${dist.toFixed(1)}yd`;
        ra.path = pathBase([OL_X[edgeOl]!, OL_Y], [alignX(dl), alignY(dl)]);
      }
    }

    // Mark DBs so they never show OL engagement from residual
    for (const db of dbs) {
      if (db.engagedBy.some((id) => OL_ORDER.includes(id as (typeof OL_ORDER)[number]))) {
        // Strip accidental OL engagement on DBs
        db.engagedBy = db.engagedBy.filter(
          (id) => !OL_ORDER.includes(id as (typeof OL_ORDER)[number]),
        );
        db.doubleTeam = false;
      }
      if (db.engagedBy.length === 0) {
        db.job = `${db.label} · DB — not a GOD On for OL`;
      }
    }
  };

  // Helper paths
  function pathBase(from: FieldPoint, to: FieldPoint): FieldPoint[] {
    return [
      from,
      [from[0] + (to[0] - from[0]) * 0.35, from[1] - 1],
      [to[0], to[1] + 0.8],
      [to[0], to[1] - 2.5],
      [to[0], to[1] - 5],
    ];
  }
  function pathCombo(from: FieldPoint, post: FieldPoint, lb: FieldPoint | null): FieldPoint[] {
    const climb = lb ?? [post[0], post[1] - 6];
    return [
      from,
      [(from[0] + post[0]) / 2, (from[1] + post[1]) / 2 + 0.4],
      [post[0], post[1] + 0.5],
      [(post[0] + climb[0]) / 2, (post[1] + climb[1]) / 2],
      [climb[0], climb[1] - 1],
    ];
  }
  function pathClimb(from: FieldPoint, lb: FieldPoint | null): FieldPoint[] {
    const t = lb ?? [from[0], 42];
    return [from, [from[0], from[1] - 2], [t[0], t[1] + 1], [t[0], t[1] - 1]];
  }
  function pathPull(from: FieldPoint, target: FieldPoint, psDir: "L" | "R"): FieldPoint[] {
    const lat = psDir === "R" ? -1 : 1; // pull toward playside from backside
    // Actually pull from backside toward playside
    const toward = target[0] > from[0] ? 1 : -1;
    return [
      from,
      [from[0] + toward * 2, from[1]],
      [(from[0] + target[0]) / 2, from[1] - 0.3],
      [target[0], target[1] + 1],
      [target[0], target[1] - 2],
    ];
  }
  function pathReach(from: FieldPoint, to: FieldPoint, dir: number): FieldPoint[] {
    return [
      from,
      [from[0] + dir * 3, from[1] - 0.4],
      [to[0] - dir * 0.5, to[1] + 0.6],
      [to[0] + dir * 1.5, to[1] - 1.5],
      [to[0] + dir * 2.5, to[1] - 4],
    ];
  }
  function pathHinge(from: FieldPoint, de: FieldPoint): FieldPoint[] {
    return [
      from,
      [from[0], from[1] - 0.5],
      [de[0] + (from[0] < de[0] ? -1 : 1), de[1] + 0.5],
      [from[0], from[1] - 1],
    ];
  }

  function findDownDefender(
    ol: string,
    dlList: LookDefender[],
    side: "L" | "R",
  ): LookDefender | null {
    const ox = OL_X[ol]!;
    // Down = nearest first-level DL by 2D distance, with a small bias toward the ball
    // and a tiny bias toward playside. Never returns DB/LB.
    let best: LookDefender | null = null;
    let bestScore = Infinity;
    for (const dl of dlList) {
      const x = alignX(dl);
      const y = alignY(dl);
      const dist = dist2d(ox, OL_Y, x, y);
      const towardBall = Math.abs(x - 50) <= Math.abs(ox - 50) + 0.5 ? 0 : 1.25;
      const playsideBias =
        side === "R"
          ? x >= ox - 1
            ? 0
            : 0.75
          : x <= ox + 1
            ? 0
            : 0.75;
      const score = dist + towardBall + playsideBias;
      if (score < bestScore) {
        bestScore = score;
        best = dl;
      }
    }
    return best;
  }

  function nearestLb(lbList: LookDefender[], x: number): FieldPoint | null {
    if (!lbList.length) return null;
    let best = lbList[0]!;
    let bestD = Infinity;
    for (const lb of lbList) {
      const dx = Math.abs(alignX(lb) - x);
      if (dx < bestD) {
        bestD = dx;
        best = lb;
      }
    }
    return [alignX(best), alignY(best)];
  }

  function nearestLbDef(lbList: LookDefender[], x: number): LookDefender | null {
    if (!lbList.length) return null;
    let best = lbList[0]!;
    let bestD = Infinity;
    for (const lb of lbList) {
      const dx = Math.abs(alignX(lb) - x);
      if (dx < bestD) {
        bestD = dx;
        best = lb;
      }
    }
    return best;
  }

  // --- Scheme-specific ---
  if (scheme === "dive" || scheme === "iso") {
    assignGodBase();
    // FB lead / iso
    const mike = nearestLbDef(lbs, 50);
    if (mike) {
      setDefEng(
        mike,
        ["fb"],
        scheme === "iso"
          ? `Iso target: FB alone on ${mike.tag} (not GOD — lead block).`
          : `Lead: FB first color ${mike.tag} in the hole.`,
        scheme === "iso",
      );
      const ra = ensureRole("fb");
      ra.rule = "lead";
      ra.usesGod = false;
      ra.whyNotGod = "FB is a lead/iso back — GOD is an OL rule set.";
      ra.why =
        scheme === "iso"
          ? `Square up ${mike.tag} alone. Don't glance. This is man lead, not gap-on-down.`
          : `Lead through the fixed hole — first color is ${mike.tag}.`;
      ra.targetIds = [mike.id];
      ra.targetTags = [mike.tag];
      ra.job = scheme === "iso" ? `Iso ${mike.tag}` : `Lead ${mike.tag}`;
      ra.path = pathClimb([50, 58], [alignX(mike), alignY(mike)]);
    }
    if (scheme === "iso") {
      // Emphasize designed combo on shade/nose
      const nose =
        dls.find((d) => Math.abs(alignX(d) - 50) < 4) ?? dls[Math.floor(dls.length / 2)];
      if (nose) {
        setDefEng(
          nose,
          ["lg", "c"],
          `Designed iso combo: LG+C post ${nose.tag}, climb Mike on flow. GOD uncovered/combo rule.`,
          true,
        );
        for (const ol of ["lg", "c"] as const) {
          const ra = ensureRole(ol);
          ra.rule = "god-combo";
          ra.usesGod = true;
          ra.targetIds = [nose.id];
          ra.targetTags = [nose.tag];
          ra.why = `Iso install combo on ${nose.tag}. GOD: double the down man, one climbs to LB on flow.`;
          ra.job = `Combo ${nose.tag} → climb`;
          ra.path = pathCombo(
            [OL_X[ol]!, 52],
            [alignX(nose), alignY(nose)],
            nearestLb(lbs, 50),
          );
        }
      }
    }
  } else if (scheme === "power") {
    assignGodBase();
    // Override: playside down wall, BS G pulls, BS T hinges
    const playsideEdge = ps === "R" ? dls[dls.length - 1] : dls[0];
    const playsideInterior =
      dls.find((d) =>
        ps === "R" ? alignX(d) >= 52 && alignX(d) < 64 : alignX(d) <= 48 && alignX(d) > 36,
      ) ?? playsideEdge;
    const backsideEdge = ps === "R" ? dls[0] : dls[dls.length - 1];
    const kickLb = nearestLbDef(lbs, ps === "R" ? 62 : 38);

    if (playsideInterior) {
      setDefEng(
        playsideInterior,
        ["rg", "rt"],
        `Power down wall on ${playsideInterior.tag} — GOD down (playside).`,
        true,
      );
    }
    if (playsideEdge && playsideEdge !== playsideInterior) {
      setDefEng(
        playsideEdge,
        ["y", "rt"],
        `Wall edge ${playsideEdge.tag} — Y/RT down (GOD).`,
        true,
      );
    }
    if (backsideEdge) {
      setDefEng(
        backsideEdge,
        ["lt"],
        `Hinge: LT vs ${backsideEdge.tag}. Gap integrity — free runner if you quit.`,
        false,
      );
      const ra = ensureRole("lt");
      ra.rule = "hinge";
      ra.usesGod = true;
      ra.why = `Backside hinge is still gap responsibility (GOD family). Don't chase — sit on ${backsideEdge.tag}.`;
      ra.targetIds = [backsideEdge.id];
      ra.targetTags = [backsideEdge.tag];
      ra.job = `Hinge ${backsideEdge.tag}`;
      ra.path = pathHinge([OL_X.lt!, 52], [alignX(backsideEdge), alignY(backsideEdge)]);
    }
    // Puller LG
    if (kickLb) {
      setDefEng(
        kickLb,
        ["lg", "fb"],
        `Kick/wrap: puller LG + FB on ${kickLb.tag}. Puller is NOT GOD base — leaves his gap.`,
        true,
      );
      const ra = ensureRole("lg");
      ra.rule = "pull";
      ra.usesGod = false;
      ra.whyNotGod = "Puller leaves his On/gap — exception to GOD base rules.";
      ra.why = `Flat pull, lead through the hole, kick ${kickLb.tag}. Your original gap is covered by C block-back.`;
      ra.targetIds = [kickLb.id];
      ra.targetTags = [kickLb.tag];
      ra.job = `Pull kick ${kickLb.tag}`;
      ra.path = pathPull([OL_X.lg!, 52], [alignX(kickLb), alignY(kickLb)], ps);
      const fb = ensureRole("fb");
      fb.rule = "lead";
      fb.usesGod = false;
      fb.whyNotGod = "Fullback lead is not an OL GOD rule.";
      fb.why = `Lead with the puller — first color ${kickLb.tag}.`;
      fb.targetIds = [kickLb.id];
      fb.targetTags = [kickLb.tag];
      fb.job = `Lead ${kickLb.tag}`;
      fb.path = pathClimb([50, 58], [alignX(kickLb), alignY(kickLb)]);
    }
    // Center block back
    const vacated = dls.find((d) => Math.abs(alignX(d) - OL_X.lg!) < 6);
    if (vacated && !vacated.engagedBy.includes("c")) {
      const ceng = [...vacated.engagedBy, "c"].filter((x, i, a) => a.indexOf(x) === i);
      // Don't steal playside doubles — only if C free
      const cra = ensureRole("c");
      if (cra.rule === "god-base" || cra.rule === "god-combo" || cra.rule === "none") {
        cra.rule = "god-down";
        cra.usesGod = true;
        cra.why = `G pulls — you block back for the vacated gap. GOD gap integrity on ${vacated.tag}.`;
        cra.job = `Block back ${vacated.tag}`;
        cra.targetIds = [vacated.id];
        cra.targetTags = [vacated.tag];
        cra.path = pathBase([50, 52], [alignX(vacated), alignY(vacated)]);
      }
    }
  } else if (scheme === "counter-simple" || scheme === "counter") {
    /**
     * Counter LEFT (install).
     * CTR-S: RG only pulls; RT hinges.
     * Full CTR: RG + RT pull; Y cutoff/hinge backside.
     *
     * Critical hole integrity:
     * - Wall (LT/LG) downs first interior DL counter side
     * - C blocks BACK the DL that RG leaves (vacated B) — never leave him free in the RB's face
     * - RG kicks first force LB (Will)
     * - FB wraps Mike (second level) — do NOT double-assign FB on the same Will as RG
     * - Mike must not be free in the counter crease
     */
    assignGodBase();

    const stripOl = (olId: string) => {
      for (const d of defs) {
        if (!d.engagedBy.includes(olId)) continue;
        d.engagedBy = d.engagedBy.filter((x) => x !== olId);
        d.doubleTeam = d.engagedBy.length >= 2;
        if (d.engagedBy.length === 0) d.job = `${d.label} · free until reassigned`;
      }
    };

    const leftEdge = dls[0];
    const rightEdge = dls[dls.length - 1];
    // Interior wall man = first DL inside of left edge (or left edge if only one)
    const leftInterior =
      dls.length >= 2
        ? dls.slice(1).sort((a, b) => alignX(a) - alignX(b))[0] ?? dls[1]
        : dls[0];
    // Prefer wall target near LG (44) / left B-A
    const wallDl =
      dls
        .filter((d) => d.id !== rightEdge?.id)
        .slice()
        .sort(
          (a, b) =>
            Math.abs(alignX(a) - 44) - Math.abs(alignX(b) - 44),
        )[0] ?? leftInterior;

    // Vacated by RG pull: interior DLs only (not wall, not hinge EMOL on CTR-S)
    const vacatedPool = dls.filter((d) => {
      if (wallDl && d.id === wallDl.id) return false;
      // RT hinges the right edge on CTR-S — that man is not C's block-back
      if (
        scheme === "counter-simple" &&
        rightEdge &&
        d.id === rightEdge.id
      ) {
        return false;
      }
      // Outside left EMOL already sealed by wall/Y
      if (
        leftEdge &&
        wallDl &&
        d.id === leftEdge.id &&
        leftEdge.id !== wallDl.id
      ) {
        return false;
      }
      return true;
    });
    // Primary = nearest to RG (the On he leaves)
    const vacatedDl =
      vacatedPool
        .slice()
        .sort(
          (a, b) =>
            Math.abs(alignX(a) - OL_X.rg!) - Math.abs(alignX(b) - OL_X.rg!),
        )[0] ?? null;
    // Any other interior free men also cannot sit in the counter path
    const extraInterior = vacatedPool.filter((d) => d.id !== vacatedDl?.id);

    // Sort LBs by distance to counter POA (~40) then hole (~48)
    const lbsByPoa = lbs
      .slice()
      .sort(
        (a, b) =>
          Math.hypot(alignX(a) - 40, alignY(a) - 46) -
          Math.hypot(alignX(b) - 40, alignY(b) - 46),
      );
    const kickLb = lbsByPoa[0] ?? null; // first force color
    // Wrap = next LB toward the hole (not the kick man)
    const wrapLb =
      lbsByPoa.find((l) => l.id !== kickLb?.id && alignX(l) <= 58) ??
      lbsByPoa[1] ??
      null;
    // Extra box LBs (3-4 double ILB) still near crease
    const extraHoleLbs = lbs.filter(
      (l) =>
        l.id !== kickLb?.id &&
        l.id !== wrapLb?.id &&
        alignX(l) >= 40 &&
        alignX(l) <= 56,
    );

    // --- Counter wall (playside) ---
    if (wallDl) {
      setDefEng(
        wallDl,
        ["lt", "lg"],
        `Counter wall (GOD down): LT+LG on ${wallDl.tag}. Create the crease.`,
        true,
      );
      for (const ol of ["lt", "lg"] as const) {
        const ra = ensureRole(ol);
        ra.rule = "god-down";
        ra.usesGod = true;
        ra.why = `Counter wall: GOD down on ${wallDl.tag} (${dist2d(OL_X[ol]!, OL_Y, alignX(wallDl), alignY(wallDl)).toFixed(1)} yd). Seal him — the hole is behind this block.`;
        ra.targetIds = [wallDl.id];
        ra.targetTags = [wallDl.tag];
        ra.job = `Down wall ${wallDl.tag}`;
        ra.path = pathBase(
          [OL_X[ol]!, OL_Y],
          [alignX(wallDl), alignY(wallDl)],
        );
      }
    }

    // Left EMOL help if separate from wall
    if (leftEdge && wallDl && leftEdge.id !== wallDl.id) {
      setDefEng(
        leftEdge,
        ["lt", "y"].filter((id, i, a) => a.indexOf(id) === i),
        `Wall edge ${leftEdge.tag} — LT/Y seal outside the crease.`,
        true,
      );
      const yra = ensureRole("y");
      yra.rule = "god-down";
      yra.usesGod = true;
      yra.why = `Help seal EMOL ${leftEdge.tag} on the counter edge so force can't spill into the hole.`;
      yra.targetIds = [leftEdge.id];
      yra.targetTags = [leftEdge.tag];
      yra.job = `Seal edge ${leftEdge.tag}`;
      yra.path = pathBase([OL_X.y!, OL_Y], [alignX(leftEdge), alignY(leftEdge)]);
    }

    // --- C block-back on vacated DL(s) — nobody free in the counter path ---
    stripOl("rg");
    stripOl("c");
    const cra = ensureRole("c");
    cra.rule = "god-down";
    cra.usesGod = true;
    cra.targetIds = [];
    cra.targetTags = [];

    if (vacatedDl) {
      setDefEng(
        vacatedDl,
        ["c"],
        `Block-back: C on ${vacatedDl.tag} — the On RG vacated. Free = unblocked in the counter path.`,
        false,
      );
      cra.targetIds.push(vacatedDl.id);
      cra.targetTags.push(vacatedDl.tag);
      cra.why = `RG pulls — block back ${vacatedDl.tag} (${dist2d(50, OL_Y, alignX(vacatedDl), alignY(vacatedDl)).toFixed(1)} yd). GOD gap integrity for the pull. Climb only after he is secured.`;
      cra.job = `Block back ${vacatedDl.tag}`;
      cra.path = pathBase([50, OL_Y], [alignX(vacatedDl), alignY(vacatedDl)]);
    } else if (wallDl) {
      // 3-man front: no separate vacated interior — C posts on the wall / climbs late
      const wallEng = [...new Set([...wallDl.engagedBy, "c"])];
      setDefEng(
        wallDl,
        wallEng,
        `3-down front: C posts wall on ${wallDl.tag} (no separate vacated DL). Climb Mike only when secure.`,
        wallEng.length >= 2,
      );
      cra.targetIds = [wallDl.id];
      cra.targetTags = [wallDl.tag];
      cra.why = `Odd/light front — no separate B-gap man. Post the wall (${wallDl.tag}), then climb. Don't freestyle and leave a free hitter.`;
      cra.job = `Post wall ${wallDl.tag}`;
      cra.path = pathCombo(
        [50, OL_Y],
        [alignX(wallDl), alignY(wallDl)],
        nearestLb(lbs, 50),
      );
    }

    // Extra interior DLs (e.g. 5-2 nose + 3-tech): C must account — never leave free in box
    for (const extra of extraInterior) {
      if (extra.engagedBy.length > 0) continue;
      const eng = [...new Set([...extra.engagedBy, "c"])];
      setDefEng(
        extra,
        eng,
        `Also block-back/account: ${extra.tag} is interior free — C's dual read with primary vacated. Cannot leave him in the RB's face.`,
        false,
      );
      if (!cra.targetIds.includes(extra.id)) {
        cra.targetIds.push(extra.id);
        cra.targetTags.push(extra.tag);
      }
      cra.why = `${cra.why} Also account for ${extra.tag} if he shows in the pull path (dual interior surface).`;
      cra.job = `Block back ${cra.targetTags.join("+")}`;
    }

    // --- Second level: G kicks Will, FB wraps Mike (split — never both on one LB) ---
    if (kickLb) {
      setDefEng(
        kickLb,
        ["rg"],
        `Pull kick: RG only on ${kickLb.tag} (force). FB does NOT double this man — he wraps Mike.`,
        false,
      );
      const ra = ensureRole("rg");
      ra.rule = "pull";
      ra.usesGod = false;
      ra.whyNotGod = "Puller leaves his On — exception to GOD base.";
      ra.why = `ONLY puller on CTR-S (or lead puller on full CTR). Flat path, kick ${kickLb.tag}. C has your vacated DL — trust the block-back.`;
      ra.targetIds = [kickLb.id];
      ra.targetTags = [kickLb.tag];
      ra.job = `Pull kick ${kickLb.tag}`;
      ra.path = pathPull(
        [OL_X.rg!, OL_Y],
        [alignX(kickLb), alignY(kickLb)],
        "L",
      );
    }

    if (wrapLb) {
      setDefEng(
        wrapLb,
        scheme === "counter-simple"
          ? ["fb"]
          : ["fb", "rt"].filter((x, i, a) => a.indexOf(x) === i),
        scheme === "counter-simple"
          ? `Wrap: FB on ${wrapLb.tag} (hole). Leaving him free = unblocked in the counter's face.`
          : `Wrap: FB + trail puller on ${wrapLb.tag} in the hole.`,
        scheme !== "counter-simple",
      );
      const fb = ensureRole("fb");
      fb.rule = "lead";
      fb.usesGod = false;
      fb.whyNotGod = "Fullback lead/wrap is not an OL GOD rule.";
      fb.why = `Wrap ${wrapLb.tag} in the crease. RG kicks force; you take the hole LB. Do not both hit Will — the hole LB would be free in the RB's face.`;
      fb.targetIds = [wrapLb.id];
      fb.targetTags = [wrapLb.tag];
      fb.job = `Wrap ${wrapLb.tag}`;
      fb.path = pathClimb([48, 60], [alignX(wrapLb), alignY(wrapLb)]);
    }
    // 3-4 / stacked ILBs: second hole LB cannot sit free in the crease
    for (const extra of extraHoleLbs) {
      if (extra.engagedBy.length) continue;
      setDefEng(
        extra,
        ["fb"],
        `Second hole LB ${extra.tag} — FB dual read after primary wrap (3-4 surface).`,
        false,
      );
      const fb = ensureRole("fb");
      if (!fb.targetIds.includes(extra.id)) {
        fb.targetIds.push(extra.id);
        fb.targetTags.push(extra.tag);
        fb.why = `${fb.why} Also alert ${extra.tag} (extra ILB in the box).`;
        fb.job = `Wrap ${fb.targetTags.join("+")}`;
      }
    }

    if (scheme === "counter-simple") {
      // RT hinges — stays home so we don't open backside free runner on the same snap we install G-only pull
      if (rightEdge) {
        stripOl("rt");
        setDefEng(
          rightEdge,
          ["rt"],
          `Hinge: RT stays home vs ${rightEdge.tag} (CTR-S — no T pull).`,
          false,
        );
        const ra = ensureRole("rt");
        ra.rule = "hinge";
        ra.usesGod = true;
        ra.why = `CTR-S: only guard pulls. Hinge ${rightEdge.tag} — gap integrity backside. You are not a free release.`;
        ra.targetIds = [rightEdge.id];
        ra.targetTags = [rightEdge.tag];
        ra.job = `Hinge ${rightEdge.tag}`;
        ra.path = pathHinge(
          [OL_X.rt!, OL_Y],
          [alignX(rightEdge), alignY(rightEdge)],
        );
      }
      // Y: if not already on left edge, cutoff help or stalk
      const yra = ensureRole("y");
      if (!yra.targetIds.length && rightEdge) {
        // Y can help hinge/cutoff if TE is strong — otherwise leave note
        yra.rule = "cutoff";
        yra.usesGod = false;
        yra.whyNotGod = "TE cutoff/hinge help is scheme, not pure GOD base.";
        yra.why =
          "Sell fake / help backside edge so the hinge isn't alone. POA is left — don't freestyle into the hole.";
        yra.job = "Backside help / sell";
        yra.path = pathHinge([OL_X.y!, OL_Y], [alignX(rightEdge), alignY(rightEdge)]);
      }
    } else {
      // Full counter: RT pulls trail; Y owns right edge
      stripOl("rt");
      if (kickLb && wrapLb && kickLb.id !== wrapLb.id) {
        // Trail RT wraps hole with FB (already set engagers) or kicks if only one LB
        const ra = ensureRole("rt");
        ra.rule = "pull";
        ra.usesGod = false;
        ra.whyNotGod = "Puller leaves GOD base.";
        ra.why = `Trail puller — wrap ${wrapLb.tag} behind RG's kick.`;
        ra.targetIds = [wrapLb.id];
        ra.targetTags = [wrapLb.tag];
        ra.job = `Trail wrap ${wrapLb.tag}`;
        ra.path = pathPull(
          [OL_X.rt!, OL_Y],
          [alignX(wrapLb), alignY(wrapLb)],
          "L",
        );
      } else if (kickLb) {
        const ra = ensureRole("rt");
        ra.rule = "pull";
        ra.usesGod = false;
        ra.whyNotGod = "Puller leaves GOD base.";
        ra.why = `Trail pull — work ${kickLb.tag} with lead.`;
        ra.targetIds = [kickLb.id];
        ra.targetTags = [kickLb.tag];
        ra.job = `Trail ${kickLb.tag}`;
        ra.path = pathPull(
          [OL_X.rt!, OL_Y],
          [alignX(kickLb), alignY(kickLb)],
          "L",
        );
      }
      if (rightEdge) {
        setDefEng(
          rightEdge,
          ["y"],
          `Backside cutoff: Y vs ${rightEdge.tag} (G+T both pulled).`,
          false,
        );
        const yra = ensureRole("y");
        yra.rule = "cutoff";
        yra.usesGod = false;
        yra.whyNotGod = "Cutoff replaces hinge when both G and T leave.";
        yra.why = `Both pullers left — you are the backside edge on ${rightEdge.tag}.`;
        yra.targetIds = [rightEdge.id];
        yra.targetTags = [rightEdge.tag];
        yra.job = `Cutoff ${rightEdge.tag}`;
        yra.path = pathBase(
          [OL_X.y!, OL_Y],
          [alignX(rightEdge), alignY(rightEdge)],
        );
      }
    }

    // Annotate any remaining unblocked first-level DL in the box (should be none interior)
    for (const dl of dls) {
      if (dl.engagedBy.length === 0) {
        dl.job = `${dl.tag} UNBLOCKED — scheme error risk at ${alignX(dl).toFixed(0)}. Re-check wall/block-back.`;
      }
    }
    // Backside LBs away from POA may be free — justify
    for (const lb of lbs) {
      if (lb.engagedBy.length === 0) {
        const away = alignX(lb) > 58;
        lb.job = away
          ? `${lb.tag} free away from POA (counter left) — accepted; not in the crease.`
          : `${lb.tag} free near box — FB/puller must account; scrape risk.`;
      }
    }
  } else if (scheme === "reach") {
    // Not GOD — reach/seal
    const dir = ps === "R" ? 1 : -1;
    for (const ol of OL_ORDER) {
      const dl =
        olToDl.get(ol) ??
        dls.slice().sort((a, b) => Math.abs(alignX(a) - OL_X[ol]!) - Math.abs(alignX(b) - OL_X[ol]!))[0];
      const ra = ensureRole(ol);
      ra.rule = "reach";
      ra.usesGod = false;
      ra.whyNotGod =
        "Toss/reach is perimeter seal — gain width, keep defender inside. Not gap-on-down base.";
      if (dl) {
        setDefEng(
          dl,
          [...(dl.engagedBy.includes(ol) ? dl.engagedBy : [...dl.engagedBy, ol])],
          `Reach track on ${dl.tag} — seal inside for toss.`,
          false,
        );
        // clean engagedBy
        if (!dl.engagedBy.includes(ol)) dl.engagedBy.push(ol);
        dl.job = `Reach/seal ${dl.tag} — keep him inside.`;
        ra.targetIds = [dl.id];
        ra.targetTags = [dl.tag];
        ra.why = `Reach ${dl.tag}: step playside, gain width, seal inside so speed stays outside.`;
        ra.job = `Reach ${dl.tag}`;
        ra.path = pathReach([OL_X[ol]!, 52], [alignX(dl), alignY(dl)], dir);
      }
    }
    const emol = ps === "R" ? dls[dls.length - 1] : dls[0];
    if (emol) {
      setDefEng(emol, ["rt", "y"], `EMOL seal ${emol.tag} — THE reach for toss.`, true);
      for (const ol of ["rt", "y"] as const) {
        const ra = ensureRole(ol);
        ra.rule = "reach";
        ra.usesGod = false;
        ra.whyNotGod = "Edge seal is reach, not GOD base.";
        ra.why = `Critical EMOL seal on ${emol.tag}. If he crosses your face outside, toss dies.`;
        ra.targetIds = [emol.id];
        ra.targetTags = [emol.tag];
        ra.job = `Seal ${emol.tag}`;
        ra.path = pathReach([OL_X[ol] ?? 62, 52], [alignX(emol), alignY(emol)], dir);
      }
    }
  } else if (scheme === "inside-zone" || scheme === "outside-zone") {
    // Zone — not GOD
    const dir = ps === "R" ? 1 : -1;
    for (const ol of OL_ORDER) {
      const dl = olToDl.get(ol);
      const ra = ensureRole(ol);
      ra.rule = "zone";
      ra.usesGod = false;
      ra.whyNotGod =
        scheme === "inside-zone"
          ? "Inside zone is area blocking: slide to the gap, drive as one, peel on flow — not man-on GOD."
          : "Outside zone is full-line reach stretch with cutback — flow rules, not GOD jersey rules.";
      if (dl) {
        const others = dlToOl.get(dl.id) ?? [ol];
        if (others.length >= 2 || !dl) {
          setDefEng(
            dl,
            others.slice(0, 2),
            `Zone combo on ${dl.tag} — slide/drive, peel LB.`,
            true,
          );
          ra.rule = "zone";
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `Zone combo landmark ${dl.tag}. Stay on track; climb when he is reached.`;
          ra.job = `Zone combo ${dl.tag}`;
          ra.path =
            scheme === "outside-zone"
              ? pathReach([OL_X[ol]!, 52], [alignX(dl), alignY(dl)], dir)
              : pathCombo(
                  [OL_X[ol]!, 52],
                  [alignX(dl), alignY(dl)],
                  nearestLb(lbs, OL_X[ol]!),
                );
        } else {
          setDefEng(dl, [ol], `Zone base/reach ${dl.tag}.`, false);
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `Covered in zone — track ${dl.tag}, vertical or reach per call.`;
          ra.job = `Zone ${dl.tag}`;
          ra.path =
            scheme === "outside-zone"
              ? pathReach([OL_X[ol]!, 52], [alignX(dl), alignY(dl)], dir)
              : pathBase([OL_X[ol]!, 52], [alignX(dl), alignY(dl)]);
        }
      } else {
        const down = findDownDefender(ol, dls, ps);
        if (down) {
          ra.targetIds = [down.id];
          ra.targetTags = [down.tag];
          ra.why = `Uncovered zone — work to ${down.tag} combo then climb.`;
          ra.job = `Zone help ${down.tag}`;
          ra.path = pathCombo(
            [OL_X[ol]!, 52],
            [alignX(down), alignY(down)],
            nearestLb(lbs, OL_X[ol]!),
          );
          const list = [...new Set([...down.engagedBy, ol])];
          setDefEng(down, list, `Zone combo help on ${down.tag}.`, list.length >= 2);
        }
      }
    }
  }

  // Skill / secondary — never OL GOD On
  for (const def of defs) {
    if (isDl(def) || isLb(def)) continue;
    const t = def.tag.toUpperCase();
    if ((t === "CB" || t === "NB") && alignX(def) < 40) {
      setDefEng(def, ["x"], "Stalk / force — not GOD (skill).", false);
      const ra = ensureRole("x");
      ra.rule = "stalk";
      ra.usesGod = false;
      ra.whyNotGod = "WR stalk is not OL GOD.";
      ra.why = "Stalk CB — mirror, don't lunge.";
      ra.targetIds = [def.id];
      ra.targetTags = [def.tag];
      ra.job = "Stalk CB";
      ra.path = pathBase([OL_X.x!, 52], [alignX(def), alignY(def)]);
    } else if (t === "CB" || t === "NB") {
      // Field CB or nickel — WR/TE stalk, NEVER RT base
      const skill = alignX(def) > 70 ? "z" : "y";
      setDefEng(def, [skill], "Perimeter / nickel — not GOD On for OL.", false);
      const ra = ensureRole(skill);
      ra.rule = "stalk";
      ra.usesGod = false;
      ra.whyNotGod = "Nickel/CB is secondary. OL GOD only uses down linemen for On/Down.";
      ra.why = `Stalk/force ${def.tag} — not a RT base assignment.`;
      ra.targetIds = [def.id];
      ra.targetTags = [def.tag];
      ra.job = `Stalk ${def.tag}`;
      ra.path = pathBase([OL_X[skill] ?? 84, 52], [alignX(def), alignY(def)]);
    } else if (t === "SS" || t === "FS") {
      // leave mostly free unless empty
      if (def.engagedBy.length === 0) {
        def.job = def.tag === "FS" ? "Deep middle — late alley." : "Alley / force fold.";
      }
    }
  }

  // LB depth note in jobs
  for (const lb of lbs) {
    const depth = LOS_Y - alignY(lb);
    if (lb.engagedBy.length === 0) {
      lb.job = `${lb.label} · ${depth.toFixed(1)} yd off LOS — scrape/flow (no first-level GOD base).`;
    } else {
      lb.job = `${lb.job} · aligned ${depth.toFixed(1)} yd off ball.`;
    }
  }

  // Fill missing paths for OL from generic
  for (const ol of OL_ORDER) {
    const ra = ensureRole(ol);
    if (!ra.path.length) {
      const dl = olToDl.get(ol);
      ra.path = dl
        ? pathBase([OL_X[ol]!, 52], [alignX(dl), alignY(dl)])
        : pathClimb([OL_X[ol]!, 52], nearestLb(lbs, OL_X[ol]!));
    }
    if (!ra.why) {
      ra.why = godScheme
        ? "See GOD rules for this front."
        : "Scheme does not use pure GOD — follow zone/reach rules.";
    }
    if (!ra.job) ra.job = ra.why.slice(0, 48);
  }

  // Sync defender engagedBy from role targets (defensive consistency)
  // Already set via setDefEng

  // TE default
  if (!roleMap.has("y")) {
    const emol = ps === "R" ? dls[dls.length - 1] : dls[0];
    if (emol) {
      const ra = ensureRole("y");
      ra.rule = godScheme ? "god-down" : "reach";
      ra.usesGod = godScheme;
      ra.why = godScheme
        ? `TE wall/EMOL help on ${emol.tag} under GOD/gap rules.`
        : `TE perimeter help on ${emol.tag}.`;
      ra.targetIds = [emol.id];
      ra.targetTags = [emol.tag];
      ra.job = `Help ${emol.tag}`;
      ra.path = pathBase([OL_X.y!, 52], [alignX(emol), alignY(emol)]);
      if (!emol.engagedBy.includes("y")) {
        emol.engagedBy = [...emol.engagedBy, "y"];
      }
    }
  }


  // Attach drive paths: desired angle of displacement for each engaged defender
  attachDrivePaths(defs, scheme, ps, roleMap);

  return {
    scheme,
    schemeUsesGod: godScheme,
    schemeNote: schemeGodExplanation(scheme),
    frontLabel: "",
    defenders: defs,
    roles: [...roleMap.values()],
    gaps,
  };
}

/**
 * Build a drive path for each defender from engagement geometry + scheme.
 * Path[0] = alignment, then contact lean, then finish (driven yards).
 */
function attachDrivePaths(
  defs: LookDefender[],
  scheme: SchemeId,
  ps: "L" | "R",
  roleMap: Map<string, RoleAssignment>,
): void {
  const side = ps === "R" ? 1 : -1;
  for (const def of defs) {
    const x0 = def.path[0]?.[0] ?? 50;
    const y0 = def.path[0]?.[1] ?? 48;
    const level = classifyDefender(def);

    if (!def.engagedBy.length) {
      // Idle: small reactive settle so everyone still "moves" full duration
      def.drivePath = [
        [x0, y0],
        [x0 + side * 0.4, y0 - 0.8],
        [x0 + side * 0.6, y0 - 1.6],
      ];
      continue;
    }

    // Weighted engagers' landmarks
    let ox = 0;
    let n = 0;
    for (const id of def.engagedBy) {
      if (OL_X[id] != null) {
        ox += OL_X[id]!;
        n++;
      }
    }
    ox = n > 0 ? ox / n : x0;

    // Base drive: away from OL through defender (downfield for D = -y)
    let dx = (x0 - ox) * 0.35;
    let dy = -1;

    if (scheme === "reach" || scheme === "outside-zone") {
      dx = side * 1.4 + (x0 - ox) * 0.2;
      dy = -0.55;
    } else if (scheme === "power" || scheme === "counter" || scheme === "counter-simple") {
      // Wall: slightly playside + downfield; kick LB more lateral
      if (level === "lb") {
        dx = side * 1.1;
        dy = -0.35;
      } else {
        dx = side * 0.35 + (x0 - ox) * 0.15;
        dy = -1.05;
      }
    } else if (scheme === "inside-zone") {
      dx = side * 0.55 + (x0 - ox) * 0.25;
      dy = -0.9;
    } else if (scheme === "iso" || scheme === "dive") {
      dx = (x0 - ox) * 0.2 + side * 0.15;
      dy = level === "lb" ? -0.45 : -1.1;
    }

    // Normalize and scale yards of drive
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;
    const yards = level === "dl" ? (def.doubleTeam ? 7.5 : 5.5) : level === "lb" ? 4.5 : 3.2;

    const midX = x0 + dx * yards * 0.4;
    const midY = y0 + dy * yards * 0.4;
    const endX = x0 + dx * yards;
    const endY = y0 + dy * yards;

    def.drivePath = [
      [x0, y0],
      [midX, midY],
      [Math.min(94, Math.max(6, endX)), Math.min(94, Math.max(6, endY))],
    ];

    // Light path for lookProgress animation stays aligned with drive
    def.path = [
      [x0, y0],
      [midX, midY],
      [Math.min(94, Math.max(6, endX)), Math.min(94, Math.max(6, endY))],
    ];

    // Annotate jobs
    const ang = (Math.atan2(-dy, dx) * 180) / Math.PI;
    def.job = `${def.job} · drive ${ang.toFixed(0)}° ${yards.toFixed(0)}yd`;
  }

  // Nudge OL assignment paths to finish along same drive timeline length
  for (const ra of roleMap.values()) {
    if (ra.path.length < 2 || !ra.targetIds.length) continue;
    const target = defs.find((d) => d.id === ra.targetIds[0]);
    if (!target?.drivePath?.length) continue;
    const fin = target.drivePath[target.drivePath.length - 1]!;
    const last = ra.path[ra.path.length - 1]!;
    // Extend OL finish slightly toward drive finish so motion lasts
    ra.path = [
      ...ra.path,
      [(last[0] + fin[0]) / 2, (last[1] + fin[1]) / 2],
      [fin[0] + (last[0] - fin[0]) * 0.15, fin[1] + 0.8],
    ];
  }
}


/** @deprecated use evaluateAssignments — kept for call sites */
export function assignBlocking(
  raw: LookDefender[],
  scheme: SchemeId,
): LookDefender[] {
  return evaluateAssignments(raw, scheme).defenders;
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

export function resolvePlayLook(
  playId: string,
  frontId: DefFrontId = "43-over",
  positionOverrides?: Record<string, FieldPoint>,
): PlayLook | null {
  const scheme = schemeOf(playId);
  if (!scheme) return null;
  const baseId = frontId === "custom" ? "43-over" : frontId;
  let raw = buildFrontAlignments(baseId);
  if (positionOverrides && Object.keys(positionOverrides).length) {
    raw = applyPositionOverrides(raw, positionOverrides);
  }
  const report = evaluateAssignments(raw, scheme);
  report.frontLabel = frontId === "custom" ? "Custom front" : frontLabel(frontId);
  const heavy = report.defenders
    .filter((d) => d.doubleTeam || d.engagedBy.length >= 2)
    .map((d) => d.id)
    .slice(0, 4);

  const godLine = report.schemeUsesGod
    ? `GOD ON for this call. ${report.schemeNote}`
    : `GOD limited/off for this call. ${report.schemeNote}`;

  return {
    frontId,
    front: `${report.frontLabel} · ${schemeShort(scheme)}`,
    note: godLine,
    defenders: report.defenders,
    phaseProgress: standardPhases(report.defenders, heavy),
  };
}

function schemeShort(scheme: SchemeId): string {
  const m: Record<SchemeId, string> = {
    dive: "GOD base",
    iso: "GOD + iso",
    "inside-zone": "zone (not GOD)",
    power: "GOD wall + pull",
    reach: "reach (not GOD)",
    "outside-zone": "OZ (not GOD)",
    "counter-simple": "GOD wall + G pull",
    counter: "GOD wall + G/T pull",
  };
  return m[scheme];
}

export function buildAssignmentPaths(
  play: Play,
  defenders: LookDefender[],
): { paths: Record<string, FieldPoint[]>; jobs: Record<string, string> } {
  const scheme = schemeOf(play.id);
  if (!scheme) return { paths: {}, jobs: {} };
  const report = evaluateAssignments(defenders, scheme);
  const paths: Record<string, FieldPoint[]> = {};
  const jobs: Record<string, string> = {};
  for (const ra of report.roles) {
    if (ra.roleId === "qb" || ra.roleId === "rb") continue;
    if (ra.path.length) paths[ra.roleId] = ra.path;
    if (ra.job) jobs[ra.roleId] = ra.job;
  }
  return { paths, jobs };
}

/** Full teaching report for UI */
export function getAssignmentReport(
  playId: string,
  frontId: DefFrontId,
  positionOverrides?: Record<string, FieldPoint>,
): AssignmentReport | null {
  const scheme = schemeOf(playId);
  if (!scheme) return null;
  const baseId = frontId === "custom" ? "43-over" : frontId;
  let raw = buildFrontAlignments(baseId);
  if (positionOverrides && Object.keys(positionOverrides).length) {
    raw = applyPositionOverrides(raw, positionOverrides);
  }
  const report = evaluateAssignments(raw, scheme);
  report.frontLabel =
    frontId === "custom" ? "Custom (drag) front" : frontLabel(frontId);
  return report;
}

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

export function buildSimPlay(
  play: Play,
  frontId: DefFrontId,
  olMode: "generic" | "assignment",
  positionOverrides?: Record<string, FieldPoint>,
): Play {
  const look = resolvePlayLook(play.id, frontId, positionOverrides);
  if (!look) return play;

  let roles: PlayRole[] = play.roles;
  if (olMode === "assignment") {
    const { paths, jobs } = buildAssignmentPaths(play, look.defenders);
    roles = play.roles.map((r) => {
      const path = paths[r.id];
      if (!path) return r;
      return { ...r, path, job: jobs[r.id] ?? r.job };
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
