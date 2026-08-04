import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MiniGame } from "@/components/mini-games";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGameById, KIND_LABELS } from "@/data/games";

export const Route = createFileRoute("/games/$gameId")({
  component: GameDetailPage,
});

function GameDetailPage() {
  const { gameId } = Route.useParams();
  const game = getGameById(gameId);
  if (!game) throw notFound();

  return (
    <AppShell hideNav>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/games">
            <ArrowLeft aria-hidden /> Games
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge>{KIND_LABELS[game.kind]}</Badge>
          <Badge variant={game.intensity === "high" ? "warn" : "info"}>
            {game.intensity}
          </Badge>
          <Badge variant="outline">Non-contact</Badge>
          {game.playableId && <Badge variant="default">Mini-game</Badge>}
        </div>
        <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
          {game.name}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {game.summary}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]">
          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
            {game.durationMin} min
          </span>
          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
            {game.players}
          </span>
        </div>
      </div>

      {game.playableId && (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            Play it here
          </h2>
          <MiniGame id={game.playableId} />
        </section>
      )}

      <section className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center gap-2 text-[var(--color-primary)]">
          <Target className="size-4" aria-hidden />
          <h2 className="text-xs font-medium uppercase tracking-[0.12em]">Objective</h2>
        </div>
        <p className="text-sm text-[var(--color-fg)]">{game.objective}</p>
      </section>

      <Section title="Setup">
        <ul className="space-y-2">
          {game.setup.map((s) => (
            <li key={s} className="flex gap-2 text-sm text-[var(--color-muted)]">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.equipment.map((e) => (
            <Badge key={e} variant="secondary">
              {e}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="How to play">
        <ol className="space-y-3">
          {game.howToPlay.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-elevated)] font-display text-xs font-semibold text-[var(--color-primary)]">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[var(--color-muted)]">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Scoring" icon={Trophy}>
        <ul className="space-y-2">
          {game.scoring.map((s) => (
            <li
              key={s}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-fg)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Coaching cues">
        <ul className="space-y-2">
          {game.coachingCues.map((c) => (
            <li key={c} className="text-sm text-[var(--color-muted)]">
              · {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Safety" icon={ShieldAlert}>
        <ul className="space-y-2">
          {game.safety.map((s) => (
            <li key={s} className="text-sm text-[var(--color-warn)]">
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <div className="h-6" />
    </AppShell>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        {Icon && <Icon className="size-4 text-[var(--color-primary)]" />}
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
