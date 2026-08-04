import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock3, Dumbbell } from "lucide-react";
import {
  CATEGORY_LABELS,
  INTENSITY_LABELS,
  type Drill,
} from "@/data/drills";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const intensityVariant = {
  low: "secondary",
  moderate: "info",
  high: "warn",
} as const;

export function DrillCard({
  drill,
  compact = false,
  done = false,
}: {
  drill: Drill;
  compact?: boolean;
  done?: boolean;
}) {
  const isCone = drill.series === "cone-agilities";

  return (
    <Link
      to="/drills/$drillId"
      params={{ drillId: drill.id }}
      className={cn(
        "group block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-smooth)] active:scale-[0.99]",
        "hover:border-[var(--color-border-strong)]",
        done && "border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-border))]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default">
              {isCone ? "Cone" : CATEGORY_LABELS[drill.category]}
            </Badge>
            <Badge variant={intensityVariant[drill.intensity]}>
              {INTENSITY_LABELS[drill.intensity]}
            </Badge>
            {drill.level && (
              <Badge variant="outline">{drill.level}</Badge>
            )}
            {done && <Badge variant="outline">Done</Badge>}
          </div>
          <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[var(--color-fg)]">
            {drill.name}
          </h3>
          {!compact && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
              {drill.summary}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-subtle)]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden />
              {drill.durationMin} min
            </span>
            {drill.totalYards && <span>{drill.totalYards} yd</span>}
            {drill.equipment[0] && (
              <span className="inline-flex items-center gap-1">
                <Dumbbell className="size-3.5" aria-hidden />
                {drill.equipment[0]}
                {drill.equipment.length > 1 ? ` +${drill.equipment.length - 1}` : ""}
              </span>
            )}
          </div>
        </div>
        <ChevronRight
          className="mt-1 size-5 shrink-0 text-[var(--color-subtle)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
