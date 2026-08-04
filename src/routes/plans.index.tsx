import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PlanCard } from "@/components/plan-card";
import { Badge } from "@/components/ui/badge";
import {
  AGE_BAND_LABELS,
  CONTACT_LABELS,
  SEASON_LABELS,
} from "@/data/levels";
import {
  getPlansForTrack,
  programTracks,
  type ProgramTrackId,
} from "@/data/programs";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans/")({
  component: PlansPage,
});

function PlansPage() {
  const completedPlans = useProgressStore((s) => s.completedPlans);
  const selectedTrackId = useProgressStore((s) => s.selectedTrackId);
  const setSelectedTrackId = useProgressStore((s) => s.setSelectedTrackId);
  const ageBand = useProgressStore((s) => s.ageBand);

  const recommended = programTracks.filter((t) =>
    t.ageBands.includes(ageBand),
  );
  const other = programTracks.filter((t) => !t.ageBands.includes(ageBand));
  const ordered = [...recommended, ...other];

  const trackId = selectedTrackId;
  const plans = getPlansForTrack(trackId);
  const activeTrack = programTracks.find((t) => t.id === trackId);

  return (
    <AppShell title="Programs" subtitle="Youth → adult">
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-muted)]">
        Multi-day camps, shells progressions, install weeks, and in-season game
        week templates — filtered by your level on Home.
      </p>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:thin]">
        {ordered.map((t) => {
          const active = t.id === trackId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTrackId(t.id as ProgramTrackId)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap",
                active
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {t.shortName}
            </button>
          );
        })}
      </div>

      {activeTrack && (
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge>{SEASON_LABELS[activeTrack.season]}</Badge>
            <Badge variant="outline">
              {CONTACT_LABELS[activeTrack.contactCap]}
            </Badge>
            <Badge variant="secondary">{activeTrack.days} days</Badge>
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {activeTrack.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {activeTrack.summary}
          </p>
          <p className="mt-2 text-xs text-[var(--color-subtle)]">
            Ages: {activeTrack.ageBands.map((a) => AGE_BAND_LABELS[a]).join(" · ")}
          </p>
          <ul className="mt-3 space-y-1">
            {activeTrack.goals.map((g) => (
              <li key={g} className="text-sm text-[var(--color-fg)]">
                <span className="text-[var(--color-primary)]">·</span> {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            completed={completedPlans.includes(plan.id)}
          />
        ))}
      </div>

      <Link
        to="/safety"
        className="mt-8 mb-2 block text-center text-sm font-medium text-[var(--color-primary)]"
      >
        Review safety & contact standards →
      </Link>
    </AppShell>
  );
}
