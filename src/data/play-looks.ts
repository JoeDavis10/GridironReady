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
    d("look-cb-slot", "N", "Slot", [72, 48], "Slot / edge"),
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
  }));
}

function isDl(tag: string): boolean {
  const t = tag.toUpperCase();
  return t === "E" || t === "T" || t === "N";
}

function isLb(tag: string): boolean {
  const t = tag.toUpperCase();
  return t === "M" || t === "W" || t === "S";
}

function alignX(def: LookDefender): number {
  return def.path[0]?.[0] ?? 50;
}
function alignY(def: LookDefender): number {
  return def.path[0]?.[1] ?? 48;
}

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

  const dls = defs
    .filter((d) => isDl(d.tag))
    .sort((a, b) => alignX(a) - alignX(b));
  const lbs = defs
    .filter((d) => isLb(d.tag))
    .sort((a, b) => alignX(a) - alignX(b));

  // Clear engagements
  for (const def of defs) {
    def.engagedBy = [];
    def.doubleTeam = false;
    def.job = def.label;
  }

  // --- Gap map from DL geometry ---
  // For each OL, find the DL in their "on" head-up zone (nearest by x within threshold)
  const COVER_THRESH = 5.5; // yards — head-up / shade window
  const olToDl = new Map<string, LookDefender | null>();
  const dlToOl = new Map<string, string[]>();

  for (const ol of OL_ORDER) {
    const ox = OL_X[ol]!;
    let best: LookDefender | null = null;
    let bestD = Infinity;
    for (const dl of dls) {
      const dx = Math.abs(alignX(dl) - ox);
      if (dx < bestD) {
        bestD = dx;
        best = dl;
      }
    }
    if (best && bestD <= COVER_THRESH) {
      olToDl.set(ol, best);
      const list = dlToOl.get(best.id) ?? [];
      list.push(ol);
      dlToOl.set(best.id, list);
    } else {
      olToDl.set(ol, null); // uncovered
    }
  }

  // Build gap landmarks between DL
  const gaps: AssignmentReport["gaps"] = [];
  for (let i = 0; i < dls.length - 1; i++) {
    const a = dls[i]!;
    const b = dls[i + 1]!;
    const mid = (alignX(a) + alignX(b)) / 2;
    const width = alignX(b) - alignX(a);
    let label = "gap";
    if (mid < 44) label = "B/C weak";
    else if (mid < 50) label = "A weak";
    else if (mid < 56) label = "A strong";
    else label = "B/C strong";
    gaps.push({
      id: `gap-${a.id}-${b.id}`,
      label: `${label} (${width.toFixed(0)} yd)`,
      x: mid,
      covered: width < 6,
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
    // Covered: base the man on you
    for (const ol of OL_ORDER) {
      const dl = olToDl.get(ol);
      const ra = ensureRole(ol);
      const gap = gapLabelForOl(ol, ps);
      ra.gap = gap;

      if (dl) {
        const others = dlToOl.get(dl.id) ?? [ol];
        if (others.length === 1) {
          // True 1-on-1 GOD base
          setDefEng(
            dl,
            [ol],
            `GOD On: ${ol.toUpperCase()} bases ${dl.tag} (head-up/shade, ${Math.abs(alignX(dl) - OL_X[ol]!).toFixed(1)} yd). Gap ${gap}.`,
            false,
          );
          ra.rule = "god-base";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `You are COVERED. GOD = base the man On you (${dl.tag}). Your playside gap is ${gap}. Drive him — no freelancing.`;
          ra.job = `Base ${dl.tag} · GOD On · gap ${gap}`;
          ra.path = pathBase([OL_X[ol]!, 52], [alignX(dl), alignY(dl)]);
        } else {
          // Shared surface — will resolve uncovered combo
          // Mark temporarily; combo pass fixes
          ra.rule = "god-combo";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          ra.why = `Shared surface on ${dl.tag} with ${others.filter((x) => x !== ol).join("/").toUpperCase()}. GOD uncovered rules decide combo vs base.`;
          ra.job = `Combo/${dl.tag}`;
        }
      } else {
        // Uncovered — find down defender (nearest DL toward playside/center)
        const down = findDownDefender(ol, dls, ps);
        ra.rule = "god-down";
        ra.usesGod = true;
        if (down) {
          ra.targetIds = [down.id];
          ra.targetTags = [down.tag];
          ra.why = `You are UNCOVERED (no DL within ${COVER_THRESH} yd of your head). GOD Down: double the next down defender (${down.tag}) and climb to LB on flow.`;
          ra.job = `Down double ${down.tag} → climb`;
          ra.path = pathCombo([OL_X[ol]!, 52], [alignX(down), alignY(down)], nearestLb(lbs, OL_X[ol]!));
          // Add to down's engagers
          const list = [...down.engagedBy];
          if (!list.includes(ol)) list.push(ol);
          setDefEng(
            down,
            list,
            `GOD Down double: ${list.map((x) => x.toUpperCase()).join("+")} on ${down.tag}. Climb LB on flow.`,
            list.length >= 2,
          );
        } else {
          ra.why = "Uncovered with no clear down man — climb first color (LB) in your gap.";
          ra.job = "Climb first color";
          ra.path = pathClimb([OL_X[ol]!, 52], nearestLb(lbs, OL_X[ol]!));
        }
      }
    }

    // Finalize shared-surface combos
    for (const dl of dls) {
      const ols = dlToOl.get(dl.id) ?? [];
      if (ols.length >= 2) {
        setDefEng(
          dl,
          ols.slice(0, 2),
          `GOD combo post: ${ols
            .slice(0, 2)
            .map((x) => x.toUpperCase())
            .join("+")} share ${dl.tag} (two OL mapped nearest). Drive as one, peel on flow.`,
          true,
        );
        for (const ol of ols) {
          const ra = ensureRole(ol);
          ra.rule = "god-combo";
          ra.usesGod = true;
          ra.targetIds = [dl.id];
          ra.targetTags = [dl.tag];
          const partner = ols.find((x) => x !== ol);
          ra.why = `Two OL nearest to ${dl.tag}. GOD combo: post with ${partner?.toUpperCase() ?? "partner"}, climb LB when he shows.`;
          ra.job = `Combo ${dl.tag} w/ ${partner?.toUpperCase() ?? "?"}`;
          ra.path = pathCombo(
            [OL_X[ol]!, 52],
            [alignX(dl), alignY(dl)],
            nearestLb(lbs, OL_X[ol]!),
          );
        }
      }
    }

    // Edge DLs not claimed: assign EMOL
    for (const dl of dls) {
      if (dl.engagedBy.length === 0) {
        const edgeOl = alignX(dl) < 50 ? "lt" : "rt";
        setDefEng(
          dl,
          [edgeOl],
          `GOD edge: ${edgeOl.toUpperCase()} owns EMOL ${dl.tag} (${Math.abs(alignX(dl) - OL_X[edgeOl]!).toFixed(1)} yd outside).`,
          false,
        );
        const ra = ensureRole(edgeOl);
        if (!ra.targetIds.includes(dl.id)) {
          ra.targetIds.push(dl.id);
          ra.targetTags.push(dl.tag);
        }
        if (ra.rule === "none" || ra.rule === "god-base") {
          ra.rule = "god-base";
          ra.usesGod = true;
          ra.why = `Edge defender ${dl.tag} is your On/EMOL. GOD: base or hinge per call.`;
          ra.job = `Edge ${dl.tag}`;
          ra.path = pathBase([OL_X[edgeOl]!, 52], [alignX(dl), alignY(dl)]);
        }
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
    // Down = nearest DL toward the center / playside interior
    let best: LookDefender | null = null;
    let bestD = Infinity;
    for (const dl of dlList) {
      const x = alignX(dl);
      // Prefer DL inside toward ball
      const towardCenter = Math.abs(x - 50) < Math.abs(ox - 50) + 2;
      const dx = Math.abs(x - ox);
      if (dx < 0.5) continue;
      const score = dx + (towardCenter ? 0 : 3);
      if (score < bestD) {
        bestD = score;
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
    assignGodBase();
    const leftEdge = dls[0];
    const rightEdge = dls[dls.length - 1];
    const kickLb = nearestLbDef(lbs, 38);
    const leftInterior = dls[1] ?? dls[0];

    if (leftInterior) {
      setDefEng(
        leftInterior,
        ["lt", "lg"],
        `Counter down wall on ${leftInterior.tag} — GOD down (counter side).`,
        true,
      );
      for (const ol of ["lt", "lg"] as const) {
        const ra = ensureRole(ol);
        ra.rule = "god-down";
        ra.usesGod = true;
        ra.why = `Counter wall: GOD down on ${leftInterior.tag}. Create the crease for the puller(s).`;
        ra.targetIds = [leftInterior.id];
        ra.targetTags = [leftInterior.tag];
        ra.job = `Down ${leftInterior.tag}`;
        ra.path = pathBase([OL_X[ol]!, 52], [alignX(leftInterior), alignY(leftInterior)]);
      }
    }
    if (scheme === "counter-simple") {
      // Only G pulls; RT hinges
      if (rightEdge) {
        setDefEng(
          rightEdge,
          ["rt"],
          `Hinge: RT stays home vs ${rightEdge.tag} (simplified — no T pull).`,
          false,
        );
        const ra = ensureRole("rt");
        ra.rule = "hinge";
        ra.usesGod = true;
        ra.why = `CTR-S: only guard pulls. You hinge — GOD gap integrity on ${rightEdge.tag}.`;
        ra.targetIds = [rightEdge.id];
        ra.targetTags = [rightEdge.tag];
        ra.job = `Hinge ${rightEdge.tag}`;
        ra.path = pathHinge([OL_X.rt!, 52], [alignX(rightEdge), alignY(rightEdge)]);
      }
      if (kickLb) {
        setDefEng(
          kickLb,
          ["rg", "fb"],
          `Single pull kick: RG + FB on ${kickLb.tag}.`,
          true,
        );
        const ra = ensureRole("rg");
        ra.rule = "pull";
        ra.usesGod = false;
        ra.whyNotGod = "Puller leaves his On — exception to GOD.";
        ra.why = `Flat pull (only puller in CTR-S). Kick ${kickLb.tag}.`;
        ra.targetIds = [kickLb.id];
        ra.targetTags = [kickLb.tag];
        ra.job = `Pull kick ${kickLb.tag}`;
        ra.path = pathPull([OL_X.rg!, 52], [alignX(kickLb), alignY(kickLb)], "L");
      }
    } else {
      // Full counter G+T pull
      if (kickLb) {
        setDefEng(
          kickLb,
          ["rg", "rt"],
          `Dual pull: G lead + T trail on ${kickLb.tag}.`,
          true,
        );
        for (const ol of ["rg", "rt"] as const) {
          const ra = ensureRole(ol);
          ra.rule = "pull";
          ra.usesGod = false;
          ra.whyNotGod = "Pullers leave GOD base gaps.";
          ra.why =
            ol === "rg"
              ? `Lead puller — kick ${kickLb.tag}.`
              : `Trail puller — wrap ${kickLb.tag} / second level.`;
          ra.targetIds = [kickLb.id];
          ra.targetTags = [kickLb.tag];
          ra.job = ol === "rg" ? `Lead pull ${kickLb.tag}` : `Trail wrap ${kickLb.tag}`;
          ra.path = pathPull([OL_X[ol]!, 52], [alignX(kickLb), alignY(kickLb)], "L");
        }
      }
      if (rightEdge) {
        setDefEng(
          rightEdge,
          ["y"],
          `Backside cutoff: Y vs ${rightEdge.tag} (both G+T left).`,
          false,
        );
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

  // Skill / secondary
  for (const def of defs) {
    if (isDl(def.tag) || isLb(def.tag)) continue;
    if (def.tag === "CB" && alignX(def) < 50) {
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
    } else if (def.tag === "CB") {
      setDefEng(def, ["z"], "Stalk / force — not GOD (skill).", false);
      const ra = ensureRole("z");
      ra.rule = "stalk";
      ra.usesGod = false;
      ra.whyNotGod = "WR stalk is not OL GOD.";
      ra.why = "Stalk CB — mirror.";
      ra.targetIds = [def.id];
      ra.targetTags = [def.tag];
      ra.job = "Stalk CB";
      ra.path = pathBase([OL_X.z!, 52], [alignX(def), alignY(def)]);
    } else if (def.tag === "SS" || def.tag === "FS") {
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
