import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatClock } from "@/lib/utils";

export function SessionTimer({
  initialSeconds,
  label = "Block timer",
}: {
  initialSeconds: number;
  label?: string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
    setRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) {
      if (ref.current) window.clearInterval(ref.current);
      ref.current = null;
      return;
    }
    ref.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  const progress = initialSeconds > 0 ? ((initialSeconds - seconds) / initialSeconds) * 100 : 0;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          {label}
        </p>
        <p className="text-xs text-[var(--color-muted)] tabular">
          {Math.round(progress)}%
        </p>
      </div>
      <p className="font-display text-5xl font-semibold tabular tracking-tight text-[var(--color-fg)]">
        {formatClock(seconds)}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-[var(--duration-fast)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1"
          variant={running ? "secondary" : "default"}
          onClick={() => setRunning((r) => !r)}
          disabled={seconds === 0 && !running}
        >
          {running ? (
            <>
              <Pause aria-hidden /> Pause
            </>
          ) : (
            <>
              <Play aria-hidden /> {seconds === 0 ? "Done" : "Start"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Reset timer"
          onClick={() => {
            setRunning(false);
            setSeconds(initialSeconds);
          }}
        >
          <RotateCcw aria-hidden />
        </Button>
      </div>
    </div>
  );
}
