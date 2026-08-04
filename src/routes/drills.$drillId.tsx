import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Heart,
  ListOrdered,
  ShieldAlert,
  Target,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ConeDiagram } from "@/components/cone-diagram";
import { DrillAnimator } from "@/components/drill-animator";
import { DrillEvalPanel } from "@/components/drill-eval-panel";
import { SessionTimer } from "@/components/session-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  INTENSITY_LABELS,
  POSITION_LABELS,
  getDrillById,
} from "@/data/drills";
import { CONTACT_LABELS } from "@/data/levels";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drills/$drillId")({
  component: DrillDetailPage,
});

function DrillDetailPage() {
  const { drillId } = Route.useParams();
  const drill = getDrillById(drillId);
  if (!drill) throw notFound();

  const completedDrills = useProgressStore((s) => s.completedDrills);
  const favorites = useProgressStore((s) => s.favorites);
  const completeDrill = useProgressStore((s) => s.completeDrill);
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite);

  const done = completedDrills.includes(drill.id);
  const fav = favorites.includes(drill.id);
  const isCone = drill.series === "cone-agilities";

  return (
    <AppShell hideNav>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={isCone ? "/cones" : "/drills"}>
            <ArrowLeft aria-hidden /> {isCone ? "Cone sheet" : "Library"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={fav ? "Remove favorite" : "Favorite"}
          onClick={() => toggleFavorite(drill.id)}
        >
          <Heart
            className={cn(
              fav && "fill-[var(--color-primary)] text-[var(--color-primary)]",
            )}
            aria-hidden
          />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{CATEGORY_LABELS[drill.category]}</Badge>
          {isCone && <Badge variant="default">Cone sheet</Badge>}
          {drill.level && (
            <Badge variant={drill.level === "advanced" ? "warn" : "secondary"}>
              {drill.level}
            </Badge>
          )}
          <Badge
            variant={
              drill.intensity === "high"
                ? "warn"
                : drill.intensity === "moderate"
                  ? "info"
                  : "secondary"
            }
          >
            {INTENSITY_LABELS[drill.intensity]}
          </Badge>
          {drill.contactLevel ? (
            <Badge variant={drill.contactLevel === "air" ? "outline" : "warn"}>
              {CONTACT_LABELS[drill.contactLevel]}
            </Badge>
          ) : (
            <Badge variant="outline">Non-contact</Badge>
          )}
          {done && <Badge variant="default">Completed</Badge>}
        </div>
        <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
          {drill.name}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {drill.summary}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]">
          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
            {drill.durationMin} min
          </span>
          {drill.totalYards != null && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
              {drill.totalYards} yards
            </span>
          )}
          {drill.sets != null && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
              {drill.sets} sets
            </span>
          )}
          {drill.reps && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
              {drill.reps}
            </span>
          )}
          {drill.restSec != null && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
              {drill.restSec}s rest
            </span>
          )}
        </div>
        {drill.movementMix && drill.movementMix.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {drill.movementMix.map((m) => (
              <Badge key={m} variant="outline">
                {m}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          Guided walkthrough
        </h2>
        <DrillAnimator drill={drill} />
      </section>

      {drill.diagramId && (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Static pattern
          </h2>
          <ConeDiagram diagramId={drill.diagramId} />
        </section>
      )}

      <div className="mt-6">
        <SessionTimer
          initialSeconds={drill.durationMin * 60}
          label="Drill clock"
        />
      </div>

      <DrillEvalPanel drillId={drill.id} />

      <section className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center gap-2 text-[var(--color-primary)]">
          <Target className="size-4" aria-hidden />
          <h2 className="text-xs font-medium uppercase tracking-[0.12em]">
            Objective
          </h2>
        </div>
        <p className="text-sm text-[var(--color-fg)]">{drill.objective}</p>
      </section>

      <Section icon={Wrench} title="Setup">
        <ul className="space-y-2">
          {drill.setup.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-[var(--color-muted)]">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {drill.equipment.map((e) => (
            <Badge key={e} variant="secondary">
              {e}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {drill.positions.map((pos) => (
            <Badge key={pos} variant="outline">
              {POSITION_LABELS[pos]}
            </Badge>
          ))}
        </div>
      </Section>

      <Section icon={ListOrdered} title="Steps">
        <ol className="space-y-2">
          {drill.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-[var(--color-muted)]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-elevated)] text-[11px] font-semibold tabular text-[var(--color-primary)]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section icon={Target} title="Coaching cues">
        <ul className="space-y-2">
          {drill.cues.map((c) => (
            <li key={c} className="text-sm text-[var(--color-muted)]">
              · {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={ListOrdered} title="Progressions">
        <ul className="space-y-2">
          {drill.progressions.map((c) => (
            <li key={c} className="text-sm text-[var(--color-muted)]">
              · {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={ShieldAlert} title="Safety">
        <ul className="space-y-2">
          {drill.safety.map((c) => (
            <li key={c} className="text-sm text-[var(--color-muted)]">
              · {c}
            </li>
          ))}
        </ul>
      </Section>

      <div className="mt-8 mb-4">
        <Button
          size="lg"
          className="w-full"
          variant={done ? "secondary" : "default"}
          onClick={() => completeDrill(drill.id)}
        >
          <Check aria-hidden /> {done ? "Completed" : "Mark complete"}
        </Button>
      </div>
    </AppShell>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center gap-2 text-[var(--color-primary)]">
        <Icon className="size-4" aria-hidden />
        <h2 className="text-xs font-medium uppercase tracking-[0.12em]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
