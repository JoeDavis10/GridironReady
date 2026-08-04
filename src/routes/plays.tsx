import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Shield, Swords } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLadderPlays, plays, type Play, type PlaySide } from "@/data/plays";
import { POSITION_LABELS } from "@/data/positions";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plays")({
  component: PlaysLayout,
});

function PlaysLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/plays" && pathname.startsWith("/plays/")) {
    return <Outlet />;
  }
  return <PlaysIndexPage />;
}

function PlaysIndexPage() {
  const [side, setSide] = useState<PlaySide | "all" | "ladder">("ladder");
  const ladder = getLadderPlays();
  const extra = plays.filter((p) => p.ladderStep == null);

  const list: Play[] =
    side === "ladder"
      ? ladder
      : side === "all"
        ? plays
        : plays.filter((p) => p.side === side);

  return (
    <AppShell title="Playbook" subtitle="OL ladder & diagrams">
      <div className="w-full min-w-0">
        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Lineman training ladder
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
            {ladder.length} plays in install order — from Dive through full
            Counter. Each step has a clear tell so you know when the room is ready
            to move up.
          </p>
          <div className="mt-3 flex w-full min-w-0 flex-wrap gap-1.5">
            {ladder.map((p) => (
              <Link
                key={p.id}
                to="/plays/$playId"
                params={{ playId: p.id }}
                className="inline-flex h-8 max-w-full shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-elevated)] px-2.5 text-[11px] font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)]"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-[var(--color-primary-fg)]">
                  {p.ladderStep}
                </span>
                <span className="truncate">{p.shortName}</span>
              </Link>
            ))}
          </div>
          <Button asChild size="sm" variant="secondary" className="mt-3">
            <Link to="/roster">
              Open roster <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </section>

        <div className="mt-4 flex w-full min-w-0 flex-wrap gap-2">
          {(
            [
              ["ladder", "OL Ladder"],
              ["all", "All"],
              ["offense", "Offense"],
              ["defense", "Defense"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSide(id)}
              className={cn(
                "h-9 shrink-0 touch-manipulation rounded-full border px-3.5 text-xs font-medium",
                side === id
                  ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {list.map((play) => (
            <li key={play.id} className="min-w-0">
              <PlayCard
                play={play}
                showStep={side === "ladder" || play.ladderStep != null}
              />
            </li>
          ))}
        </ul>

        {side === "ladder" && extra.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
              Also in the book
            </p>
            <ul className="space-y-2">
              {extra.map((play) => (
                <li key={play.id} className="min-w-0">
                  <PlayCard play={play} showStep={false} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function PlayCard({ play, showStep }: { play: Play; showStep: boolean }) {
  return (
    <Link
      to="/plays/$playId"
      params={{ playId: play.id }}
      className="block w-full min-w-0 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color] hover:border-[var(--color-border-strong)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {showStep && play.ladderStep != null && (
              <Badge className="tabular-nums">Step {play.ladderStep}</Badge>
            )}
            <Badge variant="outline">{play.shortName}</Badge>
            <Badge variant="secondary">
              {play.side === "offense" ? (
                <span className="inline-flex items-center gap-1">
                  <Swords className="size-3" /> Offense
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Shield className="size-3" /> Defense
                </span>
              )}
            </Badge>
          </div>
          <p className="mt-1.5 break-words font-display text-xl font-semibold tracking-tight">
            {play.name}
          </p>
          {play.ladderSkill && (
            <p className="mt-0.5 text-xs font-medium text-[var(--color-primary)]">
              {play.ladderSkill}
            </p>
          )}
          <p className="mt-0.5 text-xs text-[var(--color-subtle)]">
            {play.formation}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
            {play.summary}
          </p>
          {play.ladderTell && (
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-fg)]">
              <span className="font-semibold text-[var(--color-subtle)]">Tell: </span>
              {play.ladderTell}
            </p>
          )}
          <p className="mt-2 break-words text-[11px] text-[var(--color-subtle)]">
            {play.roles.length} roles ·{" "}
            {play.relatedPositionIds
              .slice(0, 4)
              .map((id) => POSITION_LABELS[id].split(" ")[0])
              .join(" · ")}
          </p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--color-subtle)]" />
      </div>
    </Link>
  );
}
