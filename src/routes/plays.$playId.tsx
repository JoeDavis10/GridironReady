import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PlayDiagramAnimator } from "@/components/play-diagram-animator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLadderPlays, getPlayById } from "@/data/plays";
import { POSITION_LABELS } from "@/data/positions";

export const Route = createFileRoute("/plays/$playId")({
  component: PlayDetailPage,
});

function PlayDetailPage() {
  const { playId } = Route.useParams();
  const play = getPlayById(playId);
  if (!play) throw notFound();

  const ladder = getLadderPlays();
  const stepIdx =
    play.ladderStep != null
      ? ladder.findIndex((p) => p.id === play.id)
      : -1;
  const prev = stepIdx > 0 ? ladder[stepIdx - 1] : undefined;
  const next =
    stepIdx >= 0 && stepIdx < ladder.length - 1
      ? ladder[stepIdx + 1]
      : undefined;

  return (
    <AppShell hideNav>
      <div className="w-full min-w-0">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link to="/plays">
            <ArrowLeft aria-hidden /> Playbook
          </Link>
        </Button>

        <div className="flex flex-wrap gap-1.5">
          {play.ladderStep != null && (
            <Badge className="tabular-nums">
              Ladder {play.ladderStep}/{ladder.length}
            </Badge>
          )}
          <Badge variant="outline">{play.shortName}</Badge>
          <Badge variant="secondary">{play.side}</Badge>
          <Badge variant="outline">{play.personnel}</Badge>
        </div>
        <h1 className="mt-2 break-words font-display text-[2rem] font-semibold leading-none tracking-tight">
          {play.name}
        </h1>
        {play.ladderSkill && (
          <p className="mt-1.5 text-sm font-medium text-[var(--color-primary)]">
            {play.ladderSkill}
          </p>
        )}
        <p className="mt-1 text-sm text-[var(--color-subtle)]">{play.formation}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
          {play.summary}
        </p>

        {play.ladderTell && (
          <div className="mt-4 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_40%,var(--color-surface))] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]">
              Coach tell
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-fg)]">
              {play.ladderTell}
            </p>
          </div>
        )}

        <div className="mt-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            When to call
          </p>
          <p className="mt-1 text-sm text-[var(--color-fg)]">{play.whenToCall}</p>
          <ul className="mt-3 space-y-1.5">
            {play.keys.map((k) => (
              <li key={k} className="flex gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                <span className="min-w-0">{k}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 break-words text-xs text-[var(--color-subtle)]">
            Rooms:{" "}
            {play.relatedPositionIds.map((id) => POSITION_LABELS[id]).join(" · ")}
          </p>
        </div>

        <div className="mt-5 w-full min-w-0">
          <PlayDiagramAnimator play={play} />
        </div>

        {(prev || next) && (
          <div className="mt-6 flex w-full min-w-0 gap-2">
            {prev ? (
              <Button asChild variant="outline" className="min-w-0 flex-1">
                <Link to="/plays/$playId" params={{ playId: prev.id }}>
                  <ArrowLeft className="size-4 shrink-0" />
                  <span className="truncate">
                    {prev.ladderStep}. {prev.shortName}
                  </span>
                </Link>
              </Button>
            ) : (
              <div className="min-w-0 flex-1" />
            )}
            {next ? (
              <Button asChild variant="secondary" className="min-w-0 flex-1">
                <Link to="/plays/$playId" params={{ playId: next.id }}>
                  <span className="truncate">
                    {next.ladderStep}. {next.shortName}
                  </span>
                  <ArrowRight className="size-4 shrink-0" />
                </Link>
              </Button>
            ) : (
              <div className="min-w-0 flex-1" />
            )}
          </div>
        )}

        <Button asChild variant="outline" className="mt-3 mb-4 w-full">
          <Link to="/roster">Assign from roster</Link>
        </Button>
      </div>
    </AppShell>
  );
}
