import { useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Gamepad2, Timer, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  competitiveGames,
  KIND_LABELS,
  type GameKind,
} from "@/data/games";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/games")({
  component: GamesLayout,
});

type FilterId = "all" | "playable" | GameKind;

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "playable", label: "Playable" },
  { id: "relay", label: KIND_LABELS.relay },
  { id: "race", label: KIND_LABELS.race },
  { id: "reaction", label: KIND_LABELS.reaction },
  { id: "team", label: KIND_LABELS.team },
  { id: "skill", label: KIND_LABELS.skill },
];

function GamesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/games" && pathname.startsWith("/games/")) {
    return <Outlet />;
  }
  return <GamesPage />;
}

function GamesPage() {
  const [filter, setFilter] = useState<FilterId>("all");

  const filtered = useMemo(() => {
    return competitiveGames.filter((g) => {
      if (filter === "all") return true;
      if (filter === "playable") return Boolean(g.playableId);
      return g.kind === filter;
    });
  }, [filter]);

  const playableCount = competitiveGames.filter((g) => g.playableId).length;

  return (
    <AppShell title="Competitive games" subtitle="Non-contact · camp energy">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]">
            <Gamepad2 className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Compete without contact
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
              {competitiveGames.length} field games · {playableCount} playable
              mini-games — relays, reaction wars, and skill gauntlets with zero
              tackling.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { icon: Zap, label: "High energy" },
          { icon: Users, label: "Team vs team" },
          { icon: Timer, label: "8–12 min" },
        ].map((x) => (
          <div
            key={x.label}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center"
          >
            <x.icon className="mx-auto mb-1 size-4 text-[var(--color-primary)]" aria-hidden />
            <p className="text-[11px] font-medium text-[var(--color-muted)]">{x.label}</p>
          </div>
        ))}
      </div>

      <div className="relative -mx-4 mt-6 mb-2">
        <div
          role="tablist"
          aria-label="Filter games. Swipe sideways for more."
          className={cn(
            "flex w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden",
            "overscroll-x-contain px-4 pb-1.5 touch-pan-x",
            "[-webkit-overflow-scrolling:touch] [scrollbar-width:thin]",
            "[scrollbar-color:var(--color-border-strong)_transparent]",
          )}
        >
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)]",
                  active
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {f.label}
              </button>
            );
          })}
          <span className="w-2 shrink-0" aria-hidden />
        </div>
      </div>

      <p className="mb-3 text-xs text-[var(--color-subtle)]">
        {filtered.length} game{filtered.length === 1 ? "" : "s"}
      </p>

      <section className="space-y-3">
        {filtered.map((game) => (
          <Link
            key={game.id}
            to="/games/$gameId"
            params={{ gameId: game.id }}
            className="block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-[border-color,transform] active:scale-[0.99] hover:border-[var(--color-border-strong)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <Badge>{KIND_LABELS[game.kind]}</Badge>
                  <Badge variant={game.intensity === "high" ? "warn" : "info"}>
                    {game.intensity}
                  </Badge>
                  {game.playableId && <Badge variant="outline">Playable</Badge>}
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">
                  {game.name}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {game.summary}
                </p>
                <p className="text-xs text-[var(--color-subtle)]">
                  {game.durationMin} min · {game.players}
                </p>
              </div>
              <ChevronRight className="mt-1 size-5 shrink-0 text-[var(--color-subtle)]" aria-hidden />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-muted)]">
            No games in that filter.
          </div>
        )}
      </section>
    </AppShell>
  );
}
