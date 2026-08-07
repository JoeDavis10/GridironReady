/**
 * Block physics — grab-driven displacement + ball tracking.
 *
 * Grab model (primary):
 * - Assigned engagers "grab" a defender once within latch range
 * - After latch, the defender is ATTACHED to the blocker(s)
 * - Blocker movement drives the defender (offset follows drive angle)
 * - Hitboxes are secondary (light D↔D separation + visual only)
 *
 * Free defenders (paced):
 * - Play-read window before pursuit ramps
 * - Max distance per step + cumulative travel budget
 * - Assigned D hold gap until grab (do not all crash the ball)
 * - After read: slow fit lines toward the football by level
 */
import {
  pointAlongPath,
  type FieldPoint,
  type Play,
} from "@/data/plays";
import {
  classifyDefender,
  type LookDefender,
  type DefLevel,
} from "@/data/play-looks";

export type Vec = { x: number; y: number };

export interface ContactSample {
  offenseId: string;
  defenseId: string;
  mid: FieldPoint;
  force: number;
  double: boolean;
}

export interface DefenseSample {
  id: string;
  pos: FieldPoint;
  pressure: number;
  double: boolean;
  /** 0–1 drive progress while grabbed */
  driveT: number;
  /** True when a blocker has latched */
  grabbed: boolean;
}

export interface PhysicsFrame {
  defense: DefenseSample[];
  contacts: ContactSample[];
  /** Live ball location for tracking / overlay */
  ball: FieldPoint;
  /** Active grab pairs */
  grabs: { offenseId: string; defenseId: string }[];
}

const FIELD_MIN = 6;
const FIELD_MAX = 94;

/** Visual / light-separation radii only — not the grab driver */
export const HITBOX = {
  ol: 1.4,
  skill: 1.15,
  dl: 1.5,
  lb: 1.25,
  db: 1.1,
} as const;

/**
 * Latch grab only at true contact — blocker must close to pad distance.
 * (~ sum of OL+DL radii + tiny slack). No long-range "magnet" grabs.
 */
const GRAB_LATCH = 2.7;
/** Pad standoff once attached (blocker chest → defender pads) */
const GRAB_PAD = 2.15;
/** Blocker must leave their snap mark at least this far before latching */
const GRAB_MIN_BLOCKER_MOVE = 1.15;
/** Second man on a double must also be this close to join the grab */
const GRAB_DOUBLE_LATCH = 3.0;
/**
 * Once latched, grab is sticky for the rest of the play while holders exist.
 * Only hard-break if every holder is gone (no distance-based release — that
 * caused slide-off + snap-back when lag accumulated).
 */
const GRAB_HARD_BREAK = 14;

export function hitboxOffense(roleId: string): number {
  const id = roleId.toLowerCase();
  if (["lt", "lg", "c", "rg", "rt"].includes(id)) return HITBOX.ol;
  return HITBOX.skill;
}

export function hitboxDefense(level: DefLevel): number {
  if (level === "dl") return HITBOX.dl;
  if (level === "lb") return HITBOX.lb;
  return HITBOX.db;
}

export function minSeparation(rA: number, rB: number): number {
  return rA + rB + 0.3;
}

function v(x: number, y: number): Vec {
  return { x, y };
}
function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}
function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}
function scale(a: Vec, s: number): Vec {
  return { x: a.x * s, y: a.y * s };
}
function len(a: Vec): number {
  return Math.hypot(a.x, a.y);
}
function norm(a: Vec): Vec {
  const l = len(a);
  if (l < 1e-6) return v(0, 0);
  return scale(a, 1 / l);
}
function lerp(a: Vec, b: Vec, t: number): Vec {
  return v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
}
function clampField(p: Vec): Vec {
  return {
    x: Math.min(FIELD_MAX, Math.max(FIELD_MIN, p.x)),
    y: Math.min(FIELD_MAX, Math.max(FIELD_MIN, p.y)),
  };
}
function clampMag(vec: Vec, max: number): Vec {
  const l = len(vec);
  if (l <= max || l < 1e-6) return vec;
  return scale(vec, max / l);
}
function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / Math.max(1e-6, b - a)));
  return t * t * (3 - 2 * t);
}

function massFor(level: DefLevel): number {
  if (level === "dl") return 1.5;
  if (level === "lb") return 1.05;
  return 0.95;
}

/**
 * Free D pace — yards per physics step (~20ms).
 * These are hard caps so free defenders cannot teleport to the ball.
 */
function maxStepFree(level: DefLevel): number {
  if (level === "dl") return 0.11;
  if (level === "lb") return 0.14;
  return 0.12;
}

/** Max distance from alignment while free (gap integrity / contain). */
function maxFromHomeFree(level: DefLevel): number {
  if (level === "dl") return 4.5;
  if (level === "lb") return 7.5;
  return 6.5;
}

/** Cumulative path budget while free (prevents marathon sprints). */
function maxTravelFree(level: DefLevel): number {
  if (level === "dl") return 6;
  if (level === "lb") return 9;
  return 8;
}

/** Play-read window in ms before pursuit ramps (keys, not chase). */
function readMs(level: DefLevel): number {
  if (level === "dl") return 280; // get-off / first step
  if (level === "lb") return 480; // LB read mesh / flow
  return 620; // DB patience
}

/** Full-pursuit unlock after this many ms into the play */
function pursueFullMs(level: DefLevel): number {
  if (level === "dl") return 900;
  if (level === "lb") return 1200;
  return 1500;
}

function freeSpeed(level: DefLevel): number {
  // Soft cap below maxStep so integration stays stable
  return maxStepFree(level) * 0.95;
}

function grabSpeed(level: DefLevel, double: boolean): number {
  // Attached: still limited — ride blocker, not warp
  if (level === "dl") return double ? 0.38 : 0.3;
  if (level === "lb") return 0.34;
  return 0.28;
}

function baseAlign(def: LookDefender): Vec {
  const p = def.path[0] ?? def.drivePath?.[0] ?? [50, 48];
  return v(p[0], p[1]);
}

function driveDir(def: LookDefender): Vec {
  const path = def.drivePath ?? def.path;
  if (path.length < 2) return v(0, -1);
  const a = path[0]!;
  const b = path[path.length - 1]!;
  return norm(v(b[0] - a[0], b[1] - a[1]));
}

/** Global 0–1 progress across entire play. */
export function globalPlayProgress(
  play: Play,
  phaseIndex: number,
  phaseProgress: number,
): number {
  let total = 0;
  for (const ph of play.phases) total += Math.max(1, ph.durationMs);
  if (total <= 0) return 0;
  let done = 0;
  for (let i = 0; i < phaseIndex; i++) {
    done += Math.max(1, play.phases[i]?.durationMs ?? 0);
  }
  const cur = Math.max(1, play.phases[phaseIndex]?.durationMs ?? 1600);
  done += Math.max(0, Math.min(1, phaseProgress)) * cur;
  return Math.min(1, done / total);
}

export function globalPlayMs(
  play: Play,
  phaseIndex: number,
  phaseProgress: number,
): number {
  let done = 0;
  for (let i = 0; i < phaseIndex; i++) {
    done += Math.max(1, play.phases[i]?.durationMs ?? 0);
  }
  const cur = Math.max(1, play.phases[phaseIndex]?.durationMs ?? 1600);
  done += Math.max(0, Math.min(1, phaseProgress)) * cur;
  return done;
}

export function totalPlayMs(play: Play): number {
  let total = 0;
  for (const ph of play.phases) total += Math.max(1, ph.durationMs);
  return Math.max(1, total);
}

function offensePosAtGlobal(
  play: Play,
  globalT: number,
): { id: string; pos: Vec; vel: Vec }[] {
  const t = Math.min(1, Math.max(0, globalT));
  const eased =
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const t2 = Math.min(1, eased + 0.018);
  return play.roles.map((role) => {
    const p1 = pointAlongPath(role.path, eased);
    const p2 = pointAlongPath(role.path, t2);
    const pos = v(p1[0], p1[1]);
    const vel = scale(sub(v(p2[0], p2[1]), pos), 32);
    return { id: role.id, pos, vel };
  });
}

/**
 * Live ball: early on QB, transitions to RB through handoff window.
 * Falls back sensibly for weird personnel.
 */
export function ballAt(
  offense: { id: string; pos: Vec; vel: Vec }[],
  globalT: number,
): { pos: Vec; vel: Vec; carrier: string } {
  const byId = new Map(offense.map((o) => [o.id, o]));
  const qb = byId.get("qb");
  const rb = byId.get("rb");
  const fb = byId.get("fb");
  const handoff = smoothstep(0.1, 0.32, globalT);

  if (qb && rb) {
    return {
      pos: lerp(qb.pos, rb.pos, handoff),
      vel: lerp(qb.vel, rb.vel, handoff),
      carrier: handoff > 0.55 ? "rb" : "qb",
    };
  }
  if (rb) return { pos: rb.pos, vel: rb.vel, carrier: "rb" };
  if (fb) return { pos: fb.pos, vel: fb.vel, carrier: "fb" };
  if (qb) return { pos: qb.pos, vel: qb.vel, carrier: "qb" };
  const first = offense[0] ?? { id: "?", pos: v(50, 56), vel: v(0, 0) };
  return { pos: first.pos, vel: first.vel, carrier: first.id };
}

type GrabState = {
  /** Latched offense ids (1–2 for double) */
  holders: string[];
  /** Defender position relative to holder centroid */
  offset: Vec;
  /** Drive progress 0–1 after latch */
  driveT: number;
};

type DBody = {
  def: LookDefender;
  home: Vec;
  pos: Vec;
  vel: Vec;
  mass: number;
  level: DefLevel;
  pressure: number;
  grab: GrabState | null;
  driveAxis: Vec;
  /** Furthest downfield (smallest y) while grabbed — prevents bounce-back */
  minY: number;
  /** Cumulative free travel distance (pace budget) */
  travelFree: number;
  /**
   * Free-play anchor. Starts at alignment; while grabbed it tracks the
   * driven position so a release never yanks the D back to the snap mark.
   */
  freeAnchor: Vec;
};

export function sampleBlockPhysics(
  play: Play,
  phaseIndex: number,
  phaseProgress: number,
): PhysicsFrame {
  const look = play.look ?? [];
  if (!look.length || play.side !== "offense") {
    return {
      defense: [],
      contacts: [],
      ball: [50, 56],
      grabs: [],
    };
  }

  const globalT = globalPlayProgress(play, phaseIndex, phaseProgress);
  const targetMs = globalPlayMs(play, phaseIndex, phaseProgress);
  const totalMs = totalPlayMs(play);

  const dt = 20;
  const steps = Math.max(1, Math.ceil(targetMs / dt));

  const bodies: DBody[] = look.map((def) => {
    const level = classifyDefender(def);
    const home = baseAlign(def);
    return {
      def,
      home,
      pos: { ...home },
      vel: v(0, 0),
      mass: massFor(level),
      level,
      pressure: 0,
      grab: null,
      driveAxis: driveDir(def),
      minY: home.y,
      travelFree: 0,
      freeAnchor: { ...home },
    };
  });

  /** Snap landmarks so grab requires the blocker to actually fire out */
  const oSnap = new Map<string, Vec>();
  for (const role of play.roles) {
    const p = role.path[0];
    if (p) oSnap.set(role.id, v(p[0], p[1]));
  }

  let lastBall = v(50, 56);

  for (let step = 0; step < steps; step++) {
    const tMs = Math.min(targetMs, (step + 1) * dt);
    const gT = Math.min(1, tMs / totalMs);
    const offense = offensePosAtGlobal(play, gT);
    const byId = new Map(offense.map((o) => [o.id, o]));
    const ball = ballAt(offense, gT);
    lastBall = ball.pos;

    // Flow of OL for scrape keys
    let olCx = 0;
    let olN = 0;
    for (const id of ["lt", "lg", "c", "rg", "rt"]) {
      const o = byId.get(id);
      if (o) {
        olCx += o.pos.x;
        olN++;
      }
    }
    const flowX = olN > 0 ? olCx / olN : ball.pos.x;

    for (const body of bodies) {
      body.pressure *= 0.88;
      const assigned = body.def.engagedBy
        .map((id) => byId.get(id))
        .filter(Boolean) as { id: string; pos: Vec; vel: Vec }[];

      // --- Grab latch (close contact only + blocker has fired out) ---
      if (!body.grab && assigned.length > 0) {
        const near = assigned
          .map((o) => {
            const d = len(sub(o.pos, body.pos));
            const snap = oSnap.get(o.id);
            const moved = snap
              ? len(sub(o.pos, snap)) >= GRAB_MIN_BLOCKER_MOVE
              : gT > 0.06;
            return { o, d, moved };
          })
          .filter((x) => x.d <= GRAB_LATCH && x.moved)
          .sort((a, b) => a.d - b.d);
        if (near.length > 0) {
          const holders = [near[0]!.o.id];
          if (
            (body.def.doubleTeam || assigned.length >= 2) &&
            near[1] &&
            near[1].d <= GRAB_DOUBLE_LATCH &&
            near[1].moved
          ) {
            holders.push(near[1].o.id);
          }
          const center = holders.reduce(
            (acc, id) => add(acc, byId.get(id)!.pos),
            v(0, 0),
          );
          const c = scale(center, 1 / holders.length);
          let off = sub(body.pos, c);
          if (len(off) < 0.4) off = scale(body.driveAxis, GRAB_PAD);
          else off = scale(norm(off), GRAB_PAD);
          off = lerp(off, scale(body.driveAxis, GRAB_PAD), 0.55);
          body.grab = { holders, offset: off, driveT: 0 };
          body.pressure = 0.55;
        }
      }

      if (body.grab) {
        // Prefer currently assigned engagers that are still holders; allow
        // re-bind to any assigned OL still near if original list went empty.
        let live = body.grab.holders
          .map((id) => byId.get(id))
          .filter(Boolean) as { id: string; pos: Vec; vel: Vec }[];

        if (live.length === 0 && assigned.length > 0) {
          // Re-bind to nearest assigned rather than releasing to home
          const sorted = assigned
            .slice()
            .sort((a, b) => len(sub(a.pos, body.pos)) - len(sub(b.pos, body.pos)));
          body.grab.holders = [sorted[0]!.id];
          if (
            sorted[1] &&
            (body.def.doubleTeam || assigned.length >= 2) &&
            len(sub(sorted[1].pos, body.pos)) <= GRAB_DOUBLE_LATCH + 1
          ) {
            body.grab.holders.push(sorted[1].id);
          }
          live = body.grab.holders
            .map((id) => byId.get(id))
            .filter(Boolean) as { id: string; pos: Vec; vel: Vec }[];
        }

        if (live.length === 0) {
          // True release: keep displaced freeAnchor (no snap-back to snap mark)
          body.grab = null;
          body.vel = scale(body.vel, 0.4);
        } else {
          // Join second man if he arrives on the double
          for (const o of assigned) {
            if (
              !body.grab.holders.includes(o.id) &&
              body.grab.holders.length < 2 &&
              len(sub(o.pos, body.pos)) <= GRAB_DOUBLE_LATCH
            ) {
              body.grab.holders.push(o.id);
              live = body.grab.holders
                .map((id) => byId.get(id))
                .filter(Boolean) as { id: string; pos: Vec; vel: Vec }[];
            }
          }

          const isDouble = live.length >= 2 || Boolean(body.def.doubleTeam);
          const center = scale(
            live.reduce((a, o) => add(a, o.pos), v(0, 0)),
            1 / live.length,
          );
          const avgVel = scale(
            live.reduce((a, o) => add(a, o.vel), v(0, 0)),
            1 / live.length,
          );

          const driveBoost = isDouble ? 1.2 : 1;
          body.grab.driveT = Math.min(
            1,
            body.grab.driveT + (dt / totalMs) * driveBoost * 1.25,
          );

          // Offset eases along drive axis — defender stays on the blocker's pads
          const padLen = GRAB_PAD + body.grab.driveT * 1.4;
          const desiredOff = scale(body.driveAxis, padLen);
          body.grab.offset = lerp(
            body.grab.offset,
            desiredOff,
            isDouble ? 0.22 : 0.16,
          );

          // KINEMATIC attach: position IS center + offset every tick.
          // Blocker movement inherently updates defender — no lag slip-off.
          let target = add(center, body.grab.offset);
          // Ratchet: never move back toward the LOS once driven
          body.minY = Math.min(body.minY, target.y, body.pos.y);
          if (target.y > body.minY + 0.35) {
            target = v(target.x, body.minY + 0.35);
            // Keep offset consistent with seated y
            body.grab.offset = sub(target, center);
          }

          // Hard re-seat if somehow separated (never drop the grab for distance)
          if (len(sub(body.pos, center)) > GRAB_HARD_BREAK) {
            body.grab.offset = scale(body.driveAxis, GRAB_PAD);
            target = add(center, body.grab.offset);
          }

          const prev = { x: body.pos.x, y: body.pos.y };
          body.pos = clampField(target);
          // Velocity tracks blockers so contacts/render stay smooth
          body.vel = add(
            scale(avgVel, 0.85),
            scale(sub(body.pos, prev), 0.4),
          );
          body.vel = clampMag(body.vel, grabSpeed(body.level, isDouble) * 1.4);

          // Displaced free anchor = current driven seat (prevents home snap)
          body.freeAnchor = { x: body.pos.x, y: body.pos.y };
          body.pressure = Math.min(
            1,
            0.55 + body.grab.driveT * 0.4 + (isDouble ? 0.15 : 0),
          );
          continue;
        }
      }

      // ===== FREE: paced lines + play-read, then limited ball key =====
      const before = { x: body.pos.x, y: body.pos.y };
      const force = freePaceForce(
        body,
        ball.pos,
        ball.vel,
        flowX,
        gT,
        tMs,
        assigned,
      );
      const accel = scale(force, 1 / body.mass);
      body.vel = add(scale(body.vel, 0.78), accel);
      body.vel = clampMag(body.vel, freeSpeed(body.level));
      let next = add(body.pos, body.vel);

      // Hard per-step distance cap ("max distance per click")
      const stepCap = maxStepFree(body.level);
      const stepDelta = sub(next, before);
      const stepLen = len(stepDelta);
      if (stepLen > stepCap && stepLen > 1e-6) {
        next = add(before, scale(stepDelta, stepCap / stepLen));
        body.vel = scale(norm(stepDelta), stepCap);
      }

      // Cumulative free-travel budget
      const used = len(sub(next, before));
      const budget = maxTravelFree(body.level) - body.travelFree;
      if (used > budget && budget >= 0) {
        if (budget < 1e-4) {
          next = { ...before };
          body.vel = v(0, 0);
        } else {
          next = add(before, scale(norm(sub(next, before)), budget));
          body.vel = scale(norm(sub(next, before)), budget);
        }
      }
      body.travelFree += len(sub(next, before));

      // Alignment leash from freeAnchor (displaced if previously blocked)
      const leash = maxFromHomeFree(body.level);
      const anchorDelta = sub(next, body.freeAnchor);
      if (len(anchorDelta) > leash) {
        next = add(body.freeAnchor, scale(norm(anchorDelta), leash));
        body.vel = scale(body.vel, 0.35);
      }
      // Soft drift of freeAnchor so post-block pursuit stays local
      body.freeAnchor = lerp(body.freeAnchor, next, 0.08);

      body.pos = clampField(next);
    }

    // Light D↔D separation only (not grab driver)
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i]!;
        const b = bodies[j]!;
        // Grabbed pairs still separate slightly so doubles don't stack
        const minD =
          minSeparation(hitboxDefense(a.level), hitboxDefense(b.level)) * 0.85;
        const delta = sub(b.pos, a.pos);
        const d = len(delta);
        if (d >= minD || d < 1e-4) continue;
        const n = scale(delta, 1 / d);
        const pen = (minD - d) * 0.35;
        const invA = 1 / a.mass;
        const invB = 1 / b.mass;
        const invSum = invA + invB;
        // Don't yank grabbed bodies off their attachment much
        const aScale = a.grab ? 0.25 : 1;
        const bScale = b.grab ? 0.25 : 1;
        a.pos = clampField(
          sub(a.pos, scale(n, pen * (invA / invSum) * aScale)),
        );
        b.pos = clampField(
          add(b.pos, scale(n, pen * (invB / invSum) * bScale)),
        );
      }
    }
  }

  const offense = offensePosAtGlobal(play, globalT);
  const byId = new Map(offense.map((o) => [o.id, o]));
  const ball = ballAt(offense, globalT);
  const contacts: ContactSample[] = [];
  const grabs: { offenseId: string; defenseId: string }[] = [];

  const defense: DefenseSample[] = bodies.map((body) => {
    if (body.grab) {
      for (const oid of body.grab.holders) {
        grabs.push({ offenseId: oid, defenseId: body.def.id });
        const o = byId.get(oid);
        if (!o) continue;
        contacts.push({
          offenseId: oid,
          defenseId: body.def.id,
          mid: [(o.pos.x + body.pos.x) / 2, (o.pos.y + body.pos.y) / 2],
          force: Math.min(1, 0.55 + body.pressure * 0.45),
          double:
            body.grab.holders.length >= 2 || Boolean(body.def.doubleTeam),
        });
      }
    }
    return {
      id: body.def.id,
      pos: [body.pos.x, body.pos.y],
      pressure: body.pressure,
      double: Boolean(body.def.doubleTeam) || (body.grab?.holders.length ?? 0) >= 2,
      driveT: body.grab?.driveT ?? 0,
      grabbed: Boolean(body.grab),
    };
  });

  return {
    defense,
    contacts,
    ball: [ball.pos.x, ball.pos.y],
    grabs,
  };
}

/**
 * Free-player pace forces.
 * - Play-read window: keys only (no full pursuit)
 * - Assigned & unblocked: hold gap / await contact (not chase ball)
 * - After read: limited track on a slow fit line toward the ball
 */
function freePaceForce(
  body: DBody,
  ball: Vec,
  ballVel: Vec,
  flowX: number,
  gT: number,
  tMs: number,
  assigned: { id: string; pos: Vec; vel: Vec }[],
): Vec {
  const r0 = readMs(body.level);
  const r1 = pursueFullMs(body.level);
  // 0 during pure read → 1 when full pursue allowed
  const pursue = smoothstep(r0, r1, tMs);

  // --- Assigned but not yet grabbed: stay on contact path, don't chase ball ---
  if (assigned.length > 0) {
    const nearest = assigned
      .slice()
      .sort((a, b) => len(sub(a.pos, body.pos)) - len(sub(b.pos, body.pos)))[0]!;
    const toOl = sub(nearest.pos, body.pos);
    const d = len(toOl);
    // Slow get-off along drive axis + inch toward assigned OL
    const getOff = scale(body.driveAxis, body.level === "dl" ? 0.035 : 0.02);
    const meet = d > 0.5 ? scale(toOl, 0.04) : v(0, 0);
    // Tiny flow peek after half-read
    const peek = scale(v(flowX - body.pos.x, 0), 0.01 * pursue);
    return add(add(getOff, meet), peek);
  }

  const toBall = sub(ball, body.pos);
  const dist = len(toBall);
  const dir = dist > 1e-4 ? scale(toBall, 1 / dist) : v(0, -1);
  // Pace-line landmark: mix home (gap) with a delayed ball fit point
  const fitT = pursue * pursue; // ease into fit
  const lead = add(ball, scale(ballVel, 0.04 * fitT));

  if (body.level === "dl") {
    // Read: vertical get-off only. Later: short gap slide toward ball side.
    const getOff = v(0, -0.04);
    const gapX = body.home.x * (1 - 0.35 * fitT) + lead.x * (0.35 * fitT);
    const gap = v((gapX - body.pos.x) * 0.03, 0);
    // Pursuit only after read, and only a few yards
    const chase =
      fitT > 0.05 && dist < 14
        ? scale(dir, 0.025 * fitT)
        : v(0, 0);
    return add(add(getOff, gap), chase);
  }

  if (body.level === "lb") {
    // Hold near freeAnchor (may be post-block displaced), not snap mark
    const ax = body.freeAnchor.x;
    const ay = body.freeAnchor.y;
    const hold = v(
      (ax - body.pos.x) * 0.04,
      (ay - 0.3 - body.pos.y) * 0.035,
    );
    // Scrape to flow first, ball second (coaching order)
    const scrapeTarget = ax * (1 - 0.5 * fitT) + flowX * 0.25 * fitT + lead.x * 0.25 * fitT;
    const scrape = v((scrapeTarget - body.pos.x) * (0.03 + 0.04 * fitT), 0);
    // Downhill only after read and only if ball is past LOS threat
    const ballThreat = ball.y < body.home.y + 6 || fitT > 0.4;
    const downhill =
      ballThreat && fitT > 0.15
        ? v(0, (Math.min(lead.y + 3, ay + 1.5) - body.pos.y) * 0.03 * fitT)
        : v(0, 0);
    const close =
      fitT > 0.35 && dist < 12 ? scale(dir, 0.03 * fitT) : v(0, 0);
    return add(add(add(hold, scrape), downhill), close);
  }

  // DB: patience — depth first, angle late
  const depthTarget = body.home.y - 0.5 * fitT;
  const depth = v(0, (depthTarget - body.pos.y) * 0.04);
  const leverage = body.home.x < 50 ? -1 : 1;
  // Mirror slowly; stay near home x during read
  const mirrorX =
    body.home.x * (1 - 0.4 * fitT) + (lead.x + leverage * 4) * (0.4 * fitT);
  const lat = v((mirrorX - body.pos.x) * (0.02 + 0.03 * fitT), 0);
  const angle =
    fitT > 0.25 && dist < 28 ? scale(toBall, 0.015 * fitT) : v(0, 0);
  // Never crash the box early
  const noCrash =
    body.home.y < 42 && body.pos.y > body.home.y + 3
      ? v(0, (body.home.y + 1 - body.pos.y) * 0.05)
      : v(0, 0);
  return add(add(add(depth, lat), angle), noCrash);
}

export function physicsCacheKey(
  playId: string,
  phaseIndex: number,
  progress: number,
): string {
  const q = Math.round(progress * 40) / 40;
  return `${playId}:${phaseIndex}:${q}`;
}
