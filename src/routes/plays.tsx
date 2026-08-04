import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Shield, Swords } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plays, type PlaySide } from "@/data/plays";
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
  const [side, setSide] = useState<PlaySide | "all">("all");
  const list =
    side === "all" ? plays : plays.filter((p) => p.side === side);

  return (
    <AppShell title="Playbook" subtitle="Diagrams & roles">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Full-role play animations
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
          Step through snap, mesh, and finish with every assignment labeled —
          use with your roster when installing.
        </p>
        <Button asChild size="sm" variant="secondary" className="mt-3">
          <Link to="/roster">
            Open roster <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </section>

      <div className="mt-4 flex gap-2">
        {(
          [
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
              "h-9 rounded-full border px-3.5 text-xs font-medium",
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
          <li key={play.id}>
            <Link
              to="/plays/$playId"
              params={{ playId: play.id }}
              className="block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color] hover:border-[var(--color-border-strong)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
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
                  <p className="mt-1.5 font-display text-xl font-semibold tracking-tight">
                    {play.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-subtle)]">
                    {play.formation}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {play.summary}
                  </p>
                  <p className="mt-2 text-[11px] text-[var(--color-subtle)]">
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
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
