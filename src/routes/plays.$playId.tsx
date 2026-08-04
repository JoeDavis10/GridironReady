import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PlayDiagramAnimator } from "@/components/play-diagram-animator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlayById } from "@/data/plays";
import { POSITION_LABELS } from "@/data/positions";

export const Route = createFileRoute("/plays/$playId")({
  component: PlayDetailPage,
});

function PlayDetailPage() {
  const { playId } = Route.useParams();
  const play = getPlayById(playId);
  if (!play) throw notFound();

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
        <Link to="/plays">
          <ArrowLeft aria-hidden /> Playbook
        </Link>
      </Button>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline">{play.shortName}</Badge>
        <Badge variant="secondary">{play.side}</Badge>
        <Badge variant="outline">{play.personnel}</Badge>
      </div>
      <h1 className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-tight">
        {play.name}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-subtle)]">{play.formation}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
        {play.summary}
      </p>

      <div className="mt-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          When to call
        </p>
        <p className="mt-1 text-sm text-[var(--color-fg)]">{play.whenToCall}</p>
        <ul className="mt-3 space-y-1.5">
          {play.keys.map((k) => (
            <li key={k} className="flex gap-2 text-sm text-[var(--color-muted)]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              {k}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--color-subtle)]">
          Rooms:{" "}
          {play.relatedPositionIds.map((id) => POSITION_LABELS[id]).join(" · ")}
        </p>
      </div>

      <div className="mt-5">
        <PlayDiagramAnimator play={play} />
      </div>

      <Button asChild variant="outline" className="mt-6 mb-4 w-full">
        <Link to="/roster">Assign from roster</Link>
      </Button>
    </AppShell>
  );
}
