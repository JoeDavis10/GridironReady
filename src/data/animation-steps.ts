import { coneDiagrams, type PathStyle } from "./cone-diagrams";
import type { Drill } from "./drills";

export type MotionStyle = PathStyle | "hold" | "setup";

export interface AnimationStep {
  id: string;
  title: string;
  instruction: string;
  cues: string[];
  style: MotionStyle;
  points: Array<[number, number]>;
  durationMs: number;
}

const STYLE_DURATION: Record<PathStyle, number> = {
  sprint: 1500,
  carioca: 2000,
  backwards: 1800,
  shuffle: 1900,
};

const STYLE_VERB: Record<PathStyle, string> = {
  sprint: "Sprint",
  carioca: "Carioca",
  backwards: "Backpedal",
  shuffle: "Shuffle",
};

function dist(a: [number, number], b: [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function pathLength(points: Array<[number, number]>) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1]!, points[i]!);
  return total;
}

function unit(a: [number, number], b: [number, number]): [number, number] {
  const d = dist(a, b) || 1;
  return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
}

/** True when heading change is a real plant / cut (not a gentle curve). */
function isHardCorner(a: [number, number], b: [number, number], c: [number, number]) {
  const u = unit(a, b);
  const v = unit(b, c);
  return u[0] * v[0] + u[1] * v[1] < 0.55;
}

type Edge = { style: PathStyle; from: [number, number]; to: [number, number] };

function edgesFromDiagram(diagramId: string): Edge[] {
  const spec = coneDiagrams[diagramId];
  if (!spec) return [];
  const edges: Edge[] = [];
  for (const path of spec.paths) {
    for (let i = 0; i < path.points.length - 1; i++) {
      const from = path.points[i]!;
      const to = path.points[i + 1]!;
      if (dist(from, to) < 0.4) continue;
      edges.push({ style: path.style, from, to });
    }
  }
  return edges;
}

type Leg = {
  style: PathStyle;
  points: Array<[number, number]>;
  bridge?: boolean;
};

/**
 * Prefer diagram authoring:
 * - Multiple path entries = intentional style/leg breaks
 * - Single continuous path = split on hard plant corners
 * - Bridge legs when path entries are disconnected (X drills)
 */
function legsFromDiagram(diagramId: string): Leg[] {
  const spec = coneDiagrams[diagramId];
  if (!spec) return [];

  if (spec.paths.length > 1) {
    const legs: Leg[] = [];
    let prevEnd: [number, number] | null = null;
    for (const path of spec.paths) {
      if (path.points.length < 2) continue;
      const start = path.points[0]!;
      if (prevEnd && dist(prevEnd, start) > 4) {
        legs.push({ style: "sprint", points: [prevEnd, start], bridge: true });
      }
      legs.push({
        style: path.style,
        points: path.points.map((p) => [p[0], p[1]] as [number, number]),
      });
      prevEnd = path.points[path.points.length - 1]!;
    }
    return legs.filter((l) => pathLength(l.points) >= 2);
  }

  return legsFromEdges(edgesFromDiagram(diagramId));
}

function legsFromEdges(edges: Edge[]): Leg[] {
  if (edges.length === 0) return [];
  const legs: Leg[] = [];
  let cur: Leg = {
    style: edges[0]!.style,
    points: [edges[0]!.from, edges[0]!.to],
  };

  for (let i = 1; i < edges.length; i++) {
    const e = edges[i]!;
    const a = cur.points[cur.points.length - 2]!;
    const b = cur.points[cur.points.length - 1]!;
    const gap = dist(b, e.from);

    if (gap > 2.5) {
      legs.push(cur);
      if (gap > 4) {
        legs.push({ style: "sprint", points: [b, e.from], bridge: true });
      }
      cur = { style: e.style, points: [e.from, e.to] };
      continue;
    }

    if (gap > 0.5 && gap <= 2.5) {
      cur.points.push(e.from);
    }

    const styleChange = e.style !== cur.style;
    const corner = isHardCorner(a, b, e.to);
    const curLen = pathLength(cur.points);
    const nextSeg = dist(e.from, e.to);

    if (styleChange || (corner && curLen >= 12 && nextSeg >= 8)) {
      legs.push(cur);
      cur = { style: e.style, points: [b, e.to] };
    } else {
      cur.points.push(e.to);
    }
  }
  legs.push(cur);

  return mergeMicroLegs(legs.filter((l) => pathLength(l.points) >= 2));
}

function mergeMicroLegs(legs: Leg[]): Leg[] {
  if (legs.length <= 1) return legs;
  const out: Leg[] = [];
  for (const leg of legs) {
    const len = pathLength(leg.points);
    const prev = out[out.length - 1];
    if (prev && !leg.bridge && !prev.bridge && len < 9 && prev.style === leg.style) {
      const start = dist(prev.points[prev.points.length - 1]!, leg.points[0]!) < 1 ? 1 : 0;
      for (let i = start; i < leg.points.length; i++) prev.points.push(leg.points[i]!);
      continue;
    }
    out.push({ ...leg, points: [...leg.points] });
  }
  return out;
}

function directionLabel(from: [number, number], to: [number, number]): string {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < 4 && ay < 4) return "in place";
  if (ax > ay * 1.35) return dx > 0 ? "right" : "left";
  if (ay > ax * 1.35) return dy > 0 ? "downfield" : "upfield";
  const v = dy > 0 ? "down" : "up";
  const h = dx > 0 ? "right" : "left";
  return `${v}-${h}`;
}

function motionTitle(
  style: PathStyle,
  from: [number, number],
  to: [number, number],
  bridge?: boolean,
): string {
  if (bridge) return "Reset to next start";
  const dir = directionLabel(from, to);
  if (dir === "in place") return STYLE_VERB[style];
  return `${STYLE_VERB[style]} ${dir}`;
}

/** Compact readable titles — never mid-sentence ellipsis. */
function compactTitle(sheet: string | undefined, fallback: string): string {
  if (!sheet) return fallback;
  const cleaned = sheet.replace(/\.$/, "").trim();
  if (cleaned.length <= 40) return cleaned;

  // Prefer clause before comma / em-dash / parenthetical
  const clause = cleaned.split(/[,;(—–]/)[0]?.trim() ?? cleaned;
  if (clause.length <= 40 && clause.length >= 8) return clause;

  // Football-friendly compressions
  let t = cleaned
    .replace(/\bon the inside of the cones\b/gi, "(inside)")
    .replace(/\bon the outside of the cones\b/gi, "(outside)")
    .replace(/\band finish past the start cone\b/gi, "+ finish")
    .replace(/\bacross the top\b/gi, "top")
    .replace(/\bacross the bottom\b/gi, "bottom")
    .replace(/\b\(dots on the sheet\)\b/gi, "")
    .replace(/\b\(squares on the sheet\)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (t.length <= 40) return t;
  // Last resort: first ~5 words
  const words = t.split(" ");
  if (words.length > 5) return words.slice(0, 5).join(" ");
  return fallback;
}

function cuesForLeg(
  drill: Drill,
  style: MotionStyle,
  instruction: string,
  legIndex: number,
): string[] {
  if (style === "setup") {
    return [
      "Athletic base — knees soft",
      "Eyes up before the go",
      "Wait for the whistle — no false starts",
    ];
  }
  if (style === "hold") {
    return [
      "Clear the lane fully",
      "Walk recover — hands on hips OK",
      "Reset for reverse or next rep",
    ];
  }

  const byStyle: Record<PathStyle, string[]> = {
    sprint: ["Arms drive hard", "Hit the plant low", "Finish through the cone"],
    carioca: ["Open the hips", "Stay tall — don't spin", "Quick feet, controlled"],
    shuffle: ["Stay low in the base", "Feet never cross", "Push off the outside foot"],
    backwards: ["Sit the hips", "Short steps", "Peek over the lead shoulder"],
  };

  // Pull the most relevant drill cue for this leg
  const drillCue = drill.cues[legIndex % Math.max(1, drill.cues.length)];
  const styleCues = byStyle[style as PathStyle] ?? byStyle.sprint;

  // Light contextual cue from the instruction itself
  const lower = instruction.toLowerCase();
  const context: string[] = [];
  if (/inside/.test(lower)) context.push("Stay inside the cone line");
  if (/outside/.test(lower)) context.push("Take the outside shoulder");
  if (/plant|cut/.test(lower)) context.push("Drop hips — outside foot drives the cut");
  if (/finish|clear|past/.test(lower)) context.push("Accelerate through the finish");
  if (/valley|center/.test(lower)) context.push("Thread the center gate clean");

  const pool = [...context, ...(drillCue ? [drillCue] : []), ...styleCues];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of pool) {
    const key = c.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= 3) break;
  }
  return out;
}

/**
 * Match each sheet line at most once. Prefer style-keyword hits.
 * Sequential fallback only for sprint so specialty styles don't steal finish lines.
 */
function matchSheetLine(
  motionCopy: string[],
  style: PathStyle,
  used: Set<number>,
): string | undefined {
  if (motionCopy.length === 0 || used.size >= motionCopy.length) return undefined;

  const styleRx: Record<PathStyle, RegExp> = {
    sprint:
      /sprint|drive|burst|finish|cut|plant|clear|clip|loop|enter|exit|up |down |across|wide|outside|inside|diagonal|post|valley|corner|perimeter|gauntlet/i,
    carioca: /carioca|karaoke/i,
    shuffle: /shuffle|lateral|slide/i,
    backwards: /back|reverse|pedal/i,
  };

  for (let i = 0; i < motionCopy.length; i++) {
    if (used.has(i)) continue;
    if (styleRx[style].test(motionCopy[i]!)) {
      used.add(i);
      return motionCopy[i];
    }
  }

  if (style === "sprint") {
    for (let i = 0; i < motionCopy.length; i++) {
      if (!used.has(i)) {
        used.add(i);
        return motionCopy[i];
      }
    }
  }

  return undefined;
}

export function buildAnimationSteps(drill: Drill): AnimationStep[] {
  if (drill.diagramId && coneDiagrams[drill.diagramId]) return buildConeSteps(drill);
  return buildGenericSteps(drill);
}

function buildConeSteps(drill: Drill): AnimationStep[] {
  const diagramId = drill.diagramId!;
  const legs = legsFromDiagram(diagramId);
  const startCone = coneDiagrams[diagramId]!.cones.find((c) => c.start);
  const start: [number, number] = legs[0]?.points[0]
    ? legs[0].points[0]!
    : [startCone?.x ?? 50, startCone?.y ?? 80];

  const motionCopy = drill.steps.filter(
    (s) =>
      !/^\s*rest\b|walk recover|hydrate|full recovery|reverse direction for the next|flip direction on alternate|opposite direction next rep|^\s*reset\b|reset or continuous|reset;/i.test(
        s,
      ),
  );
  const usedLines = new Set<number>();

  const steps: AnimationStep[] = [
    {
      id: `${drill.id}-setup`,
      title: "On your mark",
      instruction: drill.setup[0] ?? "Line up at the start cone. Check the path.",
      cues: cuesForLeg(drill, "setup", "", 0),
      style: "setup",
      points: [start],
      durationMs: 1400,
    },
  ];

  legs.forEach((leg, i) => {
    const from = leg.points[0]!;
    const to = leg.points[leg.points.length - 1]!;
    const sheet = leg.bridge
      ? "Jog clear, then reset to the next start mark without rushing the plant."
      : matchSheetLine(motionCopy, leg.style, usedLines);
    const len = pathLength(leg.points);
    const durationMs = Math.round(
      (leg.bridge ? 1100 : STYLE_DURATION[leg.style]) *
        Math.max(0.75, Math.min(2.0, len / 38)),
    );
    const fallback = motionTitle(leg.style, from, to, leg.bridge);
    const title = leg.bridge ? fallback : compactTitle(sheet, fallback);
    const instruction =
      sheet ??
      (leg.bridge
        ? "Reset to the next start. Stay under control."
        : `${STYLE_VERB[leg.style]} this leg (${directionLabel(from, to)}). Stay tight to the cones.`);

    steps.push({
      id: `${drill.id}-leg-${i}`,
      title,
      instruction,
      cues: cuesForLeg(drill, leg.bridge ? "setup" : leg.style, instruction, i),
      style: leg.bridge ? "sprint" : leg.style,
      points: leg.points,
      durationMs,
    });
  });

  const end = legs.length
    ? legs[legs.length - 1]!.points[legs[legs.length - 1]!.points.length - 1]!
    : start;

  steps.push({
    id: `${drill.id}-finish`,
    title: "Finish & recover",
    instruction:
      drill.steps.find((s) => /rest|recover|reverse|finish|flip direction|opposite/i.test(s)) ??
      "Clear the finish. Walk recover. Prepare the next rep.",
    cues: cuesForLeg(drill, "hold", "", legs.length),
    style: "hold",
    points: [end],
    durationMs: 1500,
  });

  return steps;
}

function buildGenericSteps(drill: Drill): AnimationStep[] {
  const steps: AnimationStep[] = [
    {
      id: `${drill.id}-setup`,
      title: "Setup",
      instruction: drill.setup[0] ?? "Set the station and brief the group.",
      cues: cuesForLeg(drill, "setup", "", 0),
      style: "setup",
      points: [[20, 78]],
      durationMs: 1200,
    },
  ];

  const n = Math.max(1, drill.steps.length);
  drill.steps.forEach((text, i) => {
    const style = inferStyle(text, drill.category);
    steps.push({
      id: `${drill.id}-s-${i}`,
      title: compactTitle(text, `Motion ${i + 1}`),
      instruction: text,
      cues: cuesForLeg(drill, style, text, i),
      style,
      points: pathForCategory(drill.category, i, n),
      durationMs: style === "hold" ? 1300 : 1600,
    });
  });

  const lastPts = steps[steps.length - 1]!.points;
  steps.push({
    id: `${drill.id}-done`,
    title: "Complete",
    instruction: "Log the set, hydrate, and rotate as prescribed.",
    cues: cuesForLeg(drill, "hold", "", n),
    style: "hold",
    points: [lastPts[lastPts.length - 1] ?? [80, 30]],
    durationMs: 1100,
  });

  return steps;
}

function inferStyle(text: string, category: Drill["category"]): MotionStyle {
  const t = text.toLowerCase();
  if (/shuffle|lateral/.test(t)) return "shuffle";
  if (/carioca|karaoke/.test(t)) return "carioca";
  if (/backpedal|backward/.test(t)) return "backwards";
  if (/rest|recover|stretch|plank|hold|water/.test(t)) return "hold";
  if (category === "cooldown" || category === "strength") return "hold";
  return "sprint";
}

function pathForCategory(
  category: Drill["category"],
  i: number,
  n: number,
): Array<[number, number]> {
  const t0 = i / n;
  const t1 = (i + 1) / n;
  if (category === "conditioning") {
    const y = 28 + (i % 4) * 14;
    return i % 2 === 0
      ? [
          [14, y],
          [86, y],
        ]
      : [
          [86, y],
          [14, y],
        ];
  }
  if (category === "agility") {
    return [
      [16 + t0 * 68, i % 2 === 0 ? 70 : 30],
      [16 + t1 * 68, i % 2 === 0 ? 30 : 70],
    ];
  }
  if (category === "warmup") {
    return [
      [50, 80 - t0 * 55],
      [50, 80 - t1 * 55],
    ];
  }
  if (category === "strength" || category === "cooldown") {
    const cx = 28 + (i % 4) * 16;
    const cy = 38 + Math.floor(i / 4) * 18;
    return [
      [cx, cy],
      [cx + 0.5, cy],
    ];
  }
  return i % 2 === 0
    ? [
        [22, 78 - t0 * 50],
        [78, 78 - t1 * 50],
      ]
    : [
        [78, 78 - t0 * 50],
        [22, 78 - t1 * 50],
      ];
}

export function pointOnPath(
  points: Array<[number, number]>,
  t: number,
): { x: number; y: number; angle: number } {
  if (points.length === 0) return { x: 50, y: 50, angle: 0 };
  if (points.length === 1) return { x: points[0]![0], y: points[0]![1], angle: 0 };
  const clamped = Math.max(0, Math.min(1, t));
  const total = pathLength(points);
  if (total === 0) return { x: points[0]![0], y: points[0]![1], angle: 0 };
  let remain = clamped * total;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const seg = dist(a, b);
    if (remain <= seg || i === points.length - 1) {
      const u = seg === 0 ? 0 : Math.min(1, remain / seg);
      return {
        x: a[0] + (b[0] - a[0]) * u,
        y: a[1] + (b[1] - a[1]) * u,
        angle: Math.round((Math.atan2(b[1] - a[1], b[0] - a[0]) * 1800) / Math.PI) / 10,
      };
    }
    remain -= seg;
  }
  const last = points[points.length - 1]!;
  return { x: last[0], y: last[1], angle: 0 };
}

export function samplePartial(
  points: Array<[number, number]>,
  t: number,
): Array<[number, number]> {
  if (points.length < 2) return points.slice();
  const end = pointOnPath(points, t);
  const total = pathLength(points);
  if (total === 0) return [points[0]!];
  const target = Math.max(0, Math.min(1, t)) * total;
  const out: Array<[number, number]> = [points[0]!];
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const seg = dist(a, b);
    if (acc + seg >= target) {
      out.push([end.x, end.y]);
      return out;
    }
    out.push(b);
    acc += seg;
  }
  out.push([end.x, end.y]);
  return out;
}
