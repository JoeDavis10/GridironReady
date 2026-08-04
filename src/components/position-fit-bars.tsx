import { POSITION_LABELS, type PositionId } from "@/data/positions";
import type { FitScore } from "@/data/evaluation";
import { cn } from "@/lib/utils";

export function PositionFitBars({
  rankings,
  highlight,
  compact = false,
}: {
  rankings: FitScore[];
  highlight?: PositionId;
  compact?: boolean;
}) {
  const list = compact ? rankings.slice(0, 5) : rankings;
  return (
    <ul className="space-y-2.5">
      {list.map((r, i) => {
        const active = highlight === r.positionId;
        return (
          <li key={r.positionId}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span
                className={cn(
                  "font-medium",
                  i === 0
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-fg)]",
                  active && "underline decoration-[var(--color-primary)]",
                )}
              >
                {i + 1}. {POSITION_LABELS[r.positionId]}
              </span>
              <span className="tabular text-[var(--color-muted)]">{r.score}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-elevated)]">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  i === 0
                    ? "bg-[var(--color-primary)]"
                    : "bg-[color-mix(in_oklab,var(--color-primary)_45%,var(--color-border-strong))]",
                )}
                style={{ width: `${r.score}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
