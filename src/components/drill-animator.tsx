import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FastForward,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  buildAnimationSteps,
  pointOnPath,
  samplePartial,
  type MotionStyle,
} from "@/data/animation-steps";
import { coneDiagrams, type PathStyle } from "@/data/cone-diagrams";
import type { Drill } from "@/data/drills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PATH_STROKE: Record<PathStyle, { dash?: string; width: number }> = {
  sprint: { width: 2.1 },
  carioca: { dash: "0.9 2.6", width: 2.3 },
  backwards: { dash: "3.4 2.2", width: 2.1 },
  shuffle: { dash: "1.2 2", width: 2.4 },
};

const STYLE_BADGE: Record<MotionStyle, string> = {
  sprint: "Sprint",
  carioca: "Carioca",
  backwards: "Backwards",
  shuffle: "Shuffle",
  hold: "Recover",
  setup: "Setup",
};

const SPEEDS = [0.75, 1, 1.5, 2] as const;

function isPathStyle(s: MotionStyle): s is PathStyle {
  return s === "sprint" || s === "carioca" || s === "backwards" || s === "shuffle";
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function r1(n: number) {
  return Math.round(n * 10) / 10;
}

function dist(a: [number, number], b: [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function DrillAnimator({ drill }: { drill: Drill }) {
  const steps = useMemo(() => buildAnimationSteps(drill), [drill]);
  const diagram = drill.diagramId ? coneDiagrams[drill.diagramId] : undefined;

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const stepIndexRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);

  const step = steps[stepIndex] ?? steps[0]!;
  const speed = SPEEDS[speedIdx]!;

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    setStepIndex(0);
    setProgress(0);
    setPlaying(false);
    stepIndexRef.current = 0;
    progressRef.current = 0;
    playingRef.current = false;
    lastTs.current = null;
  }, [drill.id]);

  const goToStep = useCallback(
    (index: number, keepPlaying = false) => {
      const next = Math.max(0, Math.min(steps.length - 1, index));
      stepIndexRef.current = next;
      progressRef.current = 0;
      lastTs.current = null;
      setStepIndex(next);
      setProgress(0);
      if (!keepPlaying) {
        playingRef.current = false;
        setPlaying(false);
      }
    },
    [steps.length],
  );

  const restart = useCallback(() => {
    stepIndexRef.current = 0;
    progressRef.current = 0;
    lastTs.current = null;
    playingRef.current = true;
    setStepIndex(0);
    setProgress(0);
    setPlaying(true);
  }, []);

  const rewindStep = useCallback(() => {
    if (progressRef.current > 0.05) {
      progressRef.current = 0;
      lastTs.current = null;
      setProgress(0);
      return;
    }
    goToStep(stepIndexRef.current - 1, playingRef.current);
  }, [goToStep]);

  const forwardStep = useCallback(() => {
    if (stepIndexRef.current >= steps.length - 1) {
      progressRef.current = 1;
      setProgress(1);
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    goToStep(stepIndexRef.current + 1, playingRef.current);
  }, [goToStep, steps.length]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTs.current = null;
      return;
    }

    if (reducedMotion) {
      const id = window.setTimeout(() => {
        if (stepIndexRef.current >= steps.length - 1) {
          setProgress(1);
          setPlaying(false);
          return;
        }
        goToStep(stepIndexRef.current + 1, true);
      }, Math.max(650, (steps[stepIndexRef.current]?.durationMs ?? 1200) / speed));
      return () => window.clearTimeout(id);
    }

    const tick = (ts: number) => {
      if (!playingRef.current) return;
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(64, ts - lastTs.current);
      lastTs.current = ts;

      const current = steps[stepIndexRef.current];
      if (!current) return;

      const hold =
        current.style === "hold" ||
        current.style === "setup" ||
        current.points.length < 2;
      const duration = Math.max(400, current.durationMs / speedRef.current);
      const next = progressRef.current + dt / duration;

      if (next >= 1) {
        if (stepIndexRef.current >= steps.length - 1) {
          progressRef.current = 1;
          setProgress(1);
          playingRef.current = false;
          setPlaying(false);
          return;
        }
        const ni = stepIndexRef.current + 1;
        stepIndexRef.current = ni;
        progressRef.current = 0;
        setStepIndex(ni);
        setProgress(0);
        lastTs.current = ts;
      } else {
        progressRef.current = next;
        setProgress(hold ? Math.min(1, next) : next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTs.current = null;
    };
  }, [playing, reducedMotion, steps, speed, goToStep]);

  const t = reducedMotion
    ? 1
    : step.points.length < 2
      ? 0
      : easeInOut(progress);
  const athlete = pointOnPath(step.points, t);
  const legPhase = t * Math.PI * 5;
  const targetPt =
    step.points.length >= 2
      ? step.points[step.points.length - 1]!
      : step.points[0] ?? ([50, 50] as [number, number]);

  const trail = useMemo(() => {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < stepIndex; i++) {
      const s = steps[i]!;
      if (!s.points.length) continue;
      if (!pts.length) pts.push(s.points[0]!);
      else if (dist(pts[pts.length - 1]!, s.points[0]!) > 1) pts.push(s.points[0]!);
      for (let p = 1; p < s.points.length; p++) pts.push(s.points[p]!);
    }
    if (step.points.length >= 2) {
      const partial = samplePartial(step.points, t);
      if (!pts.length) {
        pts.push(...partial);
      } else {
        if (partial[0] && dist(pts[pts.length - 1]!, partial[0]) > 1) pts.push(partial[0]);
        for (let i = 1; i < partial.length; i++) pts.push(partial[i]!);
      }
    } else if (step.points[0]) {
      if (!pts.length || dist(pts[pts.length - 1]!, step.points[0]) > 0.5) {
        pts.push(step.points[0]);
      }
    }
    return pts;
  }, [stepIndex, step, steps, t]);

  const ghostSegments = useMemo(() => {
    if (!diagram) {
      return steps.filter((s) => s.points.length >= 2).map((s) => s.points);
    }
    const segs: Array<Array<[number, number]>> = [];
    let cur: Array<[number, number]> = [];
    for (const path of diagram.paths) {
      for (const p of path.points) {
        if (!cur.length) {
          cur.push(p);
          continue;
        }
        if (dist(cur[cur.length - 1]!, p) > 3) {
          if (cur.length >= 2) segs.push(cur);
          cur = [p];
        } else {
          cur.push(p);
        }
      }
    }
    if (cur.length >= 2) segs.push(cur);
    return segs;
  }, [diagram, steps]);

  const overallPct = Math.round(((stepIndex + progress) / Math.max(1, steps.length)) * 100);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const finished = isLast && progress >= 0.98;
  const showInstruction =
    step.instruction.trim().toLowerCase() !== step.title.trim().toLowerCase();

  const destCone = useMemo(() => {
    if (!diagram || step.points.length < 2) return null;
    let best: { x: number; y: number } | null = null;
    let bestD = 8;
    for (const c of diagram.cones) {
      const d = Math.hypot(c.x - targetPt[0], c.y - targetPt[1]);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    return best;
  }, [diagram, step.points.length, targetPt]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-elevated)] p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Step-by-step motion
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="tabular">
              {overallPct}%
            </Badge>
            <Badge variant="outline" className="tabular">
              {stepIndex + 1}/{steps.length}
            </Badge>
          </div>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 100 100"
            className="mx-auto aspect-square w-full max-h-72"
            role="img"
            aria-label={`${drill.name}: ${step.title}`}
          >
            <defs>
              <filter id="athlete-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect
              x="3"
              y="3"
              width="94"
              height="94"
              rx="5"
              className="fill-[var(--color-surface)] stroke-[var(--color-border)]"
              strokeWidth="0.7"
            />

            {!diagram && (
              <g className="stroke-[var(--color-border)]" strokeWidth="0.35" opacity={0.6}>
                {[24, 40, 56, 72].map((y) => (
                  <line key={y} x1="10" y1={y} x2="90" y2={y} strokeDasharray="2 3" />
                ))}
              </g>
            )}

            {diagram?.box && (
              <rect
                x={diagram.box.x}
                y={diagram.box.y}
                width={diagram.box.w}
                height={diagram.box.h}
                fill="none"
                className="stroke-[var(--color-border-strong)]"
                strokeWidth="0.7"
                opacity={0.4}
              />
            )}

            {ghostSegments.map((pts, i) => (
              <path
                key={`ghost-${i}`}
                d={pts.map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-border-strong)]"
                opacity={0.32}
              />
            ))}

            {diagram?.paths.map((path, i) => {
              if (path.points.length < 2) return null;
              const d = path.points
                .map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
                .join(" ");
              const stroke = PATH_STROKE[path.style];
              return (
                <path
                  key={`style-${i}`}
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={stroke.width}
                  strokeDasharray={stroke.dash}
                  strokeLinecap="round"
                  className="text-[var(--color-muted)]"
                  opacity={0.4}
                />
              );
            })}

            {!diagram &&
              steps.map((s, i) => {
                if (i < stepIndex || s.points.length < 2) return null;
                return (
                  <path
                    key={s.id}
                    d={s.points.map((p, j) => `${j === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeDasharray="2 2"
                    className="text-[var(--color-border-strong)]"
                    opacity={0.35}
                  />
                );
              })}

            {step.points.length >= 2 && (
              <path
                d={step.points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth={isPathStyle(step.style) ? PATH_STROKE[step.style].width + 1.1 : 2.6}
                strokeDasharray={isPathStyle(step.style) ? PATH_STROKE[step.style].dash : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-fg)]"
                opacity={0.55}
              />
            )}

            {trail.length >= 2 && (
              <path
                d={trail.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-primary)]"
                opacity={0.95}
              />
            )}

            {step.points.length >= 2 && (
              <g>
                <circle
                  cx={targetPt[0]}
                  cy={targetPt[1]}
                  r={4.2}
                  fill="none"
                  className="stroke-[var(--color-primary)]"
                  strokeWidth="0.7"
                  opacity={0.55 + 0.35 * Math.sin(progress * Math.PI)}
                />
                {destCone ? (
                  <circle
                    cx={destCone.x}
                    cy={destCone.y}
                    r={3.4}
                    fill="none"
                    className="stroke-[var(--color-warn)]"
                    strokeWidth="0.9"
                    opacity={0.75}
                  />
                ) : null}
              </g>
            )}

            {diagram?.cones.map((cone, i) => {
              const isDest =
                destCone &&
                Math.abs(cone.x - destCone.x) < 0.1 &&
                Math.abs(cone.y - destCone.y) < 0.1;
              return (
                <g key={i}>
                  <circle
                    cx={cone.x}
                    cy={cone.y}
                    r={cone.start ? 3 : isDest ? 2.9 : 2.5}
                    className={
                      cone.start
                        ? "fill-[var(--color-primary)]"
                        : isDest
                          ? "fill-[var(--color-warn)]"
                          : "fill-[var(--color-muted)]"
                    }
                  />
                  {cone.start && (
                    <circle
                      cx={cone.x}
                      cy={cone.y}
                      r={4.8}
                      fill="none"
                      className="stroke-[var(--color-primary)]"
                      strokeWidth="0.55"
                      opacity={0.4}
                    />
                  )}
                </g>
              );
            })}

            <g
              transform={`translate(${r1(athlete.x)} ${r1(athlete.y)})`}
              filter="url(#athlete-glow)"
            >
              <circle r="7.5" className="fill-[var(--color-primary)]" opacity={0.18} />
              <g transform={`rotate(${athlete.angle})`}>
                <ellipse
                  cx="0"
                  cy="0.2"
                  rx="2.9"
                  ry="3.4"
                  className="fill-[var(--color-primary)] stroke-[var(--color-bg)]"
                  strokeWidth="0.5"
                />
                <circle cx="0" cy="-4.5" r="1.9" className="fill-[var(--color-fg)]" />
                {isPathStyle(step.style) && step.points.length >= 2 && (
                  <>
                    <line
                      x1="0"
                      y1="2.4"
                      x2={r1(Math.sin(legPhase) * 2.7)}
                      y2="5.7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      className="text-[var(--color-primary)]"
                    />
                    <line
                      x1="0"
                      y1="2.4"
                      x2={r1(Math.sin(legPhase + Math.PI) * 2.7)}
                      y2="5.7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      className="text-[var(--color-primary)]"
                    />
                  </>
                )}
                <polygon
                  points="3.4,-1.3 6.8,0 3.4,1.3"
                  className="fill-[var(--color-fg)]"
                  opacity={0.95}
                />
              </g>
            </g>
          </svg>

          <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex justify-center">
            <span className="max-w-[96%] truncate rounded-full border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_90%,transparent)] px-3 py-1 text-[11px] font-medium text-[var(--color-fg)] backdrop-blur-sm">
              {STYLE_BADGE[step.style]} · {step.title}
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-75"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{STYLE_BADGE[step.style]}</Badge>
          {step.points.length >= 2 ? (
            <Badge variant="secondary">Moving</Badge>
          ) : step.style === "setup" ? (
            <Badge variant="secondary">Brief</Badge>
          ) : (
            <Badge variant="secondary">Hold</Badge>
          )}
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Now explaining
          </p>
          <h3 className="mt-0.5 font-display text-xl font-semibold leading-tight tracking-tight">
            {step.title}
          </h3>
          {showInstruction && (
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
              {step.instruction}
            </p>
          )}
        </div>

        {step.cues.length > 0 && (
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Coaching cues this step
            </p>
            <ul className="space-y-1.5">
              {step.cues.map((cue) => (
                <li
                  key={cue}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-2.5 py-1.5 text-xs leading-relaxed text-[var(--color-fg)]"
                >
                  {cue}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Jump to ${s.title}`}
              aria-current={i === stepIndex ? "step" : undefined}
              onClick={() => goToStep(i, false)}
              className={cn(
                "h-8 min-w-8 rounded-full border px-2 text-[11px] font-medium tabular transition-colors duration-[var(--duration-fast)]",
                i === stepIndex
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : i < stepIndex
                    ? "border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border))] bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-subtle)]",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-1">
          <div className="flex items-center justify-start gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Restart animation"
              onClick={restart}
            >
              <RotateCcw aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous step"
              disabled={isFirst && progress === 0}
              onClick={rewindStep}
            >
              <SkipBack aria-hidden />
            </Button>
          </div>

          <Button
            size="lg"
            className="min-w-[8rem]"
            onClick={() => {
              if (finished) restart();
              else setPlaying((p) => !p);
            }}
          >
            {playing ? (
              <>
                <Pause aria-hidden /> Pause
              </>
            ) : finished ? (
              <>
                <RotateCcw aria-hidden /> Replay
              </>
            ) : (
              <>
                <Play aria-hidden /> Play
              </>
            )}
          </Button>

          <div className="flex items-center justify-end gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next step"
              disabled={finished}
              onClick={forwardStep}
            >
              <SkipForward aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-w-[3.25rem] px-2"
              aria-label={`Playback speed ${speed}x. Tap to change.`}
              onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            >
              <FastForward className="size-3.5" aria-hidden />
              <span className="text-[11px] font-semibold tabular">{speed}×</span>
            </Button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--color-subtle)]">
          Play/pause · prev/next · jump chips · speed {speed}×
        </p>
      </div>
    </div>
  );
}
