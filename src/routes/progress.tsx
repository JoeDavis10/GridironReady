import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, RotateCcw, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { drills, getDrillById } from "@/data/drills";
import { allProgramPlans, getProgramPlanById as getPlanById } from "@/data/programs";
import { useProgressStore } from "@/store/progress";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const completedPlans = useProgressStore((s) => s.completedPlans);
  const completedDrills = useProgressStore((s) => s.completedDrills);
  const favorites = useProgressStore((s) => s.favorites);
  const activeDay = useProgressStore((s) => s.activeDay);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const planPct = Math.round((completedPlans.length / allProgramPlans.length) * 100);
  const drillPct = Math.round((completedDrills.length / drills.length) * 100);

  return (
    <AppShell title="Progress" subtitle="Program tracking">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]">
            <Trophy className="size-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Active day
            </p>
            <p className="font-display text-2xl font-semibold">Day {activeDay}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-[var(--color-muted)]">Practices complete</span>
              <span className="tabular text-[var(--color-fg)]">
                {completedPlans.length}/{allProgramPlans.length}
              </span>
            </div>
            <Progress value={planPct} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-[var(--color-muted)]">Drills logged</span>
              <span className="tabular text-[var(--color-fg)]">
                {completedDrills.length}/{drills.length}
              </span>
            </div>
            <Progress value={drillPct} />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Completed practices
        </h2>
        {completedPlans.length === 0 ? (
          <Empty
            text="Finish a practice day to track camp progress."
            action={
              <Button asChild size="sm">
                <Link to="/plans">Open camp plan</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2">
            {completedPlans.map((id) => {
              const plan = getPlanById(id);
              if (!plan) return null;
              return (
                <li key={id}>
                  <Link
                    to="/plans/$planId"
                    params={{ planId: id }}
                    className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{plan.title}</p>
                      <p className="text-xs text-[var(--color-subtle)]">
                        Day {plan.day}
                      </p>
                    </div>
                    <Badge>Done</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Heart className="size-4 text-[var(--color-primary)]" aria-hidden />
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Favorites
          </h2>
        </div>
        {favorites.length === 0 ? (
          <Empty text="Heart drills you want in every practice." />
        ) : (
          <ul className="space-y-2">
            {favorites.map((id) => {
              const drill = getDrillById(id);
              if (!drill) return null;
              return (
                <li key={id}>
                  <Link
                    to="/drills/$drillId"
                    params={{ drillId: id }}
                    className="block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm font-medium"
                  >
                    {drill.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Recently logged drills
        </h2>
        {completedDrills.length === 0 ? (
          <Empty text="Mark drills complete from the library or a live session." />
        ) : (
          <ul className="space-y-2">
            {[...completedDrills]
              .reverse()
              .slice(0, 8)
              .map((id) => {
                const drill = getDrillById(id);
                if (!drill) return null;
                return (
                  <li
                    key={id}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-muted)]"
                  >
                    {drill.name}
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      <div className="mt-10 pb-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm("Reset all camp progress on this device?")
            ) {
              resetProgress();
            }
          }}
        >
          <RotateCcw aria-hidden /> Reset progress
        </Button>
      </div>
    </AppShell>
  );
}

function Empty({
  text,
  action,
}: {
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
      <p className="text-sm text-[var(--color-muted)]">{text}</p>
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
}
