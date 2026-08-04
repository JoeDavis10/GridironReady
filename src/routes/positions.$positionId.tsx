import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DrillCard } from "@/components/drill-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDrillById } from "@/data/drills";
import { AGE_BAND_LABELS } from "@/data/levels";
import { getPositionById } from "@/data/positions";
import { useProgressStore } from "@/store/progress";

export const Route = createFileRoute("/positions/$positionId")({
  component: PositionDetailPage,
});

function PositionDetailPage() {
  const { positionId } = Route.useParams();
  const pos = getPositionById(positionId);
  if (!pos) throw notFound();

  const ageBand = useProgressStore((s) => s.ageBand);
  const ageNote = pos.ageNotes[ageBand];
  const drills = pos.drillIds
    .map((id) => getDrillById(id))
    .filter(Boolean);

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/positions">
          <ArrowLeft aria-hidden /> Positions
        </Link>
      </Button>

      <div className="mb-2 flex flex-wrap gap-1.5">
        <Badge variant="default">{pos.shortName}</Badge>
        <Badge variant="outline">{pos.group}</Badge>
      </div>
      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        {pos.name}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
        {pos.summary}
      </p>

      {ageNote && (
        <div className="mt-5 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_30%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_35%,var(--color-surface))] p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]">
            {AGE_BAND_LABELS[ageBand]} emphasis
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg)]">
            {ageNote}
          </p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Keys to the room
        </h2>
        <ul className="space-y-2">
          {pos.keys.map((k) => (
            <li
              key={k}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-muted)]"
            >
              {k}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
          Featured drills
        </h2>
        <div className="space-y-3">
          {drills.map(
            (d) => d && <DrillCard key={d.id} drill={d} />,
          )}
        </div>
      </section>
    </AppShell>
  );
}
