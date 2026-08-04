/**
 * Deterministic block-physics for defensive looks.
 *
 * - DL driven by nearby OL contact (GOD / doubles), limited yards
 * - LBs shuffle/scrape on flow; meet FB/pullers only when close
 * - Nobody teleports onto the RB
 * - Safeties keep depth; CBs mirror slowly
 */
import {
  pointAlongPath,
  roleProgressAtPhaseEnd,
  roleProgressAtPhaseStart,
  type FieldPoint,
  type Play,
} from "@/data/plays";
import type { LookDefender } from "@/data/play-looks";

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
}

export interface PhysicsFrame {
  defense: DefenseSample[];
  contacts: ContactSample[];
}

const FIELD_MIN = 6;
const FIELD_MAX = 94;
const CONTACT_SHOW = 6.5;
/** Engagement only inside this range — no cross-field magnets */
const ENGAGE_R = 9.5;
const SEPARATION = 3.8;

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

type Level = "dl" | "lb" | "db";

function levelOf(tag: string): Level {
  const t = tag.toUpperCase();
  if (t === "N" || t === "T" || t === "E") return "dl";
  if (t === "M" || t === "W" || t === "S") return "lb";
  return "db";
}

function massFor(level: Level): number {
  if (level === "dl") return 1.45;
  if (level === "lb") return 1.05;
  return 0.95;
}

function maxSpeed(level: Level, engaged: boolean): number {
  if (level === "dl") return engaged ? 0.55 : 0.35;
  if (level === "lb") return engaged ? 0.62 : 0.48;
  return 0.42;
}

function baseAlign(def: LookDefender): Vec {
  const p = def.path[0] ?? [50, 48];
  return v(p[0], p[1]);
}

function offensePosAt(
  play: Play,
  globalMs: number,
): { id: string; pos: Vec; vel: Vec }[] {
  let t = Math.max(0, globalMs);
  let phaseIndex = 0;
  while (phaseIndex < play.phases.length) {
    const dur = play.phases[phaseIndex]!.durationMs;
    if (t <= dur || phaseIndex === play.phases.length - 1) {
      const progress = Math.min(1, t / Math.max(1, dur));
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      return play.roles.map((role) => {
        const start = roleProgressAtPhaseStart(play, phaseIndex, role.id);
        const end = roleProgressAtPhaseEnd(play, phaseIndex, role.id);
        const along = start + (end - start) * eased;
        const along2 = start + (end - start) * Math.min(1, eased + 0.025);
        const p1 = pointAlongPath(role.path, along);
        const p2 = pointAlongPath(role.path, along2);
        const pos = v(p1[0], p1[1]);
        const vel = scale(sub(v(p2[0], p2[1]), pos), 28);
        return { id: role.id, pos, vel };
      });
    }
    t -= dur;
    phaseIndex++;
  }
  return play.roles.map((role) => {
    const p = pointAlongPath(role.path, 1);
    return { id: role.id, pos: v(p[0], p[1]), vel: v(0, 0) };
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

  let targetMs = 0;
  for (let i = 0; i < phaseIndex; i++) {
    targetMs += play.phases[i]?.durationMs ?? 0;
  }
  const curDur = play.phases[phaseIndex]?.durationMs ?? 1600;
  targetMs += Math.max(0, Math.min(1, phaseProgress)) * curDur;

  const dt = 24;
  const steps = Math.max(1, Math.ceil(targetMs / dt));

  type DBody = {
    def: LookDefender;
    home: Vec;
    pos: Vec;
    vel: Vec;
    mass: number;
    level: Level;
    pressure: number;
  };

  const bodies: DBody[] = look.map((def) => {
    const level = levelOf(def.tag);
    const home = baseAlign(def);
    return {
      def,
      home,
      pos: { ...home },
      vel: v(0, 0),
      mass: massFor(level),
      level,
      pressure: 0,
    };
  });

  for (let step = 0; step < steps; step++) {
    const t = Math.min(targetMs, (step + 1) * dt);
    const offense = offensePosAt(play, t);
    const byId = new Map(offense.map((o) => [o.id, o]));

    const ball =
      byId.get("rb") ?? byId.get("fb") ?? byId.get("qb") ?? offense[0]!;

    // OL flow key (average x of OL)
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
      body.pressure *= 0.92;

      const nearEngagers = body.def.engagedBy
        .map((id) => {
          const o = byId.get(id);
          if (!o) return null;
          const d = len(sub(o.pos, body.pos));
          return d <= ENGAGE_R ? { ...o, dist: d } : null;
        })
        .filter(Boolean) as {
        id: string;
        pos: Vec;
        vel: Vec;
        dist: number;
      }[];

      let force = v(0, 0);
      const engaged = nearEngagers.length > 0;

      if (engaged) {
        const isDouble =
          nearEngagers.length >= 2 || Boolean(body.def.doubleTeam);

        let center = v(0, 0);
        let avgVel = v(0, 0);
        for (const e of nearEngagers) {
          center = add(center, e.pos);
          avgVel = add(avgVel, e.vel);
        }
        center = scale(center, 1 / nearEngagers.length);
        avgVel = scale(avgVel, 1 / nearEngagers.length);
        const dist = len(sub(center, body.pos));

        if (body.level === "dl") {
          // Stay on pads just attack-side of OL; ride limited drive
          const pad = add(center, v(0, -2.8));
          force = add(force, scale(sub(pad, body.pos), isDouble ? 0.22 : 0.16));
          force = add(force, scale(avgVel, isDouble ? 0.09 : 0.06));
          if (dist < 2.8 && dist > 1e-4) {
            force = add(force, scale(norm(sub(body.pos, center)), 0.2));
          }
          body.pressure = Math.min(
            1,
            body.pressure + (isDouble ? 0.2 : 0.12) * (1 - dist / ENGAGE_R),
          );
        } else if (body.level === "lb") {
          // Meet the blocker — do not glue and ride into the secondary
          const approach = norm(sub(center, body.home));
          const meet = sub(center, scale(approach, 2.4));
          const toMeet = sub(meet, body.pos);
          const meetDist = len(toMeet);
          force = add(force, scale(toMeet, 0.12));
          if (meetDist < 4 || dist < 5) {
            force = add(force, scale(avgVel, 0.05));
            if (dist < 3.2 && dist > 1e-4) {
              force = add(force, scale(norm(sub(body.pos, center)), 0.15));
            }
            body.pressure = Math.min(1, body.pressure + 0.18);
          } else {
            body.pressure = Math.min(1, body.pressure + 0.06);
          }
        } else {
          const mirror = add(center, v(center.x < 50 ? -2.5 : 2.5, -1.5));
          force = add(force, scale(sub(mirror, body.pos), 0.1));
          body.pressure = Math.min(1, body.pressure + 0.08);
        }
      } else if (body.level === "dl") {
        force = add(force, v(0, -0.04));
        force = add(force, v((body.home.x - body.pos.x) * 0.02, 0));
      } else if (body.level === "lb") {
        // Shuffle to flow — never sprint to RB
        const lateral = (flowX - body.pos.x) * 0.045;
        const depthTarget = body.home.y - 1.2;
        const downhill = (depthTarget - body.pos.y) * 0.03;
        const ballLat = (ball.pos.x - body.pos.x) * 0.02;
        force = add(force, v(lateral + ballLat, downhill));
        const fromHome = sub(body.pos, body.home);
        if (len(fromHome) > 8) {
          force = add(force, scale(fromHome, -0.08));
        }
      } else {
        const depthTarget = body.home.y - 0.5;
        force = add(
          force,
          v(
            (body.home.x - body.pos.x) * 0.03,
            (depthTarget - body.pos.y) * 0.04,
          ),
        );
        force = add(force, v((ball.pos.x - body.pos.x) * 0.01, 0));
      }

      const accel = scale(force, 1 / body.mass);
      body.vel = add(scale(body.vel, 0.78), accel);
      body.vel = clampMag(body.vel, maxSpeed(body.level, engaged));
      body.pos = clampField(add(body.pos, body.vel));

      // Hard leash from alignment
      const leash = body.level === "dl" ? 11 : body.level === "lb" ? 12 : 14;
      const homeDelta = sub(body.pos, body.home);
      const homeDist = len(homeDelta);
      if (homeDist > leash) {
        body.pos = clampField(add(body.home, scale(norm(homeDelta), leash)));
        body.vel = scale(body.vel, 0.3);
      }

      // Depth rails by level
      if (body.level === "dl") {
        body.pos.y = Math.min(body.home.y + 4, Math.max(body.home.y - 10, body.pos.y));
      } else if (body.level === "lb") {
        body.pos.y = Math.min(body.home.y + 5, Math.max(body.home.y - 9, body.pos.y));
      }
    }

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i]!;
        const b = bodies[j]!;
        const delta = sub(b.pos, a.pos);
        const d = len(delta);
        if (d < SEPARATION && d > 1e-4) {
          const n = scale(delta, 1 / d);
          const push = (SEPARATION - d) * 0.4;
          a.pos = clampField(sub(a.pos, scale(n, push * 0.5)));
          b.pos = clampField(add(b.pos, scale(n, push * 0.5)));
        }
      }
    }
  }

  const offense = offensePosAt(play, targetMs);
  const byId = new Map(offense.map((o) => [o.id, o]));
  const contacts: ContactSample[] = [];
  const defense: DefenseSample[] = bodies.map((body) => {
    for (const oid of body.def.engagedBy) {
      const o = byId.get(oid);
      if (!o) continue;
      const d = len(sub(body.pos, o.pos));
      if (d < CONTACT_SHOW) {
        contacts.push({
          offenseId: oid,
          defenseId: body.def.id,
          mid: [(o.pos.x + body.pos.x) / 2, (o.pos.y + body.pos.y) / 2],
          force: Math.min(
            1,
            (CONTACT_SHOW - d) / CONTACT_SHOW + body.pressure * 0.35,
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
