import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  Gamepad2,
  Play,
  Shield,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DrillCard } from "@/components/drill-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INTENSITY_LABELS, getDrillById } from "@/data/drills";
import { getGameById, KIND_LABELS } from "@/data/games";
import { PHASE_LABELS } from "@/data/plans";
import { getProgramPlanById as getPlanById } from "@/data/programs";
import { CONTACT_LABELS } from "@/data/levels";
import { useProgressStore } from "@/store/progress";

export const Route = createFileRoute("/plans/$planId")({
  component: PlanDetailPage,
});

const helmetLabel = {
  none: "No helmets",
  helmets: "Helmets only",
  shells: "Shells / pads posture",
} as const;

function PlanDetailPage() {
  const { planId } = Route.useParams();
  const plan = getPlanById(planId);
  if (!plan) throw notFound();

  const completedPlans = useProgressStore((s) => s.completedPlans);
  const completePlan = useProgressStore((s) => s.completePlan);
  const setActiveDay = useProgressStore((s) => s.setActiveDay);
  const completedDrills = useProgressStore((s) => s.completedDrills);
  const done = completedPlans.includes(plan.id);
  const games = (plan.gameIds ?? [])
    .map((id) => getGameById(id))
    .filter(Boolean);

  return (
    <AppShell hideNav>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/plans">
            <ArrowLeft aria-hidden /> Programs
          </Link>
        </Button>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        <Badge>Day {plan.day}</Badge>
        <Badge variant="secondary">{PHASE_LABELS[plan.phase]}</Badge>
        <Badge variant="outline">{INTENSITY_LABELS[plan.intensity]}</Badge>
        <Badge variant="outline">{helmetLabel[plan.helmets]}</Badge>
        {"contactCap" in plan && plan.contactCap && (
          <Badge variant="warn">{CONTACT_LABELS[plan.contactCap]}</Badge>
        )}
      </div>

      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        {plan.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{plan.focus}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-subtle)]">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-4" aria-hidden />
          {plan.totalMinutes} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="size-4" aria-hidden />
          {plan.contact === "none" ? "Scripted contact level" : plan.contact}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <Link to="/session/$planId" params={{ planId: plan.id }}>
            <Play aria-hidden /> Run practice
          </Link>
        </Button>
        {!done ? (
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              completePlan(plan.id);
              setActiveDay(Math.min(99, plan.day + 1));
            }}
          >
            <Check aria-hidden /> Mark day complete
          </Button>
        ) : (
          <Badge className="justify-center py-2">Completed</Badge>
        )}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Objectives
        </h2>
        <ul className="space-y-2">
          {plan.objectives.map((o) => (
            <li
              key={o}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-muted)]"
            >
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Practice blocks
        </h2>
        <div className="space-y-5">
          {plan.blocks.map((block, i) => (
            <div key={`${block.title}-${i}`}>
              <div className="mb-2 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                    Block {i + 1} · {block.minutes} min
                  </p>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {block.title}
                  </h3>
                </div>
              </div>
              {block.notes && (
                <p className="mb-2 text-xs text-[var(--color-muted)]">{block.notes}</p>
              )}
              <div className="space-y-2">
                {block.drillIds.map((id) => {
                  const drill = getDrillById(id);
                  if (!drill) return null;
                  return (
                    <DrillCard
                      key={id}
                      drill={drill}
                      compact
                      done={completedDrills.includes(id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {games.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Gamepad2 className="size-4 text-[var(--color-primary)]" aria-hidden />
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Competitive games
            </h2>
          </div>
          <ul className="space-y-2">
            {games.map((g) =>
              g ? (
                <li key={g.id}>
                  <Link
                    to="/games/$gameId"
                    params={{ gameId: g.id }}
                    className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-[var(--color-subtle)]">
                        {KIND_LABELS[g.kind]} · {g.durationMin} min
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-[var(--color-subtle)]" aria-hidden />
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}

      <section className="mt-8 pb-4">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Coach notes
        </h2>
        <ul className="space-y-2">
          {plan.coachNotes.map((n) => (
            <li
              key={n}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2.5 text-sm text-[var(--color-muted)]"
            >
              {n}
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
