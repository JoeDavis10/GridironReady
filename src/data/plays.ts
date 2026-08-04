import type { PositionId } from "./positions";

/** Field coords: x 0–100 (sideline to sideline), y 0–100 (offense end → defense end). LOS at y=50. */
export type FieldPoint = [number, number];

export type PlaySide = "offense" | "defense";

export interface PlayRole {
  id: string;
  /** Jersey-style tag on the diagram */
  tag: string;
  label: string;
  positionId: PositionId;
  /** Full movement path for the play */
  path: FieldPoint[];
  /** What this player does — shown in the role panel */
  job: string;
  /** Phase index when this role is highlighted in the explanation */
  highlightPhases?: number[];
}

export interface PlayPhase {
  id: string;
  title: string;
  /** Coach talk track for this phase */
  explanation: string;
  coachingPoints: string[];
  durationMs: number;
  /**
   * How far along each role's path (0–1) at the *end* of this phase.
   * Missing roles keep previous progress.
   */
  roleProgress: Record<string, number>;
}

export interface Play {
  id: string;
  name: string;
  shortName: string;
  side: PlaySide;
  formation: string;
  personnel: string;
  summary: string;
  whenToCall: string;
  keys: string[];
  roles: PlayRole[];
  phases: PlayPhase[];
  relatedPositionIds: PositionId[];
}

/** Progress at the start of a phase = previous phase end (0 for first). */
export function roleProgressAtPhaseStart(
  play: Play,
  phaseIndex: number,
  roleId: string,
): number {
  if (phaseIndex <= 0) return 0;
  for (let i = phaseIndex - 1; i >= 0; i--) {
    const v = play.phases[i]?.roleProgress[roleId];
    if (typeof v === "number") return v;
  }
  return 0;
}

export function roleProgressAtPhaseEnd(
  play: Play,
  phaseIndex: number,
  roleId: string,
): number {
  for (let i = phaseIndex; i >= 0; i--) {
    const v = play.phases[i]?.roleProgress[roleId];
    if (typeof v === "number") return v;
  }
  return 0;
}

export function pointAlongPath(path: FieldPoint[], t: number): FieldPoint {
  if (path.length === 0) return [50, 50];
  if (path.length === 1) return path[0]!;
  const clamped = Math.max(0, Math.min(1, t));
  let total = 0;
  const segs: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const d = Math.hypot(
      path[i]![0] - path[i - 1]![0],
      path[i]![1] - path[i - 1]![1],
    );
    segs.push(d);
    total += d;
  }
  if (total < 0.001) return path[0]!;
  let dist = clamped * total;
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]!;
    if (dist <= seg || i === segs.length - 1) {
      const u = seg < 0.001 ? 0 : dist / seg;
      const a = path[i]!;
      const b = path[i + 1]!;
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }
    dist -= seg;
  }
  return path[path.length - 1]!;
}

export const plays: Play[] = [
  {
    id: "inside-zone",
    name: "Inside Zone",
    shortName: "IZ",
    side: "offense",
    formation: "11 personnel · Gun Trips",
    personnel: "1 RB · 1 TE · 3 WR",
    summary:
      "Horizontal stretch of the front: linemen reach/combo to second level while the back presses the line and cuts off the first defender who crosses his face.",
    whenToCall:
      "Base early-down run vs even fronts. Teaches vision, pad level, and OL double-team timing.",
    keys: [
      "Back presses A/B gap — no bounce early",
      "OL eyes to second level after combo",
      "QB mesh depth consistent; eyes fake play-action",
    ],
    relatedPositionIds: ["qb", "rb", "ol", "te", "wr"],
    roles: [
      {
        id: "qb",
        tag: "QB",
        label: "Quarterback",
        positionId: "qb",
        path: [
          [50, 58],
          [50, 56],
          [48, 54],
          [42, 52],
        ],
        job: "Snap, mesh depth, sell boot/PA eyes, replace or boot after handoff.",
        highlightPhases: [0, 1],
      },
      {
        id: "rb",
        tag: "RB",
        label: "Running back",
        positionId: "rb",
        path: [
          [46, 62],
          [48, 56],
          [50, 50],
          [52, 44],
          [54, 36],
          [56, 28],
        ],
        job: "Press the track, one cut off first color in the hole, finish north.",
        highlightPhases: [1, 2],
      },
      {
        id: "lt",
        tag: "LT",
        label: "Left tackle",
        positionId: "ol",
        path: [
          [38, 52],
          [40, 48],
          [42, 42],
          [44, 36],
        ],
        job: "Reach or base DE; climb to backer if uncovered.",
        highlightPhases: [0, 1],
      },
      {
        id: "lg",
        tag: "LG",
        label: "Left guard",
        positionId: "ol",
        path: [
          [44, 52],
          [46, 48],
          [48, 42],
          [50, 36],
        ],
        job: "Combo to Mike — vertical push then peel.",
        highlightPhases: [0, 1],
      },
      {
        id: "c",
        tag: "C",
        label: "Center",
        positionId: "ol",
        path: [
          [50, 52],
          [51, 48],
          [52, 42],
          [53, 36],
        ],
        job: "Snap + A-gap ID; work to second level.",
        highlightPhases: [0],
      },
      {
        id: "rg",
        tag: "RG",
        label: "Right guard",
        positionId: "ol",
        path: [
          [56, 52],
          [55, 48],
          [54, 42],
          [53, 36],
        ],
        job: "Combo / base — create vertical seams.",
        highlightPhases: [0, 1],
      },
      {
        id: "rt",
        tag: "RT",
        label: "Right tackle",
        positionId: "ol",
        path: [
          [62, 52],
          [60, 48],
          [58, 42],
          [56, 36],
        ],
        job: "Secure edge; force DE wide if zone away.",
        highlightPhases: [0],
      },
      {
        id: "y",
        tag: "Y",
        label: "Tight end",
        positionId: "te",
        path: [
          [68, 52],
          [66, 48],
          [64, 42],
          [62, 34],
        ],
        job: "Arc or base end; seal for cutback alley.",
        highlightPhases: [1, 2],
      },
      {
        id: "x",
        tag: "X",
        label: "X receiver",
        positionId: "wr",
        path: [
          [18, 52],
          [18, 40],
          [20, 28],
        ],
        job: "Outside stalk — crack/force depending on call.",
        highlightPhases: [2],
      },
      {
        id: "z",
        tag: "Z",
        label: "Z receiver",
        positionId: "wr",
        path: [
          [82, 52],
          [80, 40],
          [78, 28],
        ],
        job: "Force / crack — hold edge for cutback.",
        highlightPhases: [2],
      },
    ],
    phases: [
      {
        id: "iz-pre",
        title: "Pre-snap & snap",
        explanation:
          "Identify front and backer. Center sets the mesh clock. Back aligns on track — not too deep.",
        coachingPoints: [
          "Cadence same as pass",
          "OL first step lateral/zone direction",
          "RB eyes through A/B — not the sideline",
        ],
        durationMs: 1600,
        roleProgress: {
          qb: 0.15,
          rb: 0.12,
          lt: 0.15,
          lg: 0.15,
          c: 0.2,
          rg: 0.15,
          rt: 0.15,
          y: 0.12,
          x: 0.1,
          z: 0.1,
        },
      },
      {
        id: "iz-mesh",
        title: "Mesh & stretch",
        explanation:
          "QB rides the mesh. OL doubles climb. Back presses the line of scrimmage — patience without stopping feet.",
        coachingPoints: [
          "Soft mesh — don't punch the ball",
          "Combo eyes to second level",
          "Back: press, then one cut",
        ],
        durationMs: 1800,
        roleProgress: {
          qb: 0.55,
          rb: 0.45,
          lt: 0.45,
          lg: 0.5,
          c: 0.5,
          rg: 0.5,
          rt: 0.45,
          y: 0.4,
          x: 0.35,
          z: 0.35,
        },
      },
      {
        id: "iz-cut",
        title: "Cut & finish",
        explanation:
          "First defender who crosses the face is the cut key. Get vertical, pad level down, finish through contact.",
        coachingPoints: [
          "One cut — no dance",
          "North-south after the plant",
          "OL finish on backers",
        ],
        durationMs: 2200,
        roleProgress: {
          qb: 1,
          rb: 1,
          lt: 1,
          lg: 1,
          c: 1,
          rg: 1,
          rt: 1,
          y: 1,
          x: 1,
          z: 1,
        },
      },
    ],
  },
  {
    id: "outside-zone",
    name: "Outside Zone",
    shortName: "OZ",
    side: "offense",
    formation: "12 personnel · Gun Duo",
    personnel: "1 RB · 2 TE · 2 WR",
    summary:
      "Wide stretch to force horizontal pursuit. Back aims for the edge, cuts up when a crease appears — or bounces if sealed.",
    whenToCall: "Vs light boxes or when you want edge stress and cutback lanes.",
    keys: [
      "OL lateral first step — reach landmarks",
      "Back aims outside hip of EMOL",
      "Patience: let blocks develop before cut",
    ],
    relatedPositionIds: ["qb", "rb", "ol", "te", "wr"],
    roles: [
      {
        id: "qb",
        tag: "QB",
        label: "Quarterback",
        positionId: "qb",
        path: [
          [50, 58],
          [52, 56],
          [58, 54],
          [64, 52],
        ],
        job: "Wide mesh path, boot sell after handoff.",
      },
      {
        id: "rb",
        tag: "RB",
        label: "Running back",
        positionId: "rb",
        path: [
          [46, 62],
          [54, 56],
          [62, 50],
          [70, 42],
          [74, 32],
          [72, 24],
        ],
        job: "Attack outside, cut up on first crease, finish.",
      },
      {
        id: "ol-l",
        tag: "OL",
        label: "Play-side OL",
        positionId: "ol",
        path: [
          [56, 52],
          [64, 48],
          [70, 42],
          [74, 36],
        ],
        job: "Reach / climb — create the edge lane.",
      },
      {
        id: "y",
        tag: "Y",
        label: "Tight end",
        positionId: "te",
        path: [
          [68, 52],
          [74, 48],
          [80, 42],
          [82, 34],
        ],
        job: "Seal EMOL or climb force.",
      },
      {
        id: "z",
        tag: "Z",
        label: "Z receiver",
        positionId: "wr",
        path: [
          [88, 52],
          [90, 42],
          [88, 32],
        ],
        job: "Crack or force — don't let edge free.",
      },
      {
        id: "x",
        tag: "X",
        label: "X receiver",
        positionId: "wr",
        path: [
          [14, 52],
          [16, 40],
          [20, 30],
        ],
        job: "Cutback safety / stalk backside.",
      },
    ],
    phases: [
      {
        id: "oz-snap",
        title: "Snap & stretch",
        explanation:
          "Everyone flows play-side. Back takes a wide path — not a dive.",
        coachingPoints: ["Lateral OL steps", "RB landmark outside", "QB mesh away from pressure"],
        durationMs: 1700,
        roleProgress: { qb: 0.3, rb: 0.25, "ol-l": 0.3, y: 0.3, z: 0.25, x: 0.2 },
      },
      {
        id: "oz-read",
        title: "Read the edge",
        explanation:
          "If EMOL is reached, bounce. If a crease opens inside, plant and get north.",
        coachingPoints: ["Trust the crease", "One decisive cut", "Finish through arm tackles"],
        durationMs: 2000,
        roleProgress: { qb: 0.7, rb: 0.65, "ol-l": 0.7, y: 0.7, z: 0.6, x: 0.55 },
      },
      {
        id: "oz-finish",
        title: "Finish",
        explanation: "Vertical after the cut. WRs sustain blocks — don't peep.",
        coachingPoints: ["Pad level", "Ball security outside", "Second effort blocks"],
        durationMs: 1800,
        roleProgress: { qb: 1, rb: 1, "ol-l": 1, y: 1, z: 1, x: 1 },
      },
    ],
  },
  {
    id: "power",
    name: "Power",
    shortName: "PWR",
    side: "offense",
    formation: "21 personnel · I-Form",
    personnel: "2 RB · 1 TE · 2 WR",
    summary:
      "Down blocks create a wall; puller leads through the hole. Classic gap scheme — physical and teachable.",
    whenToCall: "Short yardage, identity runs, and teaching down-block / pull angles.",
    keys: [
      "PS down blocks — no soft shoulders",
      "Puller path tight to LOS",
      "Back follows puller — don't overrun",
    ],
    relatedPositionIds: ["qb", "rb", "ol", "te"],
    roles: [
      {
        id: "qb",
        tag: "QB",
        label: "Quarterback",
        positionId: "qb",
        path: [
          [50, 56],
          [50, 54],
          [48, 52],
        ],
        job: "Under center or gun mesh — reverse out clean.",
      },
      {
        id: "rb",
        tag: "RB",
        label: "Running back",
        positionId: "rb",
        path: [
          [50, 68],
          [52, 58],
          [56, 50],
          [58, 40],
          [60, 30],
        ],
        job: "Aim for the hole off the puller's hip.",
      },
      {
        id: "fb",
        tag: "FB",
        label: "Fullback / H",
        positionId: "rb",
        path: [
          [48, 64],
          [54, 54],
          [58, 48],
          [60, 42],
        ],
        job: "Kick out or lead — first color in the hole.",
      },
      {
        id: "pull",
        tag: "G",
        label: "Pulling guard",
        positionId: "ol",
        path: [
          [44, 52],
          [50, 50],
          [56, 48],
          [60, 44],
          [62, 40],
        ],
        job: "Pull for kick or wrap — path tight.",
      },
      {
        id: "pst",
        tag: "T",
        label: "PS tackle",
        positionId: "ol",
        path: [
          [62, 52],
          [60, 48],
          [58, 42],
        ],
        job: "Down block — create the wall.",
      },
      {
        id: "y",
        tag: "Y",
        label: "Tight end",
        positionId: "te",
        path: [
          [68, 52],
          [66, 48],
          [64, 42],
        ],
        job: "Down or hinge — secure edge.",
      },
    ],
    phases: [
      {
        id: "pwr-down",
        title: "Down blocks",
        explanation: "Play-side creates the wall. Puller gets his head around and tracks the hole.",
        coachingPoints: ["Flat back on down blocks", "Puller: don't loop deep", "Back: patience one count"],
        durationMs: 1600,
        roleProgress: { qb: 0.4, rb: 0.2, fb: 0.3, pull: 0.35, pst: 0.4, y: 0.35 },
      },
      {
        id: "pwr-lead",
        title: "Lead & hole",
        explanation: "FB/H and puller clear the first threat. Back plants into the crease.",
        coachingPoints: ["Square up the lead", "Ball security through traffic", "Finish north"],
        durationMs: 2000,
        roleProgress: { qb: 0.8, rb: 0.65, fb: 0.75, pull: 0.75, pst: 0.8, y: 0.75 },
      },
      {
        id: "pwr-fin",
        title: "Finish",
        explanation: "Physical second level. No east-west after the hole.",
        coachingPoints: ["Pad level", "Leg drive", "Don't dance"],
        durationMs: 1800,
        roleProgress: { qb: 1, rb: 1, fb: 1, pull: 1, pst: 1, y: 1 },
      },
    ],
  },
  {
    id: "mesh",
    name: "Mesh (Y-Cross)",
    shortName: "Mesh",
    side: "offense",
    formation: "11 personnel · Gun Empty / Trips",
    personnel: "1 RB · 1 TE · 3 WR",
    summary:
      "Two shallow crossers create natural picks and rubs vs man; flood vs zone. QB reads high to low after the mesh.",
    whenToCall: "Vs man pressure and as a rhythm answer on early downs.",
    keys: [
      "Shallows at same depth — don't collide",
      "QB feet in rhythm on the mesh",
      "Backside dig / sit vs zone",
    ],
    relatedPositionIds: ["qb", "wr", "te", "rb"],
    roles: [
      {
        id: "qb",
        tag: "QB",
        label: "Quarterback",
        positionId: "qb",
        path: [
          [50, 58],
          [50, 55],
          [49, 53],
        ],
        job: "3-step / hitch — eyes mesh then dig.",
      },
      {
        id: "y",
        tag: "Y",
        label: "Y shallow",
        positionId: "te",
        path: [
          [68, 52],
          [60, 50],
          [50, 49],
          [40, 48],
          [28, 47],
        ],
        job: "Shallow cross — settle vs zone, run vs man.",
      },
      {
        id: "h",
        tag: "H",
        label: "H shallow",
        positionId: "wr",
        path: [
          [32, 52],
          [40, 50],
          [50, 49],
          [60, 48],
          [72, 47],
        ],
        job: "Opposite shallow — rub timing.",
      },
      {
        id: "x",
        tag: "X",
        label: "X dig",
        positionId: "wr",
        path: [
          [14, 52],
          [18, 42],
          [28, 36],
          [40, 34],
        ],
        job: "Over route / dig behind mesh.",
      },
      {
        id: "z",
        tag: "Z",
        label: "Z clear",
        positionId: "wr",
        path: [
          [86, 52],
          [84, 36],
          [82, 22],
        ],
        job: "Clear-out vertical — occupy safety.",
      },
      {
        id: "rb",
        tag: "RB",
        label: "Running back",
        positionId: "rb",
        path: [
          [46, 62],
          [40, 58],
          [34, 54],
          [28, 52],
        ],
        job: "Check-release — flat/arrow vs blitz.",
      },
    ],
    phases: [
      {
        id: "mesh-snap",
        title: "Snap & stems",
        explanation: "Crossers stem at hip depth. QB gathers — no panic throw.",
        coachingPoints: ["Same depth on shallows", "Avoid collision — stack if needed", "QB base under center of gravity"],
        durationMs: 1500,
        roleProgress: { qb: 0.4, y: 0.25, h: 0.25, x: 0.2, z: 0.3, rb: 0.2 },
      },
      {
        id: "mesh-rub",
        title: "Mesh window",
        explanation: "Natural pick vs man. Vs zone, settle in the hole. QB hits first open.",
        coachingPoints: ["Throw the open lean", "Don't force through traffic", "RB hot vs free runner"],
        durationMs: 1800,
        roleProgress: { qb: 0.75, y: 0.65, h: 0.65, x: 0.55, z: 0.7, rb: 0.55 },
      },
      {
        id: "mesh-fin",
        title: "Progression finish",
        explanation: "If mesh covered, dig/sit. Scramble rules: get vertical landmarks.",
        coachingPoints: ["Eyes downfield on move", "Catch and run — no pirouettes", "Ball security after catch"],
        durationMs: 1800,
        roleProgress: { qb: 1, y: 1, h: 1, x: 1, z: 1, rb: 1 },
      },
    ],
  },
  {
    id: "smash",
    name: "Smash",
    shortName: "Smash",
    side: "offense",
    formation: "11 personnel · Gun Doubles",
    personnel: "1 RB · 1 TE · 3 WR",
    summary:
      "High-low on the corner: hitch/flat underneath with a corner route over the top. Simple, high-percentage concept.",
    whenToCall: "Third-and-medium, red zone half-field, and teaching QB leverage reads.",
    keys: [
      "Corner stem sells dig then breaks",
      "Hitch depth consistent (6–8 yd)",
      "QB eyes corner first, then hitch",
    ],
    relatedPositionIds: ["qb", "wr", "te"],
    roles: [
      {
        id: "qb",
        tag: "QB",
        label: "Quarterback",
        positionId: "qb",
        path: [
          [50, 58],
          [50, 55],
        ],
        job: "Half-field read — corner then hitch.",
      },
      {
        id: "z",
        tag: "Z",
        label: "Corner route",
        positionId: "wr",
        path: [
          [78, 52],
          [76, 40],
          [80, 32],
          [88, 24],
        ],
        job: "Stem vertical/in, break to corner.",
      },
      {
        id: "y",
        tag: "Y",
        label: "Hitch / flat",
        positionId: "te",
        path: [
          [68, 52],
          [70, 48],
          [74, 46],
        ],
        job: "Hitch or arrow — sit under corner.",
      },
      {
        id: "x",
        tag: "X",
        label: "Backside clear",
        positionId: "wr",
        path: [
          [18, 52],
          [16, 36],
          [14, 22],
        ],
        job: "Clear vertical — occupy help.",
      },
      {
        id: "rb",
        tag: "RB",
        label: "Check",
        positionId: "rb",
        path: [
          [46, 62],
          [40, 56],
          [34, 52],
        ],
        job: "Protection first, then flat.",
      },
    ],
    phases: [
      {
        id: "sm-stem",
        title: "Stem",
        explanation: "Corner sells inside stem. Hitch settles on time.",
        coachingPoints: ["Sell the dig", "Hitch on top of numbers", "QB footwork matches timing"],
        durationMs: 1500,
        roleProgress: { qb: 0.5, z: 0.35, y: 0.45, x: 0.35, rb: 0.3 },
      },
      {
        id: "sm-read",
        title: "Read corner",
        explanation: "If corner sinks, throw hitch. If corner squats, throw corner route over.",
        coachingPoints: ["Don't stare down", "Throw on time", "Catch outside shoulder on corner"],
        durationMs: 1800,
        roleProgress: { qb: 0.85, z: 0.75, y: 0.85, x: 0.7, rb: 0.7 },
      },
      {
        id: "sm-fin",
        title: "YAC & finish",
        explanation: "Hitch turns up. Corner catches and toes the boundary.",
        coachingPoints: ["Two feet inbounds", "Secure then run", "Don't force contested if hitch open"],
        durationMs: 1600,
        roleProgress: { qb: 1, z: 1, y: 1, x: 1, rb: 1 },
      },
    ],
  },
  {
    id: "cover3-drop",
    name: "Cover 3 Drop",
    shortName: "C3",
    side: "defense",
    formation: "4-3 Over · Base",
    personnel: "4 DL · 3 LB · 4 DB",
    summary:
      "Three-deep, four-under zone. Corners deep thirds, free safety middle third, underneath match rules.",
    whenToCall: "Base coverage vs spread; teach landmark drops and seam rules.",
    keys: [
      "Corners: depth over leverage early",
      "MLB: hook-to-curl landmark",
      "Safeties: no freelancing middle third",
    ],
    relatedPositionIds: ["db", "lb", "dl"],
    roles: [
      {
        id: "cb-l",
        tag: "CB",
        label: "Left corner",
        positionId: "db",
        path: [
          [18, 48],
          [16, 40],
          [14, 28],
          [14, 18],
        ],
        job: "Deep outside third — stay on top.",
      },
      {
        id: "cb-r",
        tag: "CB",
        label: "Right corner",
        positionId: "db",
        path: [
          [82, 48],
          [84, 40],
          [86, 28],
          [86, 18],
        ],
        job: "Deep outside third — stay on top.",
      },
      {
        id: "fs",
        tag: "FS",
        label: "Free safety",
        positionId: "db",
        path: [
          [50, 36],
          [50, 28],
          [50, 18],
        ],
        job: "Middle third — split #2s, help seams.",
      },
      {
        id: "mike",
        tag: "M",
        label: "Mike LB",
        positionId: "lb",
        path: [
          [50, 48],
          [50, 44],
          [48, 40],
        ],
        job: "Hook/curl — expand to #2 threat.",
      },
      {
        id: "will",
        tag: "W",
        label: "Will LB",
        positionId: "lb",
        path: [
          [38, 48],
          [34, 44],
          [30, 40],
        ],
        job: "Curl/flat — match release rules.",
      },
      {
        id: "sam",
        tag: "S",
        label: "Sam LB",
        positionId: "lb",
        path: [
          [62, 48],
          [66, 44],
          [70, 40],
        ],
        job: "Curl/flat opposite.",
      },
      {
        id: "de",
        tag: "E",
        label: "Defensive end",
        positionId: "dl",
        path: [
          [68, 50],
          [66, 52],
          [64, 54],
        ],
        job: "Contain rush — no upfield freestyle.",
      },
    ],
    phases: [
      {
        id: "c3-align",
        title: "Align & keys",
        explanation: "Pre-snap landmarks. Corners outside shade; FS deep enough to split.",
        coachingPoints: ["Know your third", "Don't bite flats early", "DL gap integrity"],
        durationMs: 1400,
        roleProgress: { "cb-l": 0.15, "cb-r": 0.15, fs: 0.15, mike: 0.15, will: 0.15, sam: 0.15, de: 0.2 },
      },
      {
        id: "c3-drop",
        title: "Drop & match",
        explanation: "On snap, drop to landmarks. Match receivers entering your zone — vision QB.",
        coachingPoints: ["Backpedal then open", "Hands ready in windows", "Communicate diggers"],
        durationMs: 1800,
        roleProgress: { "cb-l": 0.6, "cb-r": 0.6, fs: 0.55, mike: 0.55, will: 0.55, sam: 0.55, de: 0.6 },
      },
      {
        id: "c3-break",
        title: "Break on throw",
        explanation: "When QB commits, drive on the ball. Underneath take away YAC.",
        coachingPoints: ["Break downhill", "Don't collide teammates", "Secure tackle after INT attempt"],
        durationMs: 1800,
        roleProgress: { "cb-l": 1, "cb-r": 1, fs: 1, mike: 1, will: 1, sam: 1, de: 1 },
      },
    ],
  },
];

export function getPlayById(id: string): Play | undefined {
  return plays.find((p) => p.id === id);
}

export function getPlaysBySide(side: PlaySide): Play[] {
  return plays.filter((p) => p.side === side);
}
