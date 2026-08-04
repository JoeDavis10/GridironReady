import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Clock3, Shield } from "lucide-react";
import { INTENSITY_LABELS } from "@/data/drills";
import {
  PHASE_LABELS,
  getPlanDrillCount,
  type PracticePlan,
} from "@/data/plans";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const helmetLabel = {
  none: "No helmets",
  helmets: "Helmets",
  shells: "Shells",
} as const;

export function PlanCard({
  plan,
  completed = false,
  featured = false,
}: {
  plan: PracticePlan;
  completed?: boolean;
  featured?: boolean;
}) {
  return (
    <Link
      to="/plans/$planId"
      params={{ planId: plan.id }}
      className={cn(
        "block rounded-[var(--radius-xl)] border p-4 transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-smooth)] active:scale-[0.99]",
        featured
          ? "border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_55%,var(--color-surface))]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">Day {plan.day}</Badge>
            <Badge variant="default">{PHASE_LABELS[plan.phase]}</Badge>
            <Badge
              variant={
                plan.intensity === "high"
                  ? "warn"
                  : plan.intensity === "moderate"
                    ? "info"
                    : "secondary"
              }
            >
              {INTENSITY_LABELS[plan.intensity]}
            </Badge>
            {completed && (
              <Badge variant="default" className="gap-1">
                <Check className="size-3" aria-hidden />
                Complete
              </Badge>
            )}
          </div>
          <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">
            {plan.title}
          </h3>
          <p className="text-sm text-[var(--color-muted)]">{plan.focus}</p>
          <div className="flex flex-wrap gap-3 text-xs text-[var(--color-subtle)]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden />
              {plan.totalMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Shield className="size-3.5" aria-hidden />
              {helmetLabel[plan.helmets]} · Non-contact
            </span>
            <span>{getPlanDrillCount(plan)} drills</span>
          </div>
        </div>
        <ChevronRight className="mt-1 size-5 shrink-0 text-[var(--color-subtle)]" aria-hidden />
      </div>
    </Link>
  );
}
