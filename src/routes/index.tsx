import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  LayoutGrid,
  Shield,
  Shapes,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PlanCard } from "@/components/plan-card";
import { DrillCard } from "@/components/drill-card";
import { ConeDiagram } from "@/components/cone-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { drills } from "@/data/drills";
import { plays } from "@/data/plays";
import {
  AGE_BAND_LABELS,
  CONTACT_LABELS,
  type AgeBand,
  type ContactLevel,
} from "@/data/levels";
import {
  getPlansForTrack,
  getTrackById,
  programTracks,
} from "@/data/programs";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const completedPlans = useProgressStore((s) => s.completedPlans);
  const activeDay = useProgressStore((s) => s.activeDay);
  const ageBand = useProgressStore((s) => s.ageBand);
  const contactCap = useProgressStore((s) => s.contactCap);
  const selectedTrackId = useProgressStore((s) => s.selectedTrackId);
  const setAgeBand = useProgressStore((s) => s.setAgeBand);
  const setContactCap = useProgressStore((s) => s.setContactCap);
  const setSelectedTrackId = useProgressStore((s) => s.setSelectedTrackId);

  const track = getTrackById(selectedTrackId) ?? programTracks[2]!;
  const trackPlans = getPlansForTrack(track.id);
  const today =
    trackPlans.find((p) => p.day === activeDay) ?? trackPlans[0] ?? trackPlans[0];
  const trackDone = trackPlans.filter((p) => completedPlans.includes(p.id)).length;
  const progressPct = trackPlans.length
    ? Math.round((trackDone / trackPlans.length) * 100)
    : 0;

  const featuredDrills = drills.filter((d) =>
    [
      "form-tackle-fit-progression",
      "cone-base-inside-box",
      "seven-on-seven",
      "inside-run-thud",
    ].includes(d.id),
  );

  const featuredPlays = plays.slice(0, 3);

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 100% 0%, var(--color-primary), transparent 55%)",
          }}
        />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Youth → adult</Badge>
            <Badge variant="outline">Tackle football</Badge>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-subtle)]">
              Gridiron Ready
            </p>
            <h1 className="font-display text-[2.25rem] font-semibold leading-[0.95] tracking-tight text-[var(--color-fg)]">
              Full-field
              <br />
              football training.
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
            Programs, play diagrams with role animations, roster cloud sync, and
            competitive games — youth through adult tackle football.
          </p>
          <div className="flex flex-wrap gap-2">
            {today && (
              <Button asChild size="lg">
                <Link to="/plans/$planId" params={{ planId: today.id }}>
                  Continue day {today.day}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="secondary">
              <Link to="/plays">
                <LayoutGrid aria-hidden /> Playbook
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/roster">
                <Users aria-hidden /> Roster
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Today's program
          </h2>
          <Link
            to="/plans"
            className="text-xs font-medium text-[var(--color-primary)]"
          >
            All programs
          </Link>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
                {track.name}
              </p>
              <p className="font-display text-xl font-semibold tracking-tight">
                {today?.title ?? "Select a track"}
              </p>
            </div>
            <Badge variant="secondary">{progressPct}%</Badge>
          </div>
          <Progress value={progressPct} className="mt-3" />
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(AGE_BAND_LABELS) as AgeBand[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setAgeBand(id)}
                className={cn(
                  "h-8 rounded-full border px-2.5 text-[11px] font-medium",
                  ageBand === id
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {AGE_BAND_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(CONTACT_LABELS) as ContactLevel[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setContactCap(id)}
                className={cn(
                  "h-8 rounded-full border px-2.5 text-[11px] font-medium",
                  contactCap === id
                    ? "border-transparent bg-[var(--color-primary-dim)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {CONTACT_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {programTracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTrackId(t.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3 text-xs font-medium",
                  selectedTrackId === t.id
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] text-[var(--color-muted)]",
                )}
              >
                {t.shortName ?? t.name}
              </button>
            ))}
          </div>
          {today && (
            <div className="mt-4">
              <PlanCard plan={today} featured />
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Play diagrams
          </h2>
          <Link to="/plays" className="text-xs font-medium text-[var(--color-primary)]">
            Full playbook
          </Link>
        </div>
        <div className="space-y-2">
          {featuredPlays.map((play) => (
            <Link
              key={play.id}
              to="/plays/$playId"
              params={{ playId: play.id }}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">{play.shortName}</Badge>
                  <Badge variant="secondary">{play.side}</Badge>
                </div>
                <p className="mt-1 font-display text-base font-semibold tracking-tight">
                  {play.name}
                </p>
                <p className="truncate text-xs text-[var(--color-subtle)]">
                  {play.roles.length} roles · {play.formation}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-[var(--color-subtle)]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-2">
        <QuickLink to="/roster" icon={Users} label="Roster" sub="Cloud sync" />
        <QuickLink to="/drills" icon={BookOpen} label="Drills" sub="Library" />
        <QuickLink to="/cones" icon={Shapes} label="Cone sheet" sub="Patterns" />
        <QuickLink to="/safety" icon={Shield} label="Safety" sub="Contact rules" />
      </section>

      <section className="mt-6 space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Featured drills
          </h2>
          <Link to="/drills" className="text-xs font-medium text-[var(--color-primary)]">
            All drills
          </Link>
        </div>
        <div className="space-y-2">
          {featuredDrills.map((d) => (
            <DrillCard key={d.id} drill={d} />
          ))}
        </div>
        {featuredDrills[1]?.diagramId && (
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Sample cone pattern
            </p>
            <ConeDiagram diagramId={featuredDrills[1].diagramId} compact />
          </div>
        )}
      </section>
    </AppShell>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
  sub,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
    >
      <Icon className="mb-2 size-5 text-[var(--color-primary)]" />
      <p className="font-display text-base font-semibold tracking-tight">{label}</p>
      <p className="text-[11px] text-[var(--color-subtle)]">{sub}</p>
    </Link>
  );
}
