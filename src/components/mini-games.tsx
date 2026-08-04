import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MiniId =
  | "reaction"
  | "pattern-race"
  | "whistle-chase"
  | "four-corner"
  | "mirror-match"
  | "ball-secure"
  | "red-light"
  | "steal-bacon"
  | "pursuit-tap";

export function MiniGame({ id }: { id: MiniId }) {
  if (id === "reaction") return <ReactionWars />;
  if (id === "pattern-race") return <PatternRace />;
  if (id === "whistle-chase") return <WhistleChase />;
  if (id === "four-corner") return <FourCornerCall />;
  if (id === "mirror-match") return <MirrorMatch />;
  if (id === "ball-secure") return <BallSecure />;
  if (id === "red-light") return <RedLightGame />;
  if (id === "steal-bacon") return <StealBacon />;
  return <PursuitTap />;
}

type Cue = "forward" | "left" | "right" | "back";

const CUE_META: Record<Cue, { label: string; blasts: number }> = {
  forward: { label: "Sprint forward", blasts: 1 },
  right: { label: "Shuffle right", blasts: 2 },
  left: { label: "Shuffle left", blasts: 3 },
  back: { label: "Backpedal", blasts: 1 },
};

function ReactionWars() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [cue, setCue] = useState<Cue | null>(null);
  const [phase, setPhase] = useState<"idle" | "wait" | "go" | "result" | "over">("idle");
  const [msg, setMsg] = useState("Tap Play, then react to the whistle code.");
  const [flash, setFlash] = useState(false);
  const goAt = useRef(0);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const startRound = useCallback(() => {
    clearTimer();
    setPhase("wait");
    setCue(null);
    setMsg("Listen…");
    setFlash(false);
    const delay = 800 + Math.random() * 1600;
    const opts: Cue[] = ["forward", "left", "right", "back"];
    const next = opts[Math.floor(Math.random() * opts.length)]!;
    timer.current = window.setTimeout(() => {
      setCue(next);
      setPhase("go");
      goAt.current = performance.now();
      setFlash(true);
      setMsg(
        next === "back"
          ? "LONG whistle — backpedal!"
          : `${CUE_META[next].blasts} whistle${CUE_META[next].blasts > 1 ? "s" : ""} — ${CUE_META[next].label}!`,
      );
      timer.current = window.setTimeout(() => {
        setLives((l) => {
          const n = l - 1;
          if (n <= 0) {
            setPhase("over");
            setMsg("Out of lives — replay to train again.");
          } else {
            setPhase("result");
            setMsg("Too slow. −1 life");
          }
          return n;
        });
      }, 1400);
    }, delay);
  }, []);

  useEffect(() => () => clearTimer(), []);

  function answer(choice: Cue) {
    if (phase !== "go" || !cue) return;
    clearTimer();
    const rt = Math.round(performance.now() - goAt.current);
    setFlash(false);
    setRound((r) => r + 1);
    if (choice === cue) {
      const pts = Math.max(50, 400 - rt);
      setScore((s) => s + pts);
      setMsg(`Correct · ${rt}ms · +${pts}`);
      setPhase("result");
    } else {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setPhase("over");
          setMsg("Wrong direction — game over.");
        } else {
          setPhase("result");
          setMsg(`Wrong — needed ${CUE_META[cue].label}. −1 life`);
        }
        return n;
      });
    }
  }

  function reset() {
    clearTimer();
    setScore(0);
    setLives(3);
    setRound(0);
    setCue(null);
    setPhase("idle");
    setMsg("Tap Play, then react to the whistle code.");
  }

  return (
    <GameShell
      title="Whistle Reaction"
      subtitle="1 forward · 2 right · 3 left · long = back"
      score={score}
      meta={`Lives ${lives} · Round ${round}`}
    >
      <div
        className={cn(
          "mb-3 rounded-[var(--radius-lg)] border px-3 py-6 text-center transition-colors",
          flash
            ? "border-[color-mix(in_oklab,var(--color-primary)_45%,var(--color-border))] bg-[var(--color-primary-dim)]"
            : "border-[var(--color-border)] bg-[var(--color-elevated)]",
        )}
      >
        <p className="text-sm font-medium text-[var(--color-fg)]">{msg}</p>
        {cue && phase === "go" && (
          <p className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary)]">
            {CUE_META[cue].label}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["forward", "Forward"],
            ["back", "Back"],
            ["left", "Left"],
            ["right", "Right"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="lg"
            variant={phase === "go" ? "default" : "secondary"}
            disabled={phase !== "go"}
            onClick={() => answer(key)}
            className="h-14"
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        {phase === "over" ? (
          <Button className="flex-1" onClick={reset}>
            <RotateCcw aria-hidden /> Replay
          </Button>
        ) : phase === "wait" || phase === "go" ? (
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => {
              clearTimer();
              setPhase("idle");
              setMsg("Stopped.");
            }}
          >
            <Pause aria-hidden /> Stop
          </Button>
        ) : (
          <Button className="flex-1" onClick={startRound} disabled={lives <= 0}>
            <Play aria-hidden /> {phase === "idle" ? "Play" : "Next rep"}
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function PatternRace() {
  const [seq, setSeq] = useState(() => randomPattern(4));
  const [input, setInput] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"watch" | "go" | "won" | "lost">("watch");
  const [level, setLevel] = useState(1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (status !== "watch") return;
    setTick(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTick(i);
      if (i >= seq.length) {
        window.clearInterval(id);
        window.setTimeout(() => setStatus("go"), 400);
      }
    }, 550);
    return () => window.clearInterval(id);
  }, [status, seq]);

  function tap(c: string) {
    if (status !== "go") return;
    const next = [...input, c];
    setInput(next);
    const idx = next.length - 1;
    if (next[idx] !== seq[idx]) {
      setStatus("lost");
      return;
    }
    if (next.length === seq.length) {
      setScore((s) => s + 100 * level);
      setStatus("won");
    }
  }

  function nextLevel() {
    const n = Math.min(7, 3 + level);
    setLevel((l) => l + 1);
    setSeq(randomPattern(n));
    setInput([]);
    setStatus("watch");
  }

  function reset() {
    setLevel(1);
    setScore(0);
    setSeq(randomPattern(4));
    setInput([]);
    setStatus("watch");
  }

  const revealingAt = status === "watch" && tick > 0 && tick <= seq.length ? tick - 1 : -1;
  const revealingCorner = revealingAt >= 0 ? seq[revealingAt] : null;

  return (
    <GameShell
      title="Pattern Race"
      subtitle="Memorize cone order, then tap it back"
      score={score}
      meta={`Level ${level}`}
    >
      <div className="mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 text-center">
        <p className="text-xs text-[var(--color-subtle)]">
          {status === "watch" && "Watch the sequence…"}
          {status === "go" && "Your turn — tap cones in order"}
          {status === "won" && "Clean run — next level!"}
          {status === "lost" && "Missed a cone — try again"}
        </p>
        <div className="mx-auto mt-3 grid max-w-[200px] grid-cols-2 gap-2">
          {(["TL", "TR", "BL", "BR"] as const).map((c) => {
            const lit = status === "watch" && revealingCorner === c;
            const isNext = status === "go" && seq[input.length] === c;
            const revealCount =
              status === "watch" && lit
                ? seq.slice(0, tick).filter((x) => x === c).length
                : 0;
            return (
              <button
                key={c}
                type="button"
                disabled={status !== "go"}
                onClick={() => tap(c)}
                className={cn(
                  "relative h-16 rounded-[var(--radius-md)] border text-sm font-semibold transition-colors",
                  lit || isNext
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {c}
                {lit && (
                  <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-[var(--color-primary-fg)]">
                    {revealCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] tabular text-[var(--color-subtle)]">
          {status === "watch"
            ? `Showing ${Math.min(tick, seq.length)}/${seq.length}`
            : `Input: ${input.join(" → ") || "—"}`}
        </p>
      </div>
      <div className="flex gap-2">
        {status === "won" ? (
          <Button className="flex-1" onClick={nextLevel}>
            <Zap aria-hidden /> Next level
          </Button>
        ) : (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <RotateCcw aria-hidden /> {status === "lost" ? "Retry" : "Restart"}
          </Button>
        )}
      </div>
    </GameShell>
  );
}

function randomPattern(len = 4): string[] {
  const corners = ["TL", "TR", "BR", "BL"];
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    let c = corners[Math.floor(Math.random() * 4)]!;
    while (out.length && c === out[out.length - 1]) {
      c = corners[Math.floor(Math.random() * 4)]!;
    }
    out.push(c);
  }
  return out;
}

function WhistleChase() {
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [hits, setHits] = useState(0);
  const [miss, setMiss] = useState(0);
  const [windowOpen, setWindowOpen] = useState(false);
  const [msg, setMsg] = useState("Stay on tempo — tap each leave whistle.");
  const nextBeat = useRef(0);
  const openRef = useRef(false);
  const raf = useRef<number | null>(null);
  const missTimer = useRef<number | null>(null);
  const intervalMs = 1500;

  useEffect(() => {
    if (!running) {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (missTimer.current) window.clearTimeout(missTimer.current);
      return;
    }
    nextBeat.current = performance.now() + 900;
    const loop = (ts: number) => {
      if (ts >= nextBeat.current) {
        setBeat((b) => b + 1);
        openRef.current = true;
        setWindowOpen(true);
        setMsg("LEAVE — tap!");
        nextBeat.current = ts + intervalMs;
        if (missTimer.current) window.clearTimeout(missTimer.current);
        missTimer.current = window.setTimeout(() => {
          if (openRef.current) {
            openRef.current = false;
            setWindowOpen(false);
            setMiss((m) => m + 1);
            setMsg("Missed leave window");
          }
        }, 480);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (missTimer.current) window.clearTimeout(missTimer.current);
    };
  }, [running]);

  function tap() {
    if (!running) return;
    if (openRef.current) {
      openRef.current = false;
      setWindowOpen(false);
      setHits((h) => h + 1);
      setMsg("Clean leave");
      if (missTimer.current) window.clearTimeout(missTimer.current);
    } else {
      setMiss((m) => m + 1);
      setMsg("Early/late — stay on the clock");
    }
  }

  const score = Math.max(0, hits * 100 - miss * 40);

  return (
    <GameShell
      title="Tempo Train"
      subtitle="Tap in the leave window every 1.5s"
      score={score}
      meta={`Hits ${hits} · Miss ${miss} · Beat ${beat}`}
    >
      <button
        type="button"
        onClick={tap}
        className={cn(
          "mb-3 flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-xl)] border text-center transition-colors",
          windowOpen
            ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]"
            : "border-[var(--color-border)] bg-[var(--color-elevated)]",
        )}
      >
        <span className="font-display text-3xl font-semibold tabular text-[var(--color-fg)]">
          {windowOpen ? "GO" : "…"}
        </span>
        <span className="mt-1 text-xs text-[var(--color-muted)]">{msg}</span>
      </button>
      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => setRunning((r) => !r)}>
          {running ? (
            <>
              <Pause aria-hidden /> Pause
            </>
          ) : (
            <>
              <Play aria-hidden /> Start tempo
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setRunning(false);
            setBeat(0);
            setHits(0);
            setMiss(0);
            openRef.current = false;
            setWindowOpen(false);
            setMsg("Stay on tempo — tap each leave whistle.");
          }}
        >
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

const CORNERS = [
  { id: "1", label: "NW", x: "left", y: "top" },
  { id: "2", label: "NE", x: "right", y: "top" },
  { id: "3", label: "SW", x: "left", y: "bottom" },
  { id: "4", label: "SE", x: "right", y: "bottom" },
] as const;

function FourCornerCall() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "call" | "result" | "over">("idle");
  const [msg, setMsg] = useState("Coach calls a corner — get there first.");
  const [timeLeft, setTimeLeft] = useState(0);
  const goAt = useRef(0);
  const timer = useRef<number | null>(null);
  const tick = useRef<number | null>(null);

  const clearAll = () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (tick.current) window.clearInterval(tick.current);
    timer.current = null;
    tick.current = null;
  };

  useEffect(() => () => clearAll(), []);

  function startRound() {
    clearAll();
    const next = CORNERS[Math.floor(Math.random() * CORNERS.length)]!.id;
    setTarget(next);
    setPhase("call");
    setMsg(`Corner ${next}!`);
    goAt.current = performance.now();
    const limit = Math.max(650, 1400 - round * 40);
    setTimeLeft(limit);
    tick.current = window.setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 50));
    }, 50);
    timer.current = window.setTimeout(() => {
      clearAll();
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setPhase("over");
          setMsg("Too slow — heat over.");
        } else {
          setPhase("result");
          setMsg("Last to the cone. −1 life");
        }
        return n;
      });
    }, limit);
  }

  function tapCorner(id: string) {
    if (phase !== "call" || !target) return;
    clearAll();
    const rt = Math.round(performance.now() - goAt.current);
    setRound((r) => r + 1);
    if (id === target) {
      const pts = Math.max(80, 500 - rt);
      setScore((s) => s + pts);
      setMsg(`Beat the call · ${rt}ms · +${pts}`);
      setPhase("result");
    } else {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setPhase("over");
          setMsg(`Wrong corner — needed ${target}.`);
        } else {
          setPhase("result");
          setMsg(`Wrong — corner ${target}. −1 life`);
        }
        return n;
      });
    }
  }

  function reset() {
    clearAll();
    setScore(0);
    setLives(3);
    setRound(0);
    setTarget(null);
    setPhase("idle");
    setMsg("Coach calls a corner — get there first.");
    setTimeLeft(0);
  }

  return (
    <GameShell
      title="Four-Corner Call"
      subtitle="Tap the called corner before the clock"
      score={score}
      meta={`Lives ${lives} · Round ${round}`}
    >
      <div className="mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-4 text-center">
        <p className="text-sm font-medium text-[var(--color-fg)]">{msg}</p>
        {phase === "call" && target && (
          <p className="mt-1 font-display text-3xl font-semibold text-[var(--color-primary)]">
            CORNER {target}
          </p>
        )}
        {phase === "call" && (
          <div className="mx-auto mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-[var(--color-surface)]">
            <div
              className="h-full bg-[var(--color-warn)]"
              style={{ width: `${Math.min(100, (timeLeft / 1400) * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="relative mx-auto mb-3 aspect-square w-full max-w-[240px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-[var(--color-subtle)]">
          Field
        </span>
        {CORNERS.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={phase !== "call"}
            onClick={() => tapCorner(c.id)}
            className={cn(
              "absolute flex size-14 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
              c.x === "left" ? "left-3" : "right-3",
              c.y === "top" ? "top-3" : "bottom-3",
              phase === "call" && target === c.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]",
            )}
          >
            {c.id}
            <span className="sr-only">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {phase === "over" ? (
          <Button className="flex-1" onClick={reset}>
            <RotateCcw aria-hidden /> Replay heat
          </Button>
        ) : phase === "call" ? (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> Stop
          </Button>
        ) : (
          <Button className="flex-1" onClick={startRound} disabled={lives <= 0}>
            <Play aria-hidden /> {phase === "idle" ? "Start heat" : "Next call"}
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

type MirrorDir = "N" | "S" | "E" | "W";

function MirrorMatch() {
  const [running, setRunning] = useState(false);
  const [dir, setDir] = useState<MirrorDir>("N");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [miss, setMiss] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [msg, setMsg] = useState("Mirror the leader — tap the matching cut.");
  const [waiting, setWaiting] = useState(false);
  const changeAt = useRef(0);
  const dirRef = useRef<MirrorDir>("N");
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  function scheduleNext(delay: number) {
    const id = window.setTimeout(() => {
      const opts: MirrorDir[] = ["N", "S", "E", "W"];
      let next = opts[Math.floor(Math.random() * 4)]!;
      while (next === dirRef.current) next = opts[Math.floor(Math.random() * 4)]!;
      dirRef.current = next;
      setDir(next);
      setWaiting(true);
      changeAt.current = performance.now();
      setMsg(`Leader cuts ${next}!`);
      const missId = window.setTimeout(() => {
        if (dirRef.current === next) {
          setWaiting(false);
          setMiss((m) => m + 1);
          setCombo(0);
          setMsg("Lost the mirror");
        }
      }, 1100);
      timers.current.push(missId);
      scheduleNext(900 + Math.random() * 700);
    }, delay);
    timers.current.push(id);
  }

  function start() {
    clearTimers();
    setRunning(true);
    setScore(0);
    setCombo(0);
    setMiss(0);
    setTimeLeft(20);
    setMsg("Stay square — match every cut.");
    setWaiting(false);
    scheduleNext(700);
    const clock = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(clock);
          clearTimers();
          setRunning(false);
          setWaiting(false);
          setMsg("Bout over — check your score.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    timers.current.push(clock as unknown as number);
  }

  function tap(d: MirrorDir) {
    if (!running || !waiting) return;
    if (d === dirRef.current) {
      const rt = Math.round(performance.now() - changeAt.current);
      const pts = Math.max(40, 220 - Math.floor(rt / 4)) + combo * 10;
      setScore((s) => s + pts);
      setCombo((c) => c + 1);
      setWaiting(false);
      setMsg(`Stuck him · ${rt}ms · +${pts}`);
    } else {
      setMiss((m) => m + 1);
      setCombo(0);
      setWaiting(false);
      setMsg("Wrong cut — stay on the leader");
    }
  }

  function reset() {
    clearTimers();
    setRunning(false);
    setScore(0);
    setCombo(0);
    setMiss(0);
    setTimeLeft(20);
    setWaiting(false);
    setMsg("Mirror the leader — tap the matching cut.");
  }

  return (
    <GameShell
      title="Mirror Match"
      subtitle="20s bout — match every leader cut"
      score={score}
      meta={`${timeLeft}s · Combo ${combo} · Miss ${miss}`}
    >
      <div
        className={cn(
          "mb-3 rounded-[var(--radius-lg)] border px-3 py-5 text-center transition-colors",
          waiting
            ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]"
            : "border-[var(--color-border)] bg-[var(--color-elevated)]",
        )}
      >
        <p className="text-xs text-[var(--color-subtle)]">{msg}</p>
        <p className="mt-1 font-display text-4xl font-semibold text-[var(--color-fg)]">
          {waiting ? dir : "—"}
        </p>
      </div>

      <div className="mx-auto mb-3 grid max-w-[200px] grid-cols-3 gap-2">
        <div />
        <Button size="lg" className="h-14" disabled={!running || !waiting} onClick={() => tap("N")}>
          N
        </Button>
        <div />
        <Button size="lg" className="h-14" disabled={!running || !waiting} onClick={() => tap("W")}>
          W
        </Button>
        <Button size="lg" className="h-14" disabled={!running || !waiting} onClick={() => tap("S")}>
          S
        </Button>
        <Button size="lg" className="h-14" disabled={!running || !waiting} onClick={() => tap("E")}>
          E
        </Button>
      </div>

      <div className="flex gap-2">
        {!running ? (
          <Button className="flex-1" onClick={start}>
            <Play aria-hidden /> {timeLeft === 0 && score > 0 ? "Rematch" : "Start bout"}
          </Button>
        ) : (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> End early
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function BallSecure() {
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [secure, setSecure] = useState(100);
  const [msg, setMsg] = useState("Hold secure (tap) through every weave gate.");
  const [gateOpen, setGateOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const gates = 8;
  const openRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  function armGate(index: number) {
    if (index >= gates) {
      setRunning(false);
      setFinished(true);
      setGateOpen(false);
      openRef.current = false;
      setMsg(
        secure > 60
          ? "Clean gauntlet — ball stayed high & tight!"
          : "Finished, but ball security slipped.",
      );
      setScore((s) => s + Math.round(secure * 2));
      return;
    }
    setPos(index);
    setMsg(`Gate ${index + 1}/${gates} — secure the ball!`);
    const delay = 500 + Math.random() * 400;
    const openId = window.setTimeout(() => {
      openRef.current = true;
      setGateOpen(true);
      setMsg("WEAVE — tap to secure!");
      const closeId = window.setTimeout(() => {
        if (openRef.current) {
          openRef.current = false;
          setGateOpen(false);
          setSecure((v) => Math.max(0, v - 18));
          setMsg("Loose ball through the gate");
          armGate(index + 1);
        }
      }, 700);
      timers.current.push(closeId);
    }, delay);
    timers.current.push(openId);
  }

  function start() {
    clearTimers();
    setRunning(true);
    setFinished(false);
    setPos(0);
    setScore(0);
    setSecure(100);
    setGateOpen(false);
    openRef.current = false;
    setMsg("Gauntlet live — eyes up, elbow in.");
    armGate(0);
  }

  function tapSecure() {
    if (!running || !openRef.current) {
      if (running) {
        setSecure((v) => Math.max(0, v - 8));
        setMsg("Early slap — don't panic the ball");
      }
      return;
    }
    openRef.current = false;
    setGateOpen(false);
    setSecure((v) => Math.min(100, v + 4));
    setScore((s) => s + 80 + Math.floor(secure / 5));
    setMsg("High & tight — next cone");
    armGate(pos + 1);
  }

  function reset() {
    clearTimers();
    setRunning(false);
    setFinished(false);
    setPos(0);
    setScore(0);
    setSecure(100);
    setGateOpen(false);
    openRef.current = false;
    setMsg("Hold secure (tap) through every weave gate.");
  }

  return (
    <GameShell
      title="Ball Security Weave"
      subtitle="Tap in each gate window — keep secure high"
      score={score}
      meta={`Secure ${secure}% · Gate ${Math.min(pos + 1, gates)}/${gates}`}
    >
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-[var(--color-elevated)]">
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            secure > 60 ? "bg-[var(--color-primary)]" : "bg-[var(--color-warn)]",
          )}
          style={{ width: `${secure}%` }}
        />
      </div>

      <div className="mb-3 flex justify-between gap-1">
        {Array.from({ length: gates }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < pos
                ? "bg-[var(--color-primary)]"
                : i === pos && gateOpen
                  ? "bg-[var(--color-warn)]"
                  : "bg-[var(--color-border)]",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={tapSecure}
        disabled={!running && !finished}
        className={cn(
          "mb-3 flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-xl)] border text-center transition-colors",
          gateOpen
            ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]"
            : "border-[var(--color-border)] bg-[var(--color-elevated)]",
        )}
      >
        <span className="font-display text-3xl font-semibold text-[var(--color-fg)]">
          {gateOpen ? "SECURE" : finished ? "DONE" : running ? "…" : "READY"}
        </span>
        <span className="mt-1 max-w-[16rem] text-xs text-[var(--color-muted)]">{msg}</span>
      </button>

      <div className="flex gap-2">
        {!running ? (
          <Button className="flex-1" onClick={start}>
            <Play aria-hidden /> {finished ? "Run again" : "Start gauntlet"}
          </Button>
        ) : (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> Abort
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function RedLightGame() {
  const [running, setRunning] = useState(false);
  const [light, setLight] = useState<"green" | "red" | "idle">("idle");
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [msg, setMsg] = useState("Green = hold GO · Red = freeze (don't tap).");
  const [won, setWon] = useState(false);
  const lightRef = useRef<"green" | "red" | "idle">("idle");
  const timers = useRef<number[]>([]);
  const runningRef = useRef(false);
  const goal = 8;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  function scheduleLight() {
    const next: "green" | "red" = Math.random() > 0.42 ? "green" : "red";
    const delay = 500 + Math.random() * 900;
    const id = window.setTimeout(() => {
      if (!runningRef.current) return;
      lightRef.current = next;
      setLight(next);
      setMsg(next === "green" ? "GREEN — tap to advance!" : "RED — FREEZE!");
      const hold = next === "green" ? 900 + Math.random() * 500 : 700 + Math.random() * 600;
      const endId = window.setTimeout(() => {
        if (lightRef.current === "green") {
          setMsg("Missed a green — stay ready");
        }
        lightRef.current = "idle";
        setLight("idle");
        if (runningRef.current) scheduleLight();
      }, hold);
      timers.current.push(endId);
    }, delay);
    timers.current.push(id);
  }

  function start() {
    clearTimers();
    setRunning(true);
    runningRef.current = true;
    setProgress(0);
    setScore(0);
    setStrikes(0);
    setWon(false);
    setLight("idle");
    lightRef.current = "idle";
    setMsg("Race to the finish — freeze on red.");
    scheduleLight();
  }

  function tap() {
    if (!runningRef.current || won) return;
    if (lightRef.current === "green") {
      setProgress((p) => {
        const n = p + 1;
        setScore((s) => s + 100);
        if (n >= goal) {
          setWon(true);
          setRunning(false);
          runningRef.current = false;
          clearTimers();
          setMsg("Finish line! Clean COD freezes win camp.");
          lightRef.current = "idle";
          setLight("idle");
        } else {
          setMsg(`Advance ${n}/${goal}`);
        }
        return n;
      });
      lightRef.current = "idle";
      setLight("idle");
    } else if (lightRef.current === "red") {
      setStrikes((k) => k + 1);
      setProgress((p) => Math.max(0, p - 1));
      setScore((s) => Math.max(0, s - 40));
      setMsg("Moved on red — back 1 yard");
    } else {
      setMsg("Wait for the light…");
    }
  }

  function reset() {
    clearTimers();
    setRunning(false);
    runningRef.current = false;
    setLight("idle");
    lightRef.current = "idle";
    setProgress(0);
    setScore(0);
    setStrikes(0);
    setWon(false);
    setMsg("Green = hold GO · Red = freeze (don't tap).");
  }

  return (
    <GameShell
      title="Red / Green COD"
      subtitle="Tap only on green — freeze on red"
      score={score}
      meta={`Yard ${progress}/${goal} · Strikes ${strikes}`}
    >
      <div
        className={cn(
          "mb-3 rounded-[var(--radius-lg)] border px-3 py-8 text-center transition-colors",
          light === "green"
            ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)]"
            : light === "red"
              ? "border-[var(--color-warn)] bg-[color-mix(in_oklab,var(--color-warn)_18%,var(--color-elevated))]"
              : "border-[var(--color-border)] bg-[var(--color-elevated)]",
        )}
      >
        <p className="font-display text-3xl font-semibold text-[var(--color-fg)]">
          {light === "green" ? "GREEN" : light === "red" ? "RED" : won ? "DONE" : "…"}
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">{msg}</p>
      </div>

      <div className="mb-3 flex gap-1">
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < progress ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]",
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={tap}
        disabled={!running}
        className="mb-3 flex h-20 w-full items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] font-display text-xl font-semibold text-[var(--color-fg)] active:scale-[0.99]"
      >
        GO
      </button>

      <div className="flex gap-2">
        {!running ? (
          <Button className="flex-1" onClick={start}>
            <Play aria-hidden /> {won ? "Run again" : "Start heat"}
          </Button>
        ) : (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> Stop
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function StealBacon() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [myNum, setMyNum] = useState(1);
  const [called, setCalled] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "listen" | "race" | "result" | "over">("idle");
  const [msg, setMsg] = useState("You're number 1. Explode only on your call.");
  const [lives, setLives] = useState(3);
  const goAt = useRef(0);
  const timer = useRef<number | null>(null);
  const myNumRef = useRef(1);

  useEffect(() => {
    const n = 1 + Math.floor(Math.random() * 6);
    setMyNum(n);
    myNumRef.current = n;
    setMsg(`You're number ${n}. Explode only on your call.`);
  }, []);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => () => clearTimer(), []);

  function startRound() {
    clearTimer();
    setPhase("listen");
    setCalled(null);
    setMsg("Listen for numbers…");
    const delay = 700 + Math.random() * 1200;
    const callMine = Math.random() > 0.35;
    const num = callMine ? myNumRef.current : 1 + Math.floor(Math.random() * 6);
    timer.current = window.setTimeout(() => {
      setCalled(num);
      setPhase("race");
      goAt.current = performance.now();
      setMsg(`NUMBER ${num}!`);
      timer.current = window.setTimeout(() => {
        if (num === myNumRef.current) {
          setLives((l) => {
            const next = l - 1;
            if (next <= 0) {
              setPhase("over");
              setMsg("Missed your number — heat over.");
            } else {
              setPhase("result");
              setMsg("Too slow on your number. −1 life");
            }
            return next;
          });
        } else {
          setPhase("result");
          setMsg("Decoy — good patience.");
          setScore((s) => s + 30);
        }
      }, 1100);
    }, delay);
  }

  function grab() {
    if (phase !== "race" || called == null) return;
    clearTimer();
    const rt = Math.round(performance.now() - goAt.current);
    setRound((r) => r + 1);
    if (called === myNumRef.current) {
      const pts = Math.max(80, 450 - rt);
      setScore((s) => s + pts);
      setMsg(`Bacon secured · ${rt}ms · +${pts}`);
      setPhase("result");
    } else {
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setPhase("over");
          setMsg("False start on a decoy — out.");
        } else {
          setPhase("result");
          setMsg("Wrong number — false start. −1 life");
        }
        return next;
      });
    }
  }

  function reset() {
    clearTimer();
    setScore(0);
    setRound(0);
    setCalled(null);
    setPhase("idle");
    setLives(3);
    setMsg(`You're number ${myNumRef.current}. Explode only on your call.`);
  }

  return (
    <GameShell
      title="Steal the Bacon"
      subtitle={`You are #${myNum} — race only on your number`}
      score={score}
      meta={`Lives ${lives} · Round ${round}`}
    >
      <div className="mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-6 text-center">
        <p className="text-sm text-[var(--color-fg)]">{msg}</p>
        {phase === "race" && called != null && (
          <p className="mt-2 font-display text-4xl font-semibold text-[var(--color-primary)]">
            #{called}
          </p>
        )}
      </div>

      <Button size="lg" className="mb-3 h-16 w-full" disabled={phase !== "race"} onClick={grab}>
        GRAB BACON
      </Button>

      <div className="flex gap-2">
        {phase === "over" ? (
          <Button className="flex-1" onClick={reset}>
            <RotateCcw aria-hidden /> Replay
          </Button>
        ) : phase === "listen" || phase === "race" ? (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> Stop
          </Button>
        ) : (
          <Button className="flex-1" onClick={startRound} disabled={lives <= 0}>
            <Play aria-hidden /> {phase === "idle" ? "Start" : "Next call"}
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function PursuitTap() {
  const corners = ["NW", "NE", "SW", "SE"] as const;
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [carrier, setCarrier] = useState<(typeof corners)[number] | null>(null);
  const [phase, setPhase] = useState<"idle" | "go" | "result" | "over">("idle");
  const [msg, setMsg] = useState("Cut off the carrier — tap the angle cone first.");
  const [lives, setLives] = useState(3);
  const goAt = useRef(0);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => () => clearTimer(), []);

  function startRound() {
    clearTimer();
    const c = corners[Math.floor(Math.random() * 4)]!;
    setCarrier(c);
    setPhase("go");
    setMsg(`Carrier breaks ${c}!`);
    goAt.current = performance.now();
    timer.current = window.setTimeout(() => {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setPhase("over");
          setMsg("Carrier scored — heat over.");
        } else {
          setPhase("result");
          setMsg("Too slow — he beat you to the edge.");
        }
        return n;
      });
    }, 1200);
  }

  function tap(c: (typeof corners)[number]) {
    if (phase !== "go" || !carrier) return;
    clearTimer();
    const rt = Math.round(performance.now() - goAt.current);
    setRound((r) => r + 1);
    if (c === carrier) {
      const pts = Math.max(70, 420 - rt);
      setScore((s) => s + pts);
      setMsg(`Angle won · ${rt}ms · +${pts}`);
      setPhase("result");
    } else {
      setLives((l) => {
        const n = l - 1;
        if (n <= 0) {
          setPhase("over");
          setMsg(`Trailed to ${c} — needed ${carrier}.`);
        } else {
          setPhase("result");
          setMsg(`Wrong angle — take grass away toward ${carrier}.`);
        }
        return n;
      });
    }
  }

  function reset() {
    clearTimer();
    setScore(0);
    setRound(0);
    setCarrier(null);
    setPhase("idle");
    setLives(3);
    setMsg("Cut off the carrier — tap the angle cone first.");
  }

  return (
    <GameShell
      title="Pursuit Angles"
      subtitle="Tap the cut-off corner — never trail"
      score={score}
      meta={`Lives ${lives} · Round ${round}`}
    >
      <div className="mb-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-4 text-center">
        <p className="text-sm text-[var(--color-fg)]">{msg}</p>
        {phase === "go" && carrier && (
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-primary)]">
            → {carrier}
          </p>
        )}
      </div>

      <div className="relative mx-auto mb-3 aspect-square w-full max-w-[220px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[var(--color-subtle)]">
          Hash
        </span>
        {(
          [
            ["NW", "left-3", "top-3"],
            ["NE", "right-3", "top-3"],
            ["SW", "left-3", "bottom-3"],
            ["SE", "right-3", "bottom-3"],
          ] as const
        ).map(([c, x, y]) => (
          <button
            key={c}
            type="button"
            disabled={phase !== "go"}
            onClick={() => tap(c)}
            className={cn(
              "absolute flex size-14 items-center justify-center rounded-full border text-xs font-semibold",
              x,
              y,
              phase === "go" && carrier === c
                ? "border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {phase === "over" ? (
          <Button className="flex-1" onClick={reset}>
            <RotateCcw aria-hidden /> Replay
          </Button>
        ) : phase === "go" ? (
          <Button className="flex-1" variant="secondary" onClick={reset}>
            <Pause aria-hidden /> Stop
          </Button>
        ) : (
          <Button className="flex-1" onClick={startRound} disabled={lives <= 0}>
            <Play aria-hidden /> {phase === "idle" ? "Snap" : "Next snap"}
          </Button>
        )}
        <Button variant="outline" onClick={reset} aria-label="Reset">
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </GameShell>
  );
}

function GameShell({
  title,
  subtitle,
  score,
  meta,
  children,
}: {
  title: string;
  subtitle: string;
  score: number;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Mini-game
          </p>
          <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-[var(--color-muted)]">{subtitle}</p>
        </div>
        <div className="text-right">
          <Badge variant="default" className="tabular">
            {score}
          </Badge>
          <p className="mt-1 text-[10px] text-[var(--color-subtle)]">{meta}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
