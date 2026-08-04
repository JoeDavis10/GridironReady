import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Shapes } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DrillCard } from "@/components/drill-card";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  drills,
  getDrillsForAge,
  type DrillCategory,
} from "@/data/drills";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drills/")({
  component: DrillsPage,
});

type FilterId = DrillCategory | "all" | "cones";

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "cones", label: "Cone sheet" },
  { id: "fundamentals", label: CATEGORY_LABELS.fundamentals },
  { id: "warmup", label: CATEGORY_LABELS.warmup },
  { id: "conditioning", label: CATEGORY_LABELS.conditioning },
  { id: "agility", label: CATEGORY_LABELS.agility },
  { id: "strength", label: CATEGORY_LABELS.strength },
  { id: "position", label: CATEGORY_LABELS.position },
  { id: "team", label: CATEGORY_LABELS.team },
  { id: "special-teams", label: CATEGORY_LABELS["special-teams"] },
  { id: "cooldown", label: CATEGORY_LABELS.cooldown },
];

function DrillsPage() {
  const [category, setCategory] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const completedDrills = useProgressStore((s) => s.completedDrills);
  const ageBand = useProgressStore((s) => s.ageBand);
  const contactCap = useProgressStore((s) => s.contactCap);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<FilterId, HTMLButtonElement>>(new Map());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = getDrillsForAge(ageBand, contactCap);
    return pool.filter((d) => {
      if (category === "cones") {
        if (d.series !== "cone-agilities") return false;
      } else if (category !== "all" && d.category !== category) {
        return false;
      }
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.equipment.some((e) => e.toLowerCase().includes(q)) ||
        (d.movementMix?.some((m) => m.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [category, query, ageBand, contactCap]);

  const updateScrollHints = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(max - el.scrollLeft > 2);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollHints();
    el.addEventListener("scroll", updateScrollHints, { passive: true });
    const ro = new ResizeObserver(updateScrollHints);
    ro.observe(el);
    // Re-check after fonts/layout settle
    const t = window.setTimeout(updateScrollHints, 100);
    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Keep the active chip fully on-screen (so Strength / Cool-down aren't clipped)
  useEffect(() => {
    const chip = chipRefs.current.get(category);
    if (!chip) return;
    chip.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    const t = window.setTimeout(updateScrollHints, 320);
    return () => window.clearTimeout(t);
  }, [category]);

  return (
    <AppShell title="Drill library" subtitle="Non-contact">
      <Link
        to="/cones"
        className="mb-4 flex items-center justify-between gap-3 rounded-[var(--radius-xl)] border border-[color-mix(in_oklab,var(--color-primary)_35%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-primary-dim)_45%,var(--color-surface))] p-3.5"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]">
            <Shapes className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-fg)]">
              Cone Agilities sheet
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              12 patterns with diagrams · Box, M, 360, 8, X
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" tabIndex={-1}>
          Open
        </Button>
      </Link>

      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-subtle)]"
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drills, equipment…"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-3 text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-subtle)] focus:border-[var(--color-border-strong)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-primary)_35%,transparent)]"
        />
      </div>

      {/*
        Full-bleed horizontal chip scroller.
        - overflow-x-auto + touch-pan-x for native swipe
        - flex-nowrap + shrink-0 so chips never wrap/collapse
        - edge fades signal more filters off-screen
        - selecting a chip auto-scrolls it into view
      */}
      <div className="relative -mx-4 mb-5">
        <div
          ref={scrollerRef}
          role="tablist"
          aria-label="Filter drills by category. Swipe sideways for more filters."
          className={cn(
            "flex w-full max-w-none flex-nowrap gap-2 overflow-x-auto overflow-y-hidden",
            "overscroll-x-contain px-4 pb-1.5",
            "touch-pan-x [-webkit-overflow-scrolling:touch]",
            "[scrollbar-width:thin] [scrollbar-color:var(--color-border-strong)_transparent]",
          )}
        >
          {filters.map((f) => {
            const active = category === f.id;
            return (
              <button
                key={f.id}
                ref={(node) => {
                  if (node) chipRefs.current.set(f.id, node);
                  else chipRefs.current.delete(f.id);
                }}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(f.id)}
                className={cn(
                  "h-9 shrink-0 grow-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-[var(--duration-fast)]",
                  active
                    ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {f.label}
              </button>
            );
          })}
          {/* Trailing spacer so Cool-down fully clears the right edge */}
          <span className="inline-block w-3 shrink-0 grow-0 basis-3" aria-hidden />
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent transition-opacity duration-[var(--duration-fast)]",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent transition-opacity duration-[var(--duration-fast)]",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <p className="mb-3 text-xs text-[var(--color-subtle)]">
        {filtered.length} drill{filtered.length === 1 ? "" : "s"} · all non-contact
      </p>

      <div className="space-y-3">
        {filtered.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            done={completedDrills.includes(drill.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm text-[var(--color-muted)]">
            No drills match that search.
          </div>
        )}
      </div>
    </AppShell>
  );
}
