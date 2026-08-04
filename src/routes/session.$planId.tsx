import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DrillAnimator } from "@/components/drill-animator";
import { SessionTimer } from "@/components/session-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDrillById, type Drill } from "@/data/drills";
import type { PracticePlan } from "@/data/plans";
import { getProgramPlanById } from "@/data/programs";
import { getGameById } from "@/data/games";
import { useProgressStore } from "@/store/progress";

export const Route = createFileRoute("/session/$planId")({
  component: SessionPage,
});

function SessionPage() {
  const { planId } = Route.useParams();
  const plan = getProgramPlanById(planId);
  if (!plan) throw notFound();

  return <SessionRunner plan={plan} />;
}

function SessionRunner({ plan }: { plan: PracticePlan }) {
  const navigate = useNavigate();
  const completePlan = useProgressStore((s) => s.completePlan);
  const completeDrill = useProgressStore((s) => s.completeDrill);
  const setActiveDay = useProgressStore((s) => s.setActiveDay);

  const steps = useMemo(() => {
    return plan.blocks.flatMap((block, bi) =>
      block.drillIds.map((drillId, di) => ({
        blockTitle: block.title,
        blockMinutes: block.minutes,
        blockIndex: bi,
        drillIndex: di,
        drillId,
        notes: block.notes,
      })),
    );
  }, [plan]);

  const [index, setIndex] = useState(0);
  const step = steps[index];
  if (!step) throw notFound();
  const drill = getDrillById(step.drillId);
  if (!drill) throw notFound();

  return (
    <SessionStep
      plan={plan}
      drill={drill}
      step={step}
      index={index}
      total={steps.length}
      onPrev={() => setIndex((i) => Math.max(0, i - 1))}
      onNext={() => {
        completeDrill(drill.id);
        setIndex((i) => Math.min(steps.length - 1, i + 1));
      }}
      onFinish={() => {
        completeDrill(drill.id);
        completePlan(plan.id);
        setActiveDay(Math.min(10, plan.day + 1));
        void navigate({ to: "/progress" });
      }}
    />
  );
}

function SessionStep({
  plan,
  drill,
  step,
  index,
  total,
  onPrev,
  onNext,
  onFinish,
}: {
  plan: PracticePlan;
  drill: Drill;
  step: {
    blockTitle: string;
    blockMinutes: number;
    blockIndex: number;
    drillId: string;
    notes?: string;
  };
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const pct = Math.round(((index + 1) / total) * 100);
  const isLast = index >= total - 1;
  const block = plan.blocks[step.blockIndex];
  const blockDrillCount = block?.drillIds.length ?? 1;
  const timerSeconds = Math.max(
    60,
    Math.round((step.blockMinutes * 60) / Math.max(1, blockDrillCount)),
  );

  return (
    <AppShell hideNav>
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/plans/$planId" params={{ planId: plan.id }}>
            <ArrowLeft aria-hidden /> Exit
          </Link>
        </Button>
        <Badge variant="outline">
          {index + 1}/{total}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-subtle)]">
          <span>
            Day {plan.day} · {plan.title}
          </span>
          <span className="tabular">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="mb-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          {step.blockTitle}
          <span className="text-[var(--color-muted)]">
            {" "}
            · {step.blockMinutes} min block
          </span>
        </p>
        <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-tight">
          {drill.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{drill.objective}</p>
        {step.notes && (
          <p className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-xs text-[var(--color-muted)]">
            {step.notes}
          </p>
        )}
      </div>

      <div className="mb-6">
        <DrillAnimator key={drill.id} drill={drill} />
      </div>

      <SessionTimer
        key={`timer-${step.drillId}-${index}`}
        initialSeconds={timerSeconds}
        label="Block share timer"
      />

      <div className="mt-8 grid grid-cols-2 gap-2 pb-6">
        <Button variant="secondary" size="lg" disabled={index === 0} onClick={onPrev}>
          <ChevronLeft aria-hidden /> Prev
        </Button>
        {!isLast ? (
          <Button size="lg" onClick={onNext}>
            Next <ChevronRight aria-hidden />
          </Button>
        ) : (
          <Button size="lg" onClick={onFinish}>
            <Flag aria-hidden /> Finish
          </Button>
        )}
      </div>

      {isLast && (
        <Button variant="outline" className="mb-4 w-full" onClick={onFinish}>
          <Check aria-hidden /> Mark practice complete
        </Button>
      )}

      {isLast && (plan.gameIds?.length ?? 0) > 0 && (
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Competitive finishers
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            After drills, run these non-contact games to close practice.
          </p>
          <ul className="mt-3 space-y-2">
            {plan.gameIds!.map((id) => {
              const game = getGameById(id);
              if (!game) return null;
              return (
                <li key={id}>
                  <Link
                    to="/games/$gameId"
                    params={{ gameId: id }}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5 text-sm font-medium"
                  >
                    {game.name}
                    <span className="text-xs text-[var(--color-subtle)]">
                      {game.durationMin} min
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
