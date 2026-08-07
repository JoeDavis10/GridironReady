/**
 * Deterministic block-physics for defensive looks.
 *
 * Drive-path model:
 * - Engaged defenders are displaced along their GOD drivePath (desired drive angle)
 * - Contact timing is gated by distance to engagers
 * - All motion samples against the same global play timeline
 * - LBs scrape on flow; no teleport onto the RB
 * - Nickel/DB never treated as DL (classifyDefender)
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
  /** 0–1 progress along drive path */
  driveT: number;
}

export interface PhysicsFrame {
  defense: DefenseSample[];
  contacts: ContactSample[];
}

const FIELD_MIN = 6;
const FIELD_MAX = 94;

/**
 * Fixed hitboxes in FIELD UNITS (≈ yards near LOS).
 * These NEVER scale with diagram zoom or bubble-size UI.
 * Visual markers may grow; collision math stays constant.
 */
export const HITBOX = {
  /** Offensive lineman */
  ol: 1.4,
  /** Skill (RB/FB/WR/TE/QB) */
  skill: 1.15,
  /** Down lineman */
  dl: 1.5,
  /** Linebacker */
  lb: 1.25,
  /** Secondary */
  db: 1.1,
} as const;

/** Soft shell outside the solid hitbox (contact cushion) */
const SHELL = 0.35;
/** Engage when centers closer than sum(radii) + this */
const ENGAGE_SLACK = 7.5;
/** Draw/contact line threshold beyond sum of radii */
const CONTACT_PAD = 3.2;
/** Soft collision stiffness (lower = less bounce) */
const COLLIDE_K = 0.22;
/** Velocity damping along collision normal */
const COLLIDE_DAMP = 0.55;

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

/** Minimum center-to-center distance (solid + shell) */
export function minSeparation(rA: number, rB: number): number {
  return rA + rB + SHELL;
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

function massFor(level: DefLevel): number {
  if (level === "dl") return 1.45;
  if (level === "lb") return 1.05;
  return 0.95;
}

function maxSpeed(level: DefLevel, engaged: boolean): number {
  if (level === "dl") return engaged ? 0.62 : 0.32;
  if (level === "lb") return engaged ? 0.7 : 0.5;
  return 0.4;
}

function baseAlign(def: LookDefender): Vec {
  const p = def.path[0] ?? def.drivePath?.[0] ?? [50, 48];
  return v(p[0], p[1]);
}

function drivePoint(def: LookDefender, t: number): Vec {
  const path = def.drivePath ?? def.path;
  const p = pointAlongPath(path, Math.min(1, Math.max(0, t)));
  return v(p[0], p[1]);
}

/** Global 0–1 progress across entire play (all phases same clock). */
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
  // Everyone rides their full path 0→1 over the same global duration
  const t = Math.min(1, Math.max(0, globalT));
  const eased =
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const t2 = Math.min(1, eased + 0.02);
  return play.roles.map((role) => {
    const p1 = pointAlongPath(role.path, eased);
    const p2 = pointAlongPath(role.path, t2);
    const pos = v(p1[0], p1[1]);
    const vel = scale(sub(v(p2[0], p2[1]), pos), 30);
    return { id: role.id, pos, vel };
  });
}

export function sampleBlockPhysics(
  play: Play,
  phaseIndex: number,
  phaseProgress: number,
): PhysicsFrame {
  const look = play.look ?? [];
  if (!look.length || play.side !== "offense") {
    return { defense: [], contacts: [] };
  }

  const globalT = globalPlayProgress(play, phaseIndex, phaseProgress);
  const targetMs = globalPlayMs(play, phaseIndex, phaseProgress);
  const totalMs = totalPlayMs(play);

  const dt = 22;
  const steps = Math.max(1, Math.ceil(targetMs / dt));

  type DBody = {
    def: LookDefender;
    home: Vec;
    pos: Vec;
    vel: Vec;
    mass: number;
    level: DefLevel;
    pressure: number;
    driveT: number;
  };

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
      driveT: 0,
    };
  });

  for (let step = 0; step < steps; step++) {
    const tMs = Math.min(targetMs, (step + 1) * dt);
    const gT = Math.min(1, tMs / totalMs);
    const offense = offensePosAtGlobal(play, gT);
    const byId = new Map(offense.map((o) => [o.id, o]));

    const ball =
      byId.get("rb") ?? byId.get("fb") ?? byId.get("qb") ?? offense[0]!;

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
      body.pressure *= 0.9;

      const myR = hitboxDefense(body.level);
      const nearEngagers = body.def.engagedBy
        .map((id) => {
          const o = byId.get(id);
          if (!o) return null;
          const d = len(sub(o.pos, body.pos));
          const need = minSeparation(myR, hitboxOffense(id)) + ENGAGE_SLACK;
          return d <= need ? { ...o, dist: d, r: hitboxOffense(id) } : null;
        })
        .filter(Boolean) as {
        id: string;
        pos: Vec;
        vel: Vec;
        dist: number;
        r: number;
      }[];

      let force = v(0, 0);
      const engaged = nearEngagers.length > 0;
      const isDouble =
        nearEngagers.length >= 2 || Boolean(body.def.doubleTeam);

      // Drive-path progress: rises with global time once contact is live,
      // and slowly with global time even pre-contact so motion lasts full play
      const preDrive = gT * 0.12;
      if (engaged) {
        const engageBoost = isDouble ? 1.15 : 0.95;
        // Advance drive along the path for the rest of the play after first contact
        body.driveT = Math.min(
          1,
          Math.max(body.driveT, preDrive) + (dt / totalMs) * engageBoost * 1.35,
        );
      } else {
        body.driveT = Math.min(1, Math.max(body.driveT, preDrive));
      }

      const driveTarget = drivePoint(body.def, body.driveT);

      if (engaged) {
        let center = v(0, 0);
        let avgVel = v(0, 0);
        for (const e of nearEngagers) {
          center = add(center, e.pos);
          avgVel = add(avgVel, e.vel);
        }
        center = scale(center, 1 / nearEngagers.length);
        avgVel = scale(avgVel, 1 / nearEngagers.length);
        const dist = len(sub(center, body.pos));

        // Primary: slide along drive path (desired drive angle)
        const toDrive = sub(driveTarget, body.pos);
        force = add(force, scale(toDrive, body.level === "dl" ? 0.28 : 0.2));

        // Secondary: stay on pads relative to OL (contact integrity)
        // Fixed pad standoff = sum of hitboxes (zoom-independent)
        const avgOR =
          nearEngagers.reduce((s, e) => s + e.r, 0) / nearEngagers.length;
        const padDist = minSeparation(myR, avgOR);
        const engageMax = padDist + ENGAGE_SLACK;

        if (body.level === "dl") {
          const pad = add(center, v(0, -(padDist * 0.85)));
          force = add(force, scale(sub(pad, body.pos), isDouble ? 0.12 : 0.09));
          force = add(force, scale(avgVel, isDouble ? 0.07 : 0.045));
          // Soft keep-out: only push when overlapping solid hitboxes
          if (dist < padDist && dist > 1e-4) {
            const pen = padDist - dist;
            force = add(
              force,
              scale(norm(sub(body.pos, center)), pen * COLLIDE_K * 1.1),
            );
          }
          body.pressure = Math.min(
            1,
            body.pressure +
              (isDouble ? 0.2 : 0.12) * Math.max(0, 1 - dist / engageMax),
          );
        } else if (body.level === "lb") {
          const approach = norm(sub(center, body.home));
          const meet = sub(center, scale(approach, padDist));
          force = add(force, scale(sub(meet, body.pos), 0.1));
          force = add(force, scale(toDrive, 0.08));
          if (dist < padDist + 2) {
            force = add(force, scale(avgVel, 0.035));
            if (dist < padDist && dist > 1e-4) {
              const pen = padDist - dist;
              force = add(
                force,
                scale(norm(sub(body.pos, center)), pen * COLLIDE_K),
              );
            }
            body.pressure = Math.min(1, body.pressure + 0.14);
          }
        } else {
          force = add(force, scale(toDrive, 0.1));
          force = add(
            force,
            scale(
              sub(add(center, v(center.x < 50 ? -2 : 2, -1.2)), body.pos),
              0.06,
            ),
          );
          if (dist < padDist && dist > 1e-4) {
            force = add(
              force,
              scale(norm(sub(body.pos, center)), (padDist - dist) * COLLIDE_K * 0.8),
            );
          }
          body.pressure = Math.min(1, body.pressure + 0.06);
        }
      } else if (body.level === "dl") {
        // Pre-snap / unengaged: ease toward early drive path + vertical get-off
        force = add(force, scale(sub(driveTarget, body.pos), 0.1));
        force = add(force, v(0, -0.035));
        force = add(force, v((body.home.x - body.pos.x) * 0.025, 0));
      } else if (body.level === "lb") {
        const lateral = (flowX - body.pos.x) * 0.05;
        const depthTarget = body.home.y - 1.0 - gT * 1.2;
        force = add(force, v(lateral + (ball.pos.x - body.pos.x) * 0.018, (depthTarget - body.pos.y) * 0.035));
        force = add(force, scale(sub(driveTarget, body.pos), 0.06));
        const fromHome = sub(body.pos, body.home);
        if (len(fromHome) > 9) force = add(force, scale(fromHome, -0.07));
      } else {
        force = add(force, scale(sub(driveTarget, body.pos), 0.08));
        force = add(
          force,
          v((body.home.x - body.pos.x) * 0.025, (body.home.y - 0.6 - body.pos.y) * 0.035),
        );
      }

      const accel = scale(force, 1 / body.mass);
      body.vel = add(scale(body.vel, 0.76), accel);
      body.vel = clampMag(body.vel, maxSpeed(body.level, engaged));
      body.pos = clampField(add(body.pos, body.vel));

      // Soft leash along drive corridor (not a hard home magnet that cancels drive)
      const finish = drivePoint(body.def, 1);
      const corridor = add(
        scale(body.home, 1 - body.driveT),
        scale(finish, body.driveT),
      );
      const leash = body.level === "dl" ? 9 : body.level === "lb" ? 11 : 12;
      const off = sub(body.pos, corridor);
      if (len(off) > leash) {
        body.pos = clampField(add(corridor, scale(norm(off), leash)));
        body.vel = scale(body.vel, 0.35);
      }

      if (body.level === "dl") {
        body.pos.y = Math.min(body.home.y + 3.5, Math.max(finish.y - 1, body.pos.y));
      } else if (body.level === "lb") {
        body.pos.y = Math.min(body.home.y + 4, Math.max(finish.y - 2, body.pos.y));
      }
    }

    // Soft D↔D collisions — fixed hitboxes, damped (no zoom coupling)
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i]!;
        const b = bodies[j]!;
        const minD = minSeparation(
          hitboxDefense(a.level),
          hitboxDefense(b.level),
        );
        const delta = sub(b.pos, a.pos);
        const d = len(delta);
        if (d >= minD || d < 1e-4) continue;
        const n = scale(delta, 1 / d);
        const pen = minD - d;
        // Mass-weighted positional correction (fraction of penetration)
        const invA = 1 / a.mass;
        const invB = 1 / b.mass;
        const invSum = invA + invB;
        const corr = pen * 0.55;
        a.pos = clampField(sub(a.pos, scale(n, corr * (invA / invSum))));
        b.pos = clampField(add(b.pos, scale(n, corr * (invB / invSum))));
        // Kill closing velocity to prevent bounce oscillation
        const rel = sub(b.vel, a.vel);
        const closing = rel.x * n.x + rel.y * n.y; // b relative to a along n
        if (closing < 0) {
          const impulse = closing * COLLIDE_DAMP;
          a.vel = add(a.vel, scale(n, impulse * (invA / invSum)));
          b.vel = sub(b.vel, scale(n, impulse * (invB / invSum)));
        }
      }
    }

    // Soft O↔D solid keep-out for engaged pairs (fixed radii)
    for (const body of bodies) {
      const myR = hitboxDefense(body.level);
      for (const oid of body.def.engagedBy) {
        const o = byId.get(oid);
        if (!o) continue;
        const minD = minSeparation(myR, hitboxOffense(oid));
        const delta = sub(body.pos, o.pos);
        const d = len(delta);
        if (d >= minD || d < 1e-4) continue;
        const n = scale(delta, 1 / d);
        const pen = minD - d;
        // Defense yields more than scripted offense path (offense is kinematic)
        body.pos = clampField(add(body.pos, scale(n, pen * 0.7)));
        const vn = body.vel.x * n.x + body.vel.y * n.y;
        if (vn < 0) {
          body.vel = sub(body.vel, scale(n, vn * COLLIDE_DAMP));
        }
      }
    }
  }

  const offense = offensePosAtGlobal(play, globalT);
  const byId = new Map(offense.map((o) => [o.id, o]));
  const contacts: ContactSample[] = [];
  const defense: DefenseSample[] = bodies.map((body) => {
    const myR = hitboxDefense(body.level);
    for (const oid of body.def.engagedBy) {
      const o = byId.get(oid);
      if (!o) continue;
      const d = len(sub(body.pos, o.pos));
      const show = minSeparation(myR, hitboxOffense(oid)) + CONTACT_PAD;
      if (d < show) {
        contacts.push({
          offenseId: oid,
          defenseId: body.def.id,
          mid: [(o.pos.x + body.pos.x) / 2, (o.pos.y + body.pos.y) / 2],
          force: Math.min(
            1,
            (show - d) / show + body.pressure * 0.35,
          ),
          double:
            body.def.engagedBy.length >= 2 || Boolean(body.def.doubleTeam),
        });
      }
    }
    return {
      id: body.def.id,
      pos: [body.pos.x, body.pos.y],
      pressure: body.pressure,
      double: Boolean(body.def.doubleTeam),
      driveT: body.driveT,
    };
  });

  return { defense, contacts };
}

export function physicsCacheKey(
  playId: string,
  phaseIndex: number,
  progress: number,
): string {
  const q = Math.round(progress * 40) / 40;
  return `${playId}:${phaseIndex}:${q}`;
}
