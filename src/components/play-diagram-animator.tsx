import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
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
  type FieldPoint,
  type LookDefender,
  type Play,
  type PlayRole,
} from "@/data/plays";
import {
  DEF_FRONTS,
  LB_Y,
  LOS_Y,
  buildSimPlay,
  getAssignmentReport,
  classifyDefender,
  type DefFrontId,
} from "@/data/play-looks";
import {
  globalPlayProgress,
  hitboxDefense,
  hitboxOffense,
  sampleBlockPhysics,
} from "@/lib/block-physics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.5, 2] as const;

function schemeCapable(playId: string): boolean {
  return [
    "dive",
    "iso",
    "inside-zone",
    "power",
    "reach",
    "outside-zone",
    "counter-simple",
    "counter",
  ].includes(playId);
}

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
        // Fixed hitbox seats — small shell, gentle correction (no UI-scale inflation)
        const min = a.r + b.r + 0.35;
        if (dist < min) {
          const push = (min - dist) * 0.45;
          const nx = dx / dist;
          const ny = dy / dist;
          const aW = a.priority >= b.priority ? 0.2 : 0.8;
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
  const [frontId, setFrontId] = useState<DefFrontId>("43-over");
  /** generic = install path lines; assignment = GOD paths vs selected front */
  const [olMode, setOlMode] = useState<"generic" | "assignment">("assignment");
  /** Immersive: phase coaching collapsed so diagram owns the screen */
  const [showPhasePanel, setShowPhasePanel] = useState(false);
  const [showImmersiveOpts, setShowImmersiveOpts] = useState(false);
  /** Player bubble size multiplier (0.6–2). Affects OL + D markers for clarity. */
  const [bubbleScale, setBubbleScale] = useState(1);
  /** Diagram zoom 1–2.5 (viewBox) */
  const [zoom, setZoom] = useState(1);
  const [customPos, setCustomPos] = useState<Record<string, FieldPoint>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);

  const posOverrides = frontId === "custom" ? customPos : undefined;
  const simPlay = useMemo(
    () =>
      play.side === "offense"
        ? buildSimPlay(play, frontId, olMode, posOverrides)
        : play,
    [play, frontId, olMode, posOverrides],
  );
  const assignReport = useMemo(
    () =>
      play.side === "offense"
        ? getAssignmentReport(play.id, frontId, posOverrides)
        : null,
    [play.id, play.side, frontId, posOverrides],
  );
  const phase = simPlay.phases[phaseIndex] ?? simPlay.phases[0]!;
  const speed = SPEEDS[speedIdx]!;
  const look = simPlay.look ?? [];
  const hasLook = look.length > 0 && simPlay.side === "offense";
  const canSwitchFront = play.side === "offense" && Boolean(schemeCapable(play.id));

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
    setShowPhasePanel(false);
    setShowImmersiveOpts(false);
    setOlMode("assignment");
    setCustomPos({});
    setDragId(null);
    phaseRef.current = 0;
    progressRef.current = 0;
    playingRef.current = false;
    lastTs.current = null;
  }, [play.id]);

  useEffect(() => {
    setPhaseIndex(0);
    setProgress(0);
    setPlaying(false);
    phaseRef.current = 0;
    progressRef.current = 0;
    playingRef.current = false;
    lastTs.current = null;
  }, [frontId, olMode]);

  useEffect(() => {
    if (frontId !== "custom") return;
    if (Object.keys(customPos).length > 0) return;
    const look = buildSimPlay(play, "43-over", "generic").look ?? [];
    const seed: Record<string, FieldPoint> = {};
    for (const d of look) {
      const pt = d.path[0];
      if (pt) seed[d.id] = [pt[0], pt[1]];
    }
    setCustomPos(seed);
  }, [frontId, play, customPos]);

  useEffect(() => {
    if (immersive) {
      setShowPhasePanel(false);
      setShowImmersiveOpts(false);
    }
  }, [immersive]);

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
      const next = Math.max(0, Math.min(simPlay.phases.length - 1, index));
      phaseRef.current = next;
      progressRef.current = 0;
      lastTs.current = null;
      setPhaseIndex(next);
      setProgress(0);
      playingRef.current = false;
      setPlaying(false);
    },
    [simPlay.phases.length],
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
      const ph = simPlay.phases[pIdx]!;
      const next = progressRef.current + dt / ph.durationMs;

      if (next >= 1) {
        if (pIdx >= simPlay.phases.length - 1) {
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
  }, [playing, reducedMotion, simPlay.phases]);

  const roleStates = useMemo(() => {
    // Full-play timeline: every role rides 0→1 over the same total duration
    const g = globalPlayProgress(simPlay, phaseIndex, progress);
    const t = easeInOut(g);
    return simPlay.roles.map((role, i) => {
      const along = t;
      const pos = pointAlongPath(role.path, along);
      const pull = isPuller(role);
      return { role, i, along, pos, trail: role.path, pull };
    });
  }, [simPlay, phaseIndex, progress]);

  const physics = useMemo(() => {
    if (!hasLook || !showLook) return null;
    return sampleBlockPhysics(simPlay, phaseIndex, progress);
  }, [simPlay, phaseIndex, progress, hasLook, showLook]);

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

  /**
   * Display deconflict uses FIXED field-unit hitboxes — never bubbleScale/zoom.
   * Visual marker size can change; collision seats stay stable.
   */
  const displayPos = useMemo(() => {
    const items: {
      id: string;
      x: number;
      y: number;
      r: number;
      priority: number;
    }[] = [];
    for (const s of roleStates) {
      const focused = focusRoleId === s.role.id;
      // Physics-stable radius only (slight pad for readability, not UI scale)
      const r = hitboxOffense(s.role.id) + (s.pull ? 0.25 : focused ? 0.2 : 0.1);
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
  }, [roleStates, focusRoleId, phaseIndex]);

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
      ? simPlay.roles.find((r) => r.id === focusRoleId)
      : (simPlay.roles.find((r) => r.highlightPhases?.includes(phaseIndex)) ??
        simPlay.roles[0]);

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

  const S = (immersive ? 1.2 : 1.08) * bubbleScale;
  const pathW = (base: number) => base * S;
  const fontS = (base: number) => base * S;
  const customMode = frontId === "custom" && hasLook;

  const clientToField = useCallback(
    (clientX: number, clientY: number): FieldPoint | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const loc = pt.matrixTransform(ctm.inverse());
      return [
        Math.min(94, Math.max(6, loc.x)),
        Math.min(94, Math.max(6, loc.y)),
      ];
    },
    [],
  );

  const onDefPointerDown = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (!customMode) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDragId(id);
      setPlaying(false);
      playingRef.current = false;
    },
    [customMode],
  );

  const onDefPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragId || !customMode) return;
      const fp = clientToField(e.clientX, e.clientY);
      if (!fp) return;
      setCustomPos((prev) => ({ ...prev, [dragId]: fp }));
    },
    [dragId, customMode, clientToField],
  );

  const onDefPointerUp = useCallback(() => {
    setDragId(null);
  }, []);

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
            immersive && "shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5",
          )}
        >
          <div className="min-w-0 flex-1 basis-[8rem]">
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              {immersive ? play.name : play.formation}
            </p>
            {!immersive && hasLook && simPlay.lookFront && (
              <p className="truncate text-[10px] text-[var(--color-muted)]">
                vs {simPlay.lookFront}
                {olMode === "assignment" ? " · assignment" : " · generic"}
              </p>
            )}
            {immersive && (
              <p className="truncate text-[10px] text-[var(--color-muted)]">
                {simPlay.lookFront
                  ? `vs ${DEF_FRONTS.find((f) => f.id === frontId)?.short ?? frontId}`
                  : play.formation}
                {" · "}
                Phase {phaseIndex + 1}/{simPlay.phases.length}
              </p>
            )}
          </div>
          <div className="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-1.5">
            {!immersive && (
              <p className="text-[11px] font-semibold tabular-nums text-[var(--color-muted)]">
                {simPlay.roles.length}
                {hasLook && showLook ? ` + ${look.length} D` : ""} players
              </p>
            )}
            {hasLook && (
              <button
                type="button"
                onClick={() => setShowLook((v) => !v)}
                className={cn(
                  "h-8 shrink-0 rounded-full border px-2.5 text-[10px] font-semibold touch-manipulation",
                  showLook
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {showLook ? "D on" : "D off"}
              </button>
            )}
            {immersive && (
              <button
                type="button"
                onClick={() => setShowImmersiveOpts((v) => !v)}
                className={cn(
                  "h-8 shrink-0 rounded-full border px-2.5 text-[10px] font-semibold touch-manipulation",
                  showImmersiveOpts
                    ? "border-transparent bg-[var(--color-elevated)] text-[var(--color-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                Fronts
              </button>
            )}
            <button
              type="button"
              onClick={() => setImmersive((v) => !v)}
              aria-label={immersive ? "Exit full screen" : "Full screen HD"}
              className={cn(
                "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[10px] font-semibold touch-manipulation",
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
              "flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[var(--color-surface)]",
          )}
        >
        <svg
          ref={svgRef}
          viewBox={(() => {
            const size = 100 / zoom;
            const origin = (100 - size) / 2;
            // Bias slightly toward LOS / box for coaching readability
            const oy = origin + (zoom > 1 ? -2 * (zoom - 1) : 0);
            return `${origin} ${oy} ${size} ${size}`;
          })()}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "w-full max-w-full touch-none",
            immersive ? "h-full min-h-0 w-full max-h-full" : "aspect-[5/6]",
            customMode && "cursor-crosshair",
          )}
          style={{ shapeRendering: "geometricPrecision", textRendering: "geometricPrecision" }}
          role="img"
          aria-label={`${simPlay.name} play diagram · ${simPlay.lookFront ?? ""}`}
          onPointerMove={onDefPointerMove}
          onPointerUp={onDefPointerUp}
          onPointerLeave={onDefPointerUp}
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
          {[20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map((y) => (
            <line
              key={`yl-${y}`}
              x1="5"
              x2="95"
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={y === LOS_Y ? 0.75 * S : y % 10 === 0 ? 0.35 * S : 0.22 * S}
              strokeDasharray={y === LOS_Y ? undefined : y % 10 === 0 ? undefined : "0.8 1.2"}
              opacity={y === LOS_Y ? 0.95 : y % 10 === 0 ? 0.55 : 0.28}
            />
          ))}
          {[20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map((y) => (
            <g key={`hash-${y}`} opacity={y === LOS_Y ? 0.85 : 0.5}>
              <line x1="34" x2="36.5" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.4 * S} />
              <line x1="63.5" x2="66" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.4 * S} />
            </g>
          ))}
          {[20, 30, 40, 50, 60, 70, 80].map((y) => (
            <g key={`side-${y}`} opacity={0.35}>
              <line x1="5" x2="7.5" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.35 * S} />
              <line x1="92.5" x2="95" y1={y} y2={y} stroke="var(--color-fg)" strokeWidth={0.35 * S} />
            </g>
          ))}
          <line
            x1="8"
            x2="92"
            y1={LB_Y}
            y2={LB_Y}
            stroke="var(--color-info)"
            strokeWidth={0.25 * S}
            strokeDasharray="1.2 1.4"
            opacity={0.45}
          />
          <text x="8.5" y={LB_Y - 0.8} fill="var(--color-info)" fontSize={fontS(1.5)} fontFamily="var(--font-body)" opacity={0.7}>
            LB 4yd
          </text>
          <text x="50" y="51.9" textAnchor="middle" fill="var(--color-subtle)" fontSize={fontS(2.4)} fontFamily="var(--font-body)" fontWeight="600" opacity={0.75}>
            LOS
          </text>
          {customMode && (
            <text x="50" y="8" textAnchor="middle" fill="var(--color-primary)" fontSize={fontS(2.1)} fontWeight="700" fontFamily="var(--font-display)">
              CUSTOM — drag D to re-assign
            </text>
          )}
          {/* Drive paths — desired displacement angle for engaged defenders */}
          {hasLook &&
            showLook &&
            look.map((def) => {
              const dp = def.drivePath;
              if (!dp || dp.length < 2) return null;
              const d = dp
                .map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(2)},${pt[1].toFixed(2)}`)
                .join(" ");
              const end = dp[dp.length - 1]!;
              const eng = def.engagedBy.length > 0;
              return (
                <g key={`drive-${def.id}`} opacity={eng ? 0.85 : 0.28}>
                  <path
                    d={d}
                    fill="none"
                    stroke={eng ? "var(--color-warning, #e6a23c)" : "var(--color-subtle)"}
                    strokeWidth={pathW(eng ? 0.55 : 0.3)}
                    strokeDasharray={eng ? "1.4 0.7" : "0.8 1"}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {eng && (
                    <polygon
                      points={`${end[0]},${end[1] - 0.9} ${end[0] + 0.7},${end[1] + 0.5} ${end[0] - 0.7},${end[1] + 0.5}`}
                      fill="var(--color-warning, #e6a23c)"
                      opacity={0.9}
                    />
                  )}
                </g>
              );
            })}

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
            // True physics hitbox (field units) — independent of zoom / bubble size
            const hb = hitboxDefense(classifyDefender(def));
            return (
              <g
                key={def.id}
                transform={`translate(${pos[0]}, ${pos[1]})`}
                opacity={dimmed ? 0.22 : 0.95}
                className={cn("cursor-pointer", customMode && "cursor-grab active:cursor-grabbing")}
                onPointerDown={(e) => onDefPointerDown(def.id, e)}
                onClick={() => {
                  if (customMode) return;
                  setFocusRoleId(null);
                  setFocusLookId((cur) => (cur === def.id ? null : def.id));
                }}
              >
                {/* Fixed collision radius — does not scale with Size/Zoom UI */}
                <circle
                  r={hb}
                  fill="none"
                  stroke={DEF_STROKE}
                  strokeWidth={0.12}
                  opacity={0.28}
                  vectorEffect="non-scaling-stroke"
                />
                {customMode && (
                  <circle r={s + 1.2} fill="none" stroke="var(--color-primary)" strokeWidth={0.3 * S} strokeDasharray="0.6 0.5" opacity={dragId === def.id ? 0.9 : 0.35} />
                )}
                <polygon
                  points={`0,${-s} ${s},0 0,${s} ${-s},0`}
                  fill={DEF_FILL}
                  stroke={def.doubleTeam || pressure > 0.45 || customMode ? DOUBLE : DEF_STROKE}
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
            const hb = hitboxOffense(role.id);
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
                <circle
                  r={hb}
                  fill="none"
                  stroke="var(--color-fg)"
                  strokeWidth={0.12}
                  opacity={0.2}
                  vectorEffect="non-scaling-stroke"
                />
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
                {(pull || focusedNow) && (
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

        {hasLook && showLook && !immersive && (
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-border)] px-3 py-2 text-[10px] text-[var(--color-subtle)]"
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
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-3 shrink-0 rounded-full bg-[var(--color-warning,#e6a23c)]" />
              Drive path
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 shrink-0 rounded-full border border-[var(--color-muted)]" />
              Hitbox (fixed)
            </span>
          </div>
        )}

      {canSwitchFront && !immersive && (
        <div className="w-full max-w-full min-w-0 space-y-3">
          <div className="flex w-full min-w-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOlMode("generic")}
              className={cn(
                "h-10 min-w-0 flex-1 rounded-[var(--radius-md)] border px-3 text-xs font-semibold touch-manipulation",
                olMode === "generic"
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              Generic paths
            </button>
            <button
              type="button"
              onClick={() => setOlMode("assignment")}
              className={cn(
                "h-10 min-w-0 flex-1 rounded-[var(--radius-md)] border px-3 text-xs font-semibold touch-manipulation",
                olMode === "assignment"
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              Blocking assignment
            </button>
          </div>
          <div className="w-full max-w-full min-w-0">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Defensive front
            </p>
            <div className="flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 [scrollbar-width:thin]">
              {DEF_FRONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    if (f.id === "custom") setCustomPos({});
                    setFrontId(f.id);
                    setFocusLookId(null);
                    goToPhase(0);
                  }}
                  className={cn(
                    "h-10 shrink-0 snap-start rounded-full border px-3.5 text-xs font-semibold touch-manipulation",
                    frontId === f.id
                      ? "border-transparent bg-[var(--color-fg)] text-[var(--color-bg)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                  )}
                  title={f.blurb}
                >
                  {f.short}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-subtle)]">
              {DEF_FRONTS.find((f) => f.id === frontId)?.blurb}
              {olMode === "assignment"
                ? " · OL tracks recompute to this front."
                : " · Showing install movement lines."}
            </p>
          </div>
        </div>
      )}

      {canSwitchFront && immersive && showImmersiveOpts && (
        <div className="shrink-0 space-y-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setOlMode("generic")}
              className={cn(
                "h-8 min-w-0 flex-1 rounded-full border text-[10px] font-semibold",
                olMode === "generic"
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]",
              )}
            >
              Generic
            </button>
            <button
              type="button"
              onClick={() => setOlMode("assignment")}
              className={cn(
                "h-8 min-w-0 flex-1 rounded-full border text-[10px] font-semibold",
                olMode === "assignment"
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]",
              )}
            >
              Assignment
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain touch-pan-x">
            {DEF_FRONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  if (f.id === "custom") setCustomPos({});
                  setFrontId(f.id);
                  goToPhase(0);
                }}
                className={cn(
                  "h-8 shrink-0 rounded-full border px-2.5 text-[10px] font-semibold",
                  frontId === f.id
                    ? "border-transparent bg-[var(--color-fg)] text-[var(--color-bg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {f.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasLook && simPlay.lookNote && showLook && !immersive && (
        <div className="space-y-2">
          <p className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs leading-relaxed text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-fg)]">
              {assignReport?.schemeUsesGod ? "GOD ON · " : "GOD limited · "}
            </span>
            {simPlay.lookNote}
          </p>
          {customMode && (
            <p className="rounded-[var(--radius-lg)] border border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_35%,var(--color-surface))] px-3 py-2 text-xs leading-relaxed text-[var(--color-fg)]">
              <span className="font-semibold text-[var(--color-primary)]">Custom front: </span>
              Drag any diamond. Gaps and every OL assignment recompute live.
              <button type="button" className="ml-2 font-semibold underline" onClick={() => setCustomPos({})}>
                Reset alignment
              </button>
            </p>
          )}
          {assignReport && olMode === "assignment" && (
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                Player assignments · {assignReport.frontLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">{assignReport.schemeNote}</p>
              {assignReport.gaps.length > 0 && (
                <p className="mt-2 text-[11px] text-[var(--color-subtle)]">
                  Gaps: {assignReport.gaps.slice(0, 5).map((g) => g.label).join(" · ")}
                </p>
              )}
              <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto overscroll-contain">
                {(["lt", "lg", "c", "rg", "rt", "y", "fb"] as const).map((id) => {
                  const r = assignReport.roles.find((x) => x.roleId === id);
                  if (!r) return null;
                  return (
                    <li key={id} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-2.5 py-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-sm font-semibold uppercase text-[var(--color-fg)]">{r.roleId}</span>
                        <Badge variant={r.usesGod ? "default" : "outline"} className="text-[10px]">
                          {r.usesGod ? "GOD" : "not GOD"}
                        </Badge>
                        <span className="text-[10px] uppercase tracking-wide text-[var(--color-subtle)]">{r.rule}</span>
                        {r.targetTags.length > 0 && (
                          <span className="text-[11px] text-[var(--color-primary)]">→ {r.targetTags.join("+")}</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">{r.why}</p>
                      {r.whyNotGod && (
                        <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-subtle)]">Why not GOD: {r.whyNotGod}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex w-full min-w-0 flex-col gap-2",
          immersive &&
            "mt-auto shrink-0 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_97%,transparent)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md",
        )}
      >
        <div className={cn("flex w-full min-w-0 flex-col gap-1.5", immersive && "gap-1")}>
        <label
          className={cn(
            "flex w-full min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5",
            immersive && "py-1",
          )}
        >
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-subtle)]" title="Visual only — physics hitboxes stay fixed">
            Size
          </span>
          <span
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[8px] font-bold text-[var(--color-primary-fg)]"
            aria-hidden
            style={{
              transform: `scale(${0.65 + bubbleScale * 0.35})`,
            }}
          >
            O
          </span>
          <input
            type="range"
            min={0.6}
            max={2}
            step={0.05}
            value={bubbleScale}
            onChange={(e) => setBubbleScale(Number(e.target.value))}
            aria-label="Player bubble size"
            className={cn(
              "min-w-0 flex-1 cursor-pointer appearance-none bg-transparent",
              "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full",
              "[&::-webkit-slider-runnable-track]:bg-[var(--color-border-strong)]",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:mt-[-5px]",
              "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-bg)]",
              "[&::-webkit-slider-thumb]:bg-[var(--color-primary)]",
              "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full",
              "[&::-moz-range-track]:bg-[var(--color-border-strong)]",
              "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--color-primary)]",
            )}
          />
          <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[var(--color-muted)]">
            {Math.round(bubbleScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setBubbleScale(1)}
            className="h-7 shrink-0 rounded-full border border-[var(--color-border)] px-2 text-[10px] font-semibold text-[var(--color-muted)] touch-manipulation disabled:opacity-40"
            disabled={Math.abs(bubbleScale - 1) < 0.01}
            aria-label="Reset bubble size"
          >
            Reset
          </button>
        </label>
        <label
          className={cn(
            "flex w-full min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5",
            immersive && "py-1",
          )}
        >
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-subtle)]">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Diagram zoom"
            className={cn(
              "min-w-0 flex-1 cursor-pointer appearance-none bg-transparent",
              "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full",
              "[&::-webkit-slider-runnable-track]:bg-[var(--color-border-strong)]",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:mt-[-5px]",
              "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-bg)]",
              "[&::-webkit-slider-thumb]:bg-[var(--color-info)]",
              "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full",
              "[&::-moz-range-track]:bg-[var(--color-border-strong)]",
              "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--color-info)]",
            )}
          />
          <span className="w-10 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[var(--color-muted)]">
            {zoom.toFixed(2)}×
          </span>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="h-7 shrink-0 rounded-full border border-[var(--color-border)] px-2 text-[10px] font-semibold text-[var(--color-muted)] touch-manipulation disabled:opacity-40"
            disabled={Math.abs(zoom - 1) < 0.01}
            aria-label="Reset zoom"
          >
            Reset
          </button>
        </label>
        </div>
        <div
          className={cn(
            "flex w-full min-w-0 flex-wrap items-center gap-2",
            immersive && "gap-1.5",
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            className={cn("shrink-0", immersive ? "h-9 min-h-9 min-w-9 px-0" : "min-h-10 min-w-10")}
            onClick={() => goToPhase(0)}
            aria-label="Restart"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className={cn("shrink-0", immersive ? "h-9 min-h-9 min-w-9 px-0" : "min-h-10 min-w-10")}
            onClick={() => goToPhase(phaseIndex - 1)}
            disabled={phaseIndex === 0}
            aria-label="Previous phase"
          >
            <SkipBack className="size-4" />
          </Button>
          <Button
            size="sm"
            className={cn(
              "shrink-0",
              immersive ? "h-9 min-h-9 min-w-[4.75rem] px-2" : "min-h-10 min-w-[5.5rem]",
            )}
            onClick={() => {
              if (reducedMotion) {
                goToPhase(
                  phaseIndex >= simPlay.phases.length - 1 ? 0 : phaseIndex + 1,
                );
                return;
              }
              if (progress >= 1 && phaseIndex >= simPlay.phases.length - 1) {
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
            className={cn("shrink-0", immersive ? "h-9 min-h-9 min-w-9 px-0" : "min-h-10 min-w-10")}
            onClick={() => goToPhase(phaseIndex + 1)}
            disabled={phaseIndex >= simPlay.phases.length - 1}
            aria-label="Next phase"
          >
            <SkipForward className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn("shrink-0", immersive ? "h-9 min-h-9 px-2" : "min-h-10")}
            onClick={() => setSpeedIdx((s) => (s + 1) % SPEEDS.length)}
          >
            <FastForward className="size-4" />
            {speed}×
          </Button>
          {immersive && (
            <Button
              size="sm"
              variant={showPhasePanel ? "secondary" : "outline"}
              className="ml-auto h-9 min-h-9 shrink-0 px-2.5"
              onClick={() => setShowPhasePanel((v) => !v)}
              aria-expanded={showPhasePanel}
              aria-label={showPhasePanel ? "Hide phase notes" : "Show phase notes"}
            >
              {showPhasePanel ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronUp className="size-4" />
              )}
              Notes
            </Button>
          )}
        </div>

        <div className={cn("flex w-full min-w-0 gap-1.5", immersive && "px-0.5")}>
          {simPlay.phases.map((ph, i) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => goToPhase(i)}
              className={cn(
                "min-w-0 flex-1 rounded-full transition-colors",
                immersive ? "h-1.5" : "h-2",
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

        {/* Compact phase title always visible in immersive; full text expands */}
        {immersive && !showPhasePanel && (
          <p className="truncate px-0.5 text-center text-[11px] font-medium text-[var(--color-muted)]">
            <span className="text-[var(--color-subtle)]">
              {phaseIndex + 1}/{simPlay.phases.length}
            </span>
            {" · "}
            {phase.title}
            <span className="text-[var(--color-subtle)]"> · tap Notes</span>
          </p>
        )}

        {(!immersive || showPhasePanel) && (
          <section
            className={cn(
              "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
              immersive &&
                "max-h-[38dvh] overflow-y-auto rounded-[var(--radius-lg)] p-3",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                Phase {phaseIndex + 1}/{simPlay.phases.length}
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
        )}
      </div>
      </div>

      {!immersive && (
      <section className="w-full max-w-full min-w-0">
        <ChipRail label={`Offense (${simPlay.roles.length}) — swipe or tap arrows`}>
          {simPlay.roles.map((role, i) => {
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
              Math.max(0, simPlay.roles.findIndex((r) => r.id === focused.id)),
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
