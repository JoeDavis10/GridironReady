import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ConeDiagram } from "@/components/cone-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONE_SERIES_META, coneDrillDefs } from "@/data/cone-drills";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cones")({
  component: ConesPage,
});

const families: Array<{ id: "box" | "m" | "specialty"; label: string; blurb: string }> = [
  { id: "box", label: "Box", blurb: "40-yard squares · inside/outside · base & advanced" },
  { id: "m", label: "M patterns", blurb: "30-yard M cuts · sprint, shuffle, carioca valleys" },
  { id: "specialty", label: "Specialty", blurb: "360s, Figure 8s, Outside X, Inside X" },
];

function ConesPage() {
  const completedDrills = useProgressStore((s) => s.completedDrills);

  return (
    <AppShell title="Cone Agilities" subtitle="Coaching sheet · 12 patterns">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {CONE_SERIES_META.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CONE_SERIES_META.legend.map((item) => (
            <Badge key={item.style} variant="secondary">
              {item.label}
            </Badge>
          ))}
        </div>
      </section>

      {families.map((family) => {
        const items = coneDrillDefs.filter((d) => d.family === family.id);
        return (
          <section key={family.id} className="mt-8">
            <div className="mb-3">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                {family.label}
              </h2>
              <p className="text-xs text-[var(--color-subtle)]">{family.blurb}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {items.map((def) => {
                const done = completedDrills.includes(def.id);
                return (
                  <Link
                    key={def.id}
                    to="/drills/$drillId"
                    params={{ drillId: def.id }}
                    className={cn(
                      "block overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-[border-color,transform] duration-[var(--duration-fast)] active:scale-[0.99] hover:border-[var(--color-border-strong)]",
                    )}
                  >
                    <div className="grid grid-cols-[7.5rem_1fr] gap-0 sm:grid-cols-[9rem_1fr]">
                      <div className="border-r border-[var(--color-border)] bg-[var(--color-elevated)] p-2">
                        <ConeDiagram
                          diagramId={def.diagramId}
                          compact
                          showLegend={false}
                        />
                      </div>
                      <div className="flex flex-col justify-center p-3.5">
                        <div className="mb-1.5 flex flex-wrap gap-1">
                          <Badge variant={def.level === "advanced" ? "warn" : "default"}>
                            {def.level}
                          </Badge>
                          <Badge variant="outline">{def.totalYards} yd</Badge>
                          {done && <Badge variant="secondary">Done</Badge>}
                        </div>
                        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
                          {def.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                          {def.summary}
                        </p>
                        <p className="mt-2 text-[11px] text-[var(--color-subtle)]">
                          {def.movementMix.join(" · ")}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="mt-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          How to use in camp
        </h2>
        <ul className="mt-2 space-y-2 text-sm text-[var(--color-muted)]">
          <li>· Days 1–3: Base Inside/Outside Box + Base M only</li>
          <li>· Days 4–6: Add Advanced Box/M with carioca & shuffle</li>
          <li>· Days 7–10: 360s, Figure 8s, and X patterns for sharpness</li>
          <li>· Always non-contact — clear lanes, no finish-line collisions</li>
        </ul>
        <Button asChild className="mt-4 w-full" variant="secondary">
          <Link to="/plans">
            Open camp plan <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
