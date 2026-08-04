import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FastForward,
  Pause,
  Play as PlayIcon,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  pointAlongPath,
  roleProgressAtPhaseEnd,
  roleProgressAtPhaseStart,
  type Play,
  type PlayRole,
} from "@/data/plays";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.5, 2] as const;

const ROLE_HUES = [
  "var(--color-primary)",
  "var(--color-info)",
  "var(--color-warn)",
  "#c4a8e8",
  "#7ec8c8",
  "#e8a87c",
  "#a8d08d",
  "#e07a7a",
  "#8ab4e8",
  "#d4c07a",
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function roleColor(index: number) {
  return ROLE_HUES[index % ROLE_HUES.length]!;
}

export function PlayDiagramAnimator({ play }: { play: Play }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [focusRoleId, setFocusRoleId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);

  const phase = play.phases[phaseIndex] ?? play.phases[0]!;
  const speed = SPEEDS[speedIdx]!;

  useEffect(() => {
    phaseRef.current = phaseIndex;
  }, [phaseIndex]);
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
    setPhaseIndex(0);
    setProgress(0);
    setPlaying(false);
    setFocusRoleId(null);
    phaseRef.current = 0;
    progressRef.current = 0;
    playingRef.current = false;
    lastTs.current = null;
  }, [play.id]);

  const goToPhase = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(play.phases.length - 1, index));
      phaseRef.current = next;
      progressRef.current = 0;
      lastTs.current = null;
      setPhaseIndex(next);
      setProgress(0);
      playingRef.current = false;
      setPlaying(false);
    },
    [play.phases.length],
  );

  useEffect(() => {
    if (reducedMotion || !playing) {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTs.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (!playingRef.current) return;
      if (lastTs.current == null) lastTs.current = ts;
      const dt = (ts - lastTs.current) * speedRef.current;
      lastTs.current = ts;

      const pIdx = phaseRef.current;
      const ph = play.phases[pIdx]!;
      const next = progressRef.current + dt / ph.durationMs;

      if (next >= 1) {
        if (pIdx >= play.phases.length - 1) {
          progressRef.current = 1;
          setProgress(1);
          playingRef.current = false;
          setPlaying(false);
          lastTs.current = null;
          return;
        }
        const ni = pIdx + 1;
        phaseRef.current = ni;
        progressRef.current = 0;
        setPhaseIndex(ni);
        setProgress(0);
        lastTs.current = ts;
      } else {
        progressRef.current = next;
        setProgress(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, reducedMotion, play.phases]);

  const roleStates = useMemo(() => {
    const t = easeInOut(progress);
    return play.roles.map((role, i) => {
      const start = roleProgressAtPhaseStart(play, phaseIndex, role.id);
      const end = roleProgressAtPhaseEnd(play, phaseIndex, role.id);
      const along = start + (end - start) * t;
      const pos = pointAlongPath(role.path, along);
      return { role, i, along, pos, trail: role.path };
    });
  }, [play, phaseIndex, progress]);

  const focused: PlayRole | undefined =
    focusRoleId != null
      ? play.roles.find((r) => r.id === focusRoleId)
      : (play.roles.find((r) => r.highlightPhases?.includes(phaseIndex)) ??
        play.roles[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)]">
        <svg
          viewBox="0 0 100 100"
          className="aspect-[5/6] w-full"
          role="img"
          aria-label={`${play.name} play diagram`}
        >
          <rect x="0" y="0" width="100" height="100" fill="var(--color-surface)" />
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="1.5"
            fill="color-mix(in oklab, var(--color-primary-dim) 35%, var(--color-surface))"
            stroke="var(--color-border-strong)"
            strokeWidth="0.4"
          />
          {[20, 35, 50, 65, 80].map((y) => (
            <line
              key={y}
              x1="6"
              x2="94"
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={y === 50 ? 0.55 : 0.25}
              strokeDasharray={y === 50 ? undefined : "1.2 1.2"}
              opacity={y === 50 ? 0.9 : 0.55}
            />
          ))}
          {[25, 40, 60, 75].map((y) => (
            <g key={`h-${y}`} opacity={0.35}>
              <line x1="28" x2="32" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth="0.3" />
              <line x1="68" x2="72" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth="0.3" />
            </g>
          ))}
          <text
            x="50"
            y="51.8"
            textAnchor="middle"
            fill="var(--color-subtle)"
            fontSize="2.4"
            fontFamily="var(--font-body)"
            opacity={0.7}
          >
            LOS
          </text>

          {roleStates.map(({ role, i, trail }) => {
            if (trail.length < 2) return null;
            const d = trail
              .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
              .join(" ");
            const dim =
              focusRoleId != null && focusRoleId !== role.id ? 0.2 : 0.55;
            return (
              <path
                key={`path-${role.id}`}
                d={d}
                fill="none"
                stroke={roleColor(i)}
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={dim}
                strokeDasharray="1.4 1.1"
              />
            );
          })}

          {roleStates.map(({ role, i, pos }) => {
            const focusedNow = focusRoleId === role.id;
            const dimmed = focusRoleId != null && !focusedNow;
            return (
              <g
                key={role.id}
                transform={`translate(${pos[0]}, ${pos[1]})`}
                opacity={dimmed ? 0.28 : 1}
                className="cursor-pointer"
                onClick={() =>
                  setFocusRoleId((cur) => (cur === role.id ? null : role.id))
                }
              >
                <circle
                  r={focusedNow ? 3.4 : 2.8}
                  fill={roleColor(i)}
                  stroke="var(--color-bg)"
                  strokeWidth="0.45"
                />
                <text
                  textAnchor="middle"
                  y="0.9"
                  fill="var(--color-bg)"
                  fontSize="2.1"
                  fontWeight="700"
                  fontFamily="var(--font-display)"
                >
                  {role.tag}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => goToPhase(0)} aria-label="Restart">
          <RotateCcw className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => goToPhase(phaseIndex - 1)}
          disabled={phaseIndex === 0}
          aria-label="Previous phase"
        >
          <SkipBack className="size-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (reducedMotion) {
              goToPhase(phaseIndex >= play.phases.length - 1 ? 0 : phaseIndex + 1);
              return;
            }
            if (progress >= 1 && phaseIndex >= play.phases.length - 1) {
              goToPhase(0);
              setPlaying(true);
              playingRef.current = true;
              return;
            }
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="size-4" /> : <PlayIcon className="size-4" />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => goToPhase(phaseIndex + 1)}
          disabled={phaseIndex >= play.phases.length - 1}
          aria-label="Next phase"
        >
          <SkipForward className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)}
        >
          <FastForward className="size-4" />
          {speed}×
        </Button>
      </div>

      <div className="flex gap-1.5">
        {play.phases.map((ph, i) => (
          <button
            key={ph.id}
            type="button"
            onClick={() => goToPhase(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < phaseIndex
                ? "bg-[var(--color-primary)]"
                : i === phaseIndex
                  ? "bg-[color-mix(in_oklab,var(--color-primary)_55%,var(--color-border))]"
                  : "bg-[var(--color-border)]",
            )}
            aria-label={`Phase ${i + 1}: ${ph.title}`}
          />
        ))}
      </div>

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            Phase {phaseIndex + 1}/{play.phases.length}
          </Badge>
          <p className="font-display text-lg font-semibold tracking-tight">{phase.title}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {phase.explanation}
        </p>
        <ul className="mt-3 space-y-1.5">
          {phase.coachingPoints.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-[var(--color-fg)]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          Roles — tap to focus
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {play.roles.map((role, i) => (
            <button
              key={role.id}
              type="button"
              onClick={() =>
                setFocusRoleId((cur) => (cur === role.id ? null : role.id))
              }
              className={cn(
                "flex h-11 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-medium",
                focusRoleId === role.id
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              <span
                className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-[var(--color-bg)]"
                style={{ background: roleColor(i) }}
              >
                {role.tag}
              </span>
              {role.label}
            </button>
          ))}
        </div>
        {focused && (
          <RoleCard
            role={focused}
            color={roleColor(Math.max(0, play.roles.findIndex((r) => r.id === focused.id)))}
          />
        )}
      </section>
    </div>
  );
}

function RoleCard({ role, color }: { role: PlayRole; color: string }) {
  return (
    <div className="mt-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-[var(--color-bg)]"
          style={{ background: color }}
        >
          {role.tag}
        </span>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">
            {role.label}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-subtle)]">
            Assignment
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{role.job}</p>
    </div>
  );
}
