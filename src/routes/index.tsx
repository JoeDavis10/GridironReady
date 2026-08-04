import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
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
            Programs, fundamentals, position rooms, contact progressions, and
            competitive games — built for youth through adult tackle football.
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
            <Button asChild variant="secondary" size="lg">
              <Link to="/plans">Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Level picker */}
      <section className="mt-5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          Your level
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none]">
          {(Object.keys(AGE_BAND_LABELS) as AgeBand[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAgeBand(a);
                const next = programTracks.find((t) => t.ageBands.includes(a));
                if (next) setSelectedTrackId(next.id);
              }}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap",
                ageBand === a
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {AGE_BAND_LABELS[a]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          Contact ceiling
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none]">
          {(Object.keys(CONTACT_LABELS) as ContactLevel[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContactCap(c)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3 text-xs font-medium whitespace-nowrap",
                contactCap === c
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {CONTACT_LABELS[c]}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="grid grid-cols-[1fr_7.5rem] gap-0">
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--color-primary)]">
              <Shapes className="size-4" aria-hidden />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em]">
                Animated COD
              </p>
            </div>
            <h2 className="font-display text-xl font-semibold leading-tight tracking-tight">
              Cone Agilities
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
              12 patterns with step-by-step motion and coaching cues.
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/cones">
                Open sheet <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="border-l border-[var(--color-border)] bg-[var(--color-elevated)] p-1.5">
            <ConeDiagram
              diagramId="advanced-inside-box"
              compact
              showLegend={false}
            />
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/roster"
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
        >
          <Users className="mb-2 size-4 text-[var(--color-primary)]" aria-hidden />
          <p className="text-sm font-semibold">Roster & eval</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">Position fit</p>
        </Link>
        <Link
          to="/safety"
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
        >
          <Shield className="mb-2 size-4 text-[var(--color-primary)]" aria-hidden />
          <p className="text-sm font-semibold">Safety</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">Standards</p>
        </Link>
        <Link
          to="/drills"
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
        >
          <BookOpen className="mb-2 size-4 text-[var(--color-primary)]" aria-hidden />
          <p className="text-sm font-semibold">Drill library</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">{drills.length}+ drills</p>
        </Link>
        <Link
          to="/games"
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
        >
          <Gamepad2 className="mb-2 size-4 text-[var(--color-primary)]" aria-hidden />
          <p className="text-sm font-semibold">Games</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">Compete</p>
        </Link>
      </div>

      <Link
        to="/progress"
        className="mt-4 block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              {track.shortName} progress
            </p>
            <p className="font-display text-2xl font-semibold tabular">
              {trackDone}
              <span className="text-[var(--color-subtle)]">/{trackPlans.length}</span>{" "}
              <span className="text-base font-medium text-[var(--color-muted)]">
                days
              </span>
            </p>
          </div>
          <span className="text-sm tabular text-[var(--color-primary)]">
            {progressPct}%
          </span>
        </div>
        <Progress value={progressPct} />
      </Link>

      {today && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Today's practice
            </h2>
            <Link
              to="/plans"
              className="text-sm font-medium text-[var(--color-primary)]"
            >
              All programs
            </Link>
          </div>
          <PlanCard
            plan={today}
            featured
            completed={completedPlans.includes(today.id)}
          />
        </section>
      )}

      <section className="mt-8 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Featured drills
          </h2>
          <Link to="/drills" className="text-sm font-medium text-[var(--color-primary)]">
            Library
          </Link>
        </div>
        <div className="space-y-3">
          {featuredDrills.map((drill) => (
            <DrillCard key={drill.id} drill={drill} compact />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
