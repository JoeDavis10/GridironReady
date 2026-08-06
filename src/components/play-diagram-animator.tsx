import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FastForward,
  Maximize2,
  Minimize2,
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
  type LookDefender,
  type Play,
  type PlayRole,
} from "@/data/plays";
import { sampleBlockPhysics } from "@/lib/block-physics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.5, 2] as const;

/** Distinct OL colors — pullers stay high-contrast */
const ROLE_HUES = [
  "#5b8def", // qb
  "#e8a54b", // rb
  "#6bcf8e", // lt
  "#c4a8e8", // lg — pull-friendly purple
  "#f0d060", // c
  "#ff7a59", // rg — pull-friendly orange
  "#7ec8c8", // rt
  "#e07a9a", // y/te
  "#8ab4e8", // fb
  "#a8d08d", // x
  "#d4a574", // z
  "#b8e0d2",
];

const DEF_FILL = "#2f3440";
const DEF_STROKE = "#d0d5de";
const CONTACT = "var(--color-warn)";
const DOUBLE = "var(--color-primary)";

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function roleColor(index: number) {
  return ROLE_HUES[index % ROLE_HUES.length]!;
}

function isPuller(role: PlayRole): boolean {
  if (/pull/i.test(role.job) || /pull/i.test(role.label)) return true;
  const a = role.path[0];
  const b = role.path[Math.min(2, role.path.length - 1)];
  if (!a || !b) return false;
  return Math.abs(b[0] - a[0]) >= 10 && Math.abs(b[1] - a[1]) <= 10;
}

function shortLabel(role: PlayRole): string {
  // Compact chips so more fit on screen before scroll
  if (role.tag.length <= 2 && role.label.length > 10) return role.tag;
  const first = role.label.split(/[\s/]/)[0] ?? role.tag;
  return first.length > 9 ? role.tag : first;
}

/** Nudge markers apart so bubbles don't fully merge */
function deconflictPositions(
  items: { id: string; x: number; y: number; r: number; priority: number }[],
): Map<string, [number, number]> {
  const pts = items.map((it) => ({ ...it, x: it.x, y: it.y }));
  // Higher priority (pullers / focused) keep preferred seat; others yield
  pts.sort((a, b) => a.priority - b.priority);
  for (let iter = 0; iter < 6; iter++) {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i]!;
        const b = pts[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const min = a.r + b.r + 0.75;
        if (dist < min) {
          const push = (min - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          // lower priority moves more
          const aW = a.priority >= b.priority ? 0.25 : 0.75;
          const bW = 1 - aW;
          a.x -= nx * push * aW;
          a.y -= ny * push * aW;
          b.x += nx * push * bW;
          b.y += ny * push * bW;
        }
      }
    }
  }
  const out = new Map<string, [number, number]>();
  for (const p of pts) {
    out.set(p.id, [
      Math.min(94, Math.max(6, p.x)),
      Math.min(94, Math.max(6, p.y)),
    ]);
  }
  return out;
}

function ChipRail({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateAfford = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateAfford();
    el.addEventListener("scroll", updateAfford, { passive: true });
    const ro = new ResizeObserver(updateAfford);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateAfford);
      ro.disconnect();
    };
  }, [updateAfford, children]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(120, el.clientWidth * 0.55), behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          {label}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Scroll chips left"
            disabled={!canLeft}
            onClick={() => scrollByDir(-1)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border touch-manipulation",
              canLeft
                ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]"
                : "border-transparent bg-transparent text-[var(--color-subtle)] opacity-40",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll chips right"
            disabled={!canRight}
            onClick={() => scrollByDir(1)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border touch-manipulation",
              canRight
                ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)]"
                : "border-transparent bg-transparent text-[var(--color-subtle)] opacity-40",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div
          ref={scrollerRef}
          className={cn(
            "flex w-full max-w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain",
            "scroll-smooth px-2 py-2 touch-pan-x snap-x snap-mandatory",
            // Thin visible scrollbar so “swipe” is discoverable
            "[scrollbar-width:thin]",
            "[&::-webkit-scrollbar]:h-1.5",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:bg-[var(--color-border-strong)]",
            "[-webkit-overflow-scrolling:touch]",
          )}
          role="list"
        >
          {children}
          <span className="w-2 shrink-0 snap-end" aria-hidden />
        </div>
        {canLeft && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[var(--color-surface)] to-transparent"
          />
        )}
        {canRight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--color-surface)] to-transparent"
          />
        )}
      </div>
      {canRight && (
        <p className="mt-1 text-[10px] text-[var(--color-subtle)]">
          Swipe or use arrows for more players
        </p>
      )}
    </div>
  );
}

export function PlayDiagramAnimator({ play }: { play: Play }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [focusRoleId, setFocusRoleId] = useState<string | null>(null);
  const [focusLookId, setFocusLookId] = useState<string | null>(null);
  const [showLook, setShowLook] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);

  const phase = play.phases[phaseIndex] ?? play.phases[0]!;
  const speed = SPEEDS[speedIdx]!;
  const look = play.look ?? [];
  const hasLook = look.length > 0 && play.side === "offense";

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
    setFocusLookId(null);
    setShowLook(true);
    setImmersive(false);
    phaseRef.current = 0;
    progressRef.current = 0;
    playingRef.current = false;
    lastTs.current = null;
  }, [play.id]);

  useEffect(() => {
    if (!immersive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImmersive(false);
    };
    document.addEventListener("keydown", onKey);
    const el = shellRef.current;
    const req = el?.requestFullscreen?.bind(el);
    if (req && !document.fullscreenElement) {
      void req().catch(() => {});
    }
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => {});
      }
    };
  }, [immersive]);

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
      const pull = isPuller(role);
      return { role, i, along, pos, trail: role.path, pull };
    });
  }, [play, phaseIndex, progress]);

  const physics = useMemo(() => {
    if (!hasLook || !showLook) return null;
    return sampleBlockPhysics(play, phaseIndex, progress);
  }, [play, phaseIndex, progress, hasLook, showLook]);

  const lookStates = useMemo(() => {
    if (!physics) return [];
    const byId = new Map(physics.defense.map((d) => [d.id, d]));
    return look.map((def) => {
      const sample = byId.get(def.id);
      const pos =
        sample?.pos ?? def.path[0] ?? ([50, 48] as [number, number]);
      return {
        def,
        pos,
        pressure: sample?.pressure ?? 0,
        double: sample?.double ?? Boolean(def.doubleTeam),
      };
    });
  }, [physics, look]);

  /** Display positions with deconflict so pullers don't bury under OL */
  const displayPos = useMemo(() => {
    const scale = immersive ? 1.35 : 1.12;
    const items: {
      id: string;
      x: number;
      y: number;
      r: number;
      priority: number;
    }[] = [];
    for (const s of roleStates) {
      const focused = focusRoleId === s.role.id;
      const r = (s.pull ? 2.55 : focused ? 2.5 : 2.15) * scale;
      items.push({
        id: s.role.id,
        x: s.pos[0],
        y: s.pos[1],
        r,
        priority: focused
          ? 3
          : s.pull
            ? 2
            : s.role.highlightPhases?.includes(phaseIndex)
              ? 1
              : 0,
      });
    }
    return deconflictPositions(items);
  }, [roleStates, focusRoleId, phaseIndex, immersive]);

  const rolePosById = useMemo(() => {
    const m = new Map<string, [number, number]>();
    for (const s of roleStates) m.set(s.role.id, s.pos);
    return m;
  }, [roleStates]);

  const contacts = useMemo(() => {
    if (!physics || !hasLook || !showLook) return [];
    const defById = new Map(look.map((d) => [d.id, d]));
    const out: {
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      double: boolean;
      mid: [number, number];
      force: number;
      def: LookDefender;
    }[] = [];
    for (const c of physics.contacts) {
      const def = defById.get(c.defenseId);
      const op = rolePosById.get(c.offenseId);
      const dp = physics.defense.find((d) => d.id === c.defenseId)?.pos;
      if (!def || !op || !dp) continue;
      out.push({
        key: `${c.offenseId}-${c.defenseId}`,
        x1: op[0],
        y1: op[1],
        x2: dp[0],
        y2: dp[1],
        double: c.double,
        mid: c.mid as [number, number],
        force: c.force,
        def,
      });
    }
    return out;
  }, [physics, look, rolePosById, hasLook, showLook]);

  const doubleTargets = useMemo(
    () => lookStates.filter((s) => s.double || s.def.doubleTeam),
    [lookStates],
  );

  const focused: PlayRole | undefined =
    focusRoleId != null
      ? play.roles.find((r) => r.id === focusRoleId)
      : (play.roles.find((r) => r.highlightPhases?.includes(phaseIndex)) ??
        play.roles[0]);

  const focusedLook: LookDefender | undefined =
    focusLookId != null ? look.find((d) => d.id === focusLookId) : undefined;

  // Draw order: non-pullers first, pullers last (on top)
  const sortedRoles = useMemo(() => {
    return [...roleStates].sort((a, b) => {
      const af = focusRoleId === a.role.id ? 1 : 0;
      const bf = focusRoleId === b.role.id ? 1 : 0;
      if (af !== bf) return af - bf;
      return Number(a.pull) - Number(b.pull);
    });
  }, [roleStates, focusRoleId]);

  const S = immersive ? 1.35 : 1.12;
  const pathW = (base: number) => base * S;
  const fontS = (base: number) => base * S;

  return (
    <div
      className={cn(
        "w-full max-w-full min-w-0 space-y-4 overflow-x-hidden",
        immersive &&
          "fixed inset-0 z-[200] flex flex-col space-y-0 overflow-hidden bg-[var(--color-bg)] p-0",
      )}
    >
      <div
        ref={shellRef}
        className={cn(
          "w-full max-w-full min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)]",
          immersive &&
            "flex h-full min-h-0 flex-1 flex-col rounded-none border-0 bg-[var(--color-bg)]",
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-[var(--color-border)] px-3 py-2",
            immersive && "shrink-0 bg-[var(--color-surface)] px-4 py-3",
          )}
        >
          <div className="min-w-0 flex-1 basis-[10rem]">
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              {play.formation}
              {immersive ? ` · ${play.name}` : ""}
            </p>
            {hasLook && play.lookFront && (
              <p className="truncate text-[10px] text-[var(--color-muted)]">
                vs {play.lookFront} · reactive D
              </p>
            )}
          </div>
          <div className="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2">
            <p className="text-[11px] font-semibold tabular-nums text-[var(--color-muted)]">
              {play.roles.length}
              {hasLook && showLook ? ` + ${look.length} D` : ""} players
            </p>
            {hasLook && (
              <button
                type="button"
                onClick={() => setShowLook((v) => !v)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3 text-[10px] font-semibold touch-manipulation",
                  showLook
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {showLook ? "Defense on" : "Defense off"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setImmersive((v) => !v)}
              aria-label={immersive ? "Exit full screen" : "Full screen HD"}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold touch-manipulation",
                immersive
                  ? "border-transparent bg-[var(--color-fg)] text-[var(--color-bg)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-fg)]",
              )}
            >
              {immersive ? (
                <Minimize2 className="size-3.5" aria-hidden />
              ) : (
                <Maximize2 className="size-3.5" aria-hidden />
              )}
              {immersive ? "Exit" : "Full screen"}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "relative w-full",
            immersive &&
              "flex min-h-0 flex-1 items-center justify-center bg-[var(--color-surface)] px-1 py-1 sm:px-3 sm:py-2",
          )}
        >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "w-full max-w-full",
            immersive
              ? "h-full max-h-full w-full max-w-full aspect-square"
              : "aspect-[5/6]",
          )}
          style={{
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
          }}
          role="img"
          aria-label={`${play.name} play diagram`}
        >
          <defs>
            {ROLE_HUES.map((hue, i) => (
              <marker
                key={`m-${i}`}
                id={`arrow-${i}`}
                markerWidth="4"
                markerHeight="4"
                refX="3"
                refY="2"
                orient="auto"
              >
                <path d="M0,0 L4,2 L0,4 Z" fill={hue} />
              </marker>
            ))}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.35" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="var(--color-surface)" />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="1.2"
            fill="color-mix(in oklab, var(--color-primary-dim) 22%, var(--color-surface))"
            stroke="var(--color-border-strong)"
            strokeWidth={0.45 * S}
          />
          {[15, 25, 35, 45, 50, 55, 65, 75, 85].map((y) => (
            <line
              key={y}
              x1="5"
              x2="95"
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={y === 50 ? 0.7 * S : 0.28 * S}
              strokeDasharray={y === 50 ? undefined : "1.1 1.3"}
              opacity={y === 50 ? 0.95 : 0.4}
            />
          ))}
          {[25, 40, 60, 75].map((y) => (
            <g key={`h-${y}`} opacity={0.45}>
              <line x1="28" x2="33" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.35 * S} />
              <line x1="67" x2="72" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.35 * S} />
            </g>
          ))}
          <text
            x="50"
            y="51.9"
            textAnchor="middle"
            fill="var(--color-subtle)"
            fontSize={fontS(2.4)}
            fontFamily="var(--font-body)"
            fontWeight="600"
            opacity={0.75}
          >
            LOS
          </text>

          {/* Paths — pullers solid+arrow, others light dashed */}
          {roleStates.map(({ role, i, trail, pull }) => {
            if (trail.length < 2) return null;
            const d = trail
              .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
              .join(" ");
            const isFocus = focusRoleId === role.id;
            const dim =
              focusRoleId != null && !isFocus
                ? 0.08
                : pull
                  ? 0.7
                  : 0.28;
            return (
              <path
                key={`path-${role.id}`}
                d={d}
                fill="none"
                stroke={roleColor(i)}
                strokeWidth={pathW(pull || isFocus ? 1.05 : 0.55)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={dim}
                strokeDasharray={pull ? undefined : "1.4 1.0"}
                markerEnd={pull || isFocus ? `url(#arrow-${i % ROLE_HUES.length})` : undefined}
              />
            );
          })}

          {/* Ghost start for pullers — shows where they left from */}
          {roleStates
            .filter((s) => s.pull && s.along > 0.08)
            .map(({ role, i, trail }) => {
              const start = trail[0]!;
              return (
                <g key={`ghost-${role.id}`} opacity={0.55}>
                  <circle
                    cx={start[0]}
                    cy={start[1]}
                    r={1.85 * S}
                    fill="none"
                    stroke={roleColor(i)}
                    strokeWidth={0.4 * S}
                    strokeDasharray="0.8 0.6"
                  />
                  <text
                    x={start[0]}
                    y={start[1] - 2.6 * S}
                    textAnchor="middle"
                    fill={roleColor(i)}
                    fontSize={fontS(1.85)}
                    fontWeight="700"
                    fontFamily="var(--font-display)"
                    stroke="var(--color-surface)"
                    strokeWidth={0.45 * S}
                    paintOrder="stroke"
                  >
                    {role.tag}·pull
                  </text>
                </g>
              );
            })}

          {/* Contact lines */}
          {contacts.map((c) => {
            const active =
              focusLookId == null ||
              focusLookId === c.def.id ||
              (focusRoleId != null && c.key.startsWith(focusRoleId));
            const sw = pathW(0.4 + c.force * 0.5);
            return (
              <g key={c.key} opacity={active ? 0.85 : 0.14}>
                <line
                  x1={c.x1}
                  y1={c.y1}
                  x2={c.x2}
                  y2={c.y2}
                  stroke={c.double ? DOUBLE : CONTACT}
                  strokeWidth={sw}
                  strokeDasharray={c.double ? "1.1 0.6" : "0.7 0.7"}
                />
              </g>
            );
          })}

          {doubleTargets.map(({ def, pos, pressure }) => (
            <circle
              key={`dbl-${def.id}`}
              cx={pos[0]}
              cy={pos[1]}
              r={(3.4 + pressure * 0.9) * S}
              fill="none"
              stroke={DOUBLE}
              strokeWidth={0.4 * S}
              opacity={0.4 + pressure * 0.35}
              strokeDasharray="1 0.8"
            />
          ))}

          {/* Defense under offense for readability */}
          {lookStates.map(({ def, pos, pressure }) => {
            const focusedNow = focusLookId === def.id;
            const dimmed =
              (focusLookId != null && !focusedNow) ||
              (focusRoleId != null &&
                !def.engagedBy.includes(focusRoleId) &&
                focusLookId == null);
            const s = ((focusedNow ? 2.45 : 2.1) + pressure * 0.22) * S;
            return (
              <g
                key={def.id}
                transform={`translate(${pos[0]}, ${pos[1]})`}
                opacity={dimmed ? 0.22 : 0.95}
                className="cursor-pointer"
                onClick={() => {
                  setFocusRoleId(null);
                  setFocusLookId((cur) => (cur === def.id ? null : def.id));
                }}
              >
                <polygon
                  points={`0,${-s} ${s},0 0,${s} ${-s},0`}
                  fill={DEF_FILL}
                  stroke={
                    def.doubleTeam || pressure > 0.45 ? DOUBLE : DEF_STROKE
                  }
                  strokeWidth={0.45 * S}
                />
                <text
                  textAnchor="middle"
                  y={0.75 * S}
                  fill={DEF_STROKE}
                  fontSize={fontS(def.tag.length > 2 ? 1.55 : 1.75)}
                  fontWeight="700"
                  fontFamily="var(--font-display)"
                >
                  {def.tag}
                </text>
              </g>
            );
          })}

          {/* Offense markers — deconflicted, pullers on top */}
          {sortedRoles.map(({ role, i, pull, pos: truePos }) => {
            const focusedNow = focusRoleId === role.id;
            const dimmed =
              (focusRoleId != null && !focusedNow) ||
              (focusLookId != null &&
                !(
                  look
                    .find((d) => d.id === focusLookId)
                    ?.engagedBy.includes(role.id) ?? false
                ));
            const [dx, dy] = displayPos.get(role.id) ?? truePos;
            const r =
              (pull
                ? focusedNow
                  ? 2.85
                  : 2.55
                : focusedNow
                  ? 2.65
                  : 2.25) * S;
            const hue = roleColor(i);
            return (
              <g
                key={role.id}
                transform={`translate(${dx}, ${dy})`}
                opacity={dimmed ? 0.22 : 1}
                className="cursor-pointer"
                onClick={() => {
                  setFocusLookId(null);
                  setFocusRoleId((cur) => (cur === role.id ? null : role.id));
                }}
              >
                {pull && (
                  <circle
                    r={r + 1.0 * S}
                    fill="none"
                    stroke={hue}
                    strokeWidth={0.4 * S}
                    opacity={0.75}
                    strokeDasharray="1 0.7"
                    filter="url(#softGlow)"
                  />
                )}
                <circle
                  r={r}
                  fill={hue}
                  stroke={pull ? "#fff" : "var(--color-bg)"}
                  strokeWidth={(pull ? 0.65 : 0.4) * S}
                />
                <text
                  textAnchor="middle"
                  y={0.85 * S}
                  fill={pull ? "#1a1a1a" : "var(--color-bg)"}
                  fontSize={fontS(role.tag.length > 2 ? 1.7 : 1.95)}
                  fontWeight="800"
                  fontFamily="var(--font-display)"
                >
                  {role.tag}
                </text>
                {(pull || focusedNow || immersive) && (
                  <text
                    textAnchor="middle"
                    y={-(r + 1.55 * S)}
                    fill={hue}
                    fontSize={fontS(1.85)}
                    fontWeight="700"
                    fontFamily="var(--font-display)"
                    stroke="var(--color-surface)"
                    strokeWidth={0.55 * S}
                    paintOrder="stroke"
                  >
                    {pull ? `${role.tag} pull` : role.tag}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        </div>

        {hasLook && showLook && (
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-border)] px-3 py-2 text-[10px] text-[var(--color-subtle)]",
              immersive && "shrink-0",
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-full border border-white bg-[var(--color-primary)]" />
              Pull (halo)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-full bg-[var(--color-info)]" />
              Offense
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block size-2.5 shrink-0 rotate-45"
                style={{ background: DEF_FILL, border: `1px solid ${DEF_STROKE}` }}
              />
              Defense
            </span>
          </div>
        )}

      {hasLook && play.lookNote && showLook && !immersive && (
        <p className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs leading-relaxed text-[var(--color-muted)]">
          <span className="font-semibold text-[var(--color-fg)]">
            Reactive D · GOD:{" "}
          </span>
          {play.lookNote}
        </p>
      )}

      <div
        className={cn(
          "flex w-full min-w-0 flex-wrap items-center gap-2",
          immersive &&
            "mt-auto shrink-0 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_96%,transparent)] px-3 py-3 backdrop-blur-md",
        )}
      >
        <Button
          size="sm"
          variant="secondary"
          className="min-h-10 min-w-10 shrink-0"
          onClick={() => goToPhase(0)}
          aria-label="Restart"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="min-h-10 min-w-10 shrink-0"
          onClick={() => goToPhase(phaseIndex - 1)}
          disabled={phaseIndex === 0}
          aria-label="Previous phase"
        >
          <SkipBack className="size-4" />
        </Button>
        <Button
          size="sm"
          className="min-h-10 min-w-[5.5rem] shrink-0"
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
          className="min-h-10 min-w-10 shrink-0"
          onClick={() => goToPhase(phaseIndex + 1)}
          disabled={phaseIndex >= play.phases.length - 1}
          aria-label="Next phase"
        >
          <SkipForward className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="min-h-10 shrink-0"
          onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)}
        >
          <FastForward className="size-4" />
          {speed}×
        </Button>
      </div>

      <div className="flex w-full min-w-0 gap-1.5">
        {play.phases.map((ph, i) => (
          <button
            key={ph.id}
            type="button"
            onClick={() => goToPhase(i)}
            className={cn(
              "h-2 min-w-0 flex-1 rounded-full transition-colors",
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
          <p className="min-w-0 font-display text-lg font-semibold tracking-tight">
            {phase.title}
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {phase.explanation}
        </p>
        <ul className="mt-3 space-y-1.5">
          {phase.coachingPoints.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-[var(--color-fg)]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span className="min-w-0">{c}</span>
            </li>
          ))}
        </ul>
      </section>
      </div>

      {!immersive && (
      <section className="w-full max-w-full min-w-0">
        <ChipRail label={`Offense (${play.roles.length}) — swipe or tap arrows`}>
          {play.roles.map((role, i) => {
            const pull = isPuller(role);
            return (
              <button
                key={role.id}
                type="button"
                role="listitem"
                onClick={() => {
                  setFocusLookId(null);
                  setFocusRoleId((cur) => (cur === role.id ? null : role.id));
                }}
                className={cn(
                  "flex h-10 shrink-0 snap-start items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                  "touch-manipulation whitespace-nowrap",
                  focusRoleId === role.id
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : pull
                      ? "border-[var(--color-border-strong)] bg-[var(--color-elevated)] text-[var(--color-fg)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]",
                )}
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: roleColor(i),
                    color: pull ? "#1a1a1a" : "var(--color-bg)",
                    boxShadow: pull ? `0 0 0 1.5px ${roleColor(i)}` : undefined,
                  }}
                >
                  {role.tag}
                </span>
                <span className="max-w-[4.5rem] truncate">{shortLabel(role)}</span>
                {pull && (
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
                    pull
                  </span>
                )}
              </button>
            );
          })}
        </ChipRail>
        {focused && !focusedLook && (
          <RoleCard
            role={focused}
            color={roleColor(
              Math.max(0, play.roles.findIndex((r) => r.id === focused.id)),
            )}
            pull={isPuller(focused)}
          />
        )}
      </section>
      )}

      {hasLook && showLook && !immersive && (
        <section className="w-full max-w-full min-w-0 pb-2">
          <ChipRail label={`Defense (${look.length}) — swipe or tap arrows`}>
            {look.map((def) => {
              const sample = lookStates.find((s) => s.def.id === def.id);
              return (
                <button
                  key={def.id}
                  type="button"
                  role="listitem"
                  onClick={() => {
                    setFocusRoleId(null);
                    setFocusLookId((cur) => (cur === def.id ? null : def.id));
                  }}
                  className={cn(
                    "flex h-10 shrink-0 snap-start items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                    "touch-manipulation whitespace-nowrap",
                    focusLookId === def.id
                      ? "border-transparent bg-[var(--color-fg)] text-[var(--color-bg)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]",
                  )}
                >
                  <span
                    className="flex size-6 shrink-0 rotate-45 items-center justify-center text-[9px] font-bold"
                    style={{
                      background: DEF_FILL,
                      color: DEF_STROKE,
                      border:
                        def.doubleTeam || (sample?.pressure ?? 0) > 0.4
                          ? `1.5px solid var(--color-primary)`
                          : undefined,
                    }}
                  >
                    <span className="-rotate-45">{def.tag}</span>
                  </span>
                  <span className="max-w-[4.5rem] truncate">{def.tag}</span>
                  {def.doubleTeam && (
                    <span className="text-[9px] font-bold text-[var(--color-primary)]">
                      2T
                    </span>
                  )}
                </button>
              );
            })}
          </ChipRail>
          {focusedLook && <LookCard def={focusedLook} roles={play.roles} />}
        </section>
      )}
    </div>
  );
}

function RoleCard({
  role,
  color,
  pull,
}: {
  role: PlayRole;
  color: string;
  pull?: boolean;
}) {
  return (
    <div className="mt-3 w-full min-w-0 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: color,
            color: pull ? "#1a1a1a" : "var(--color-bg)",
            boxShadow: pull ? `0 0 0 2px ${color}` : undefined,
          }}
        >
          {role.tag}
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold tracking-tight">
            {role.label}
            {pull ? " · Pull" : ""}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-subtle)]">
            Assignment
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
        {role.job}
      </p>
    </div>
  );
}

function LookCard({
  def,
  roles,
}: {
  def: LookDefender;
  roles: PlayRole[];
}) {
  const engagers = def.engagedBy
    .map((id) => roles.find((r) => r.id === id)?.tag ?? id)
    .join(" + ");
  return (
    <div className="mt-3 w-full min-w-0 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex size-8 shrink-0 rotate-45 items-center justify-center text-[10px] font-bold"
          style={{
            background: DEF_FILL,
            color: DEF_STROKE,
            border: def.doubleTeam ? "2px solid var(--color-primary)" : undefined,
          }}
        >
          <span className="-rotate-45">{def.tag}</span>
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold tracking-tight">
            {def.label}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-subtle)]">
            {def.doubleTeam ? "Double / combo" : "Contact"}
            {engagers ? ` · vs ${engagers}` : " · free"}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
        {def.job}
      </p>
    </div>
  );
}
