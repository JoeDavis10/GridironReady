import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AGE_BAND_LABELS,
  CONTACT_LABELS,
  type AgeBand,
} from "@/data/levels";
import { contactRulesByAge, safetyTopics } from "@/data/safety";
import { useProgressStore } from "@/store/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/safety")({
  component: SafetyPage,
});

const catLabel: Record<string, string> = {
  heat: "Heat",
  contact: "Contact",
  concussion: "Head",
  equipment: "Gear",
  culture: "Culture",
};

function SafetyPage() {
  const ageBand = useProgressStore((s) => s.ageBand);
  const setAgeBand = useProgressStore((s) => s.setAgeBand);
  const rules = contactRulesByAge[ageBand];

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/">
          <ArrowLeft aria-hidden /> Home
        </Link>
      </Button>

      <div className="mb-2 flex items-center gap-2 text-[var(--color-primary)]">
        <Shield className="size-5" aria-hidden />
        <p className="text-[11px] font-medium uppercase tracking-[0.14em]">
          Non-negotiables
        </p>
      </div>
      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        Safety & standards
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
        Pro-grade tackle football is built on progression, heat sense, and heads-up
        technique — for youth through adult.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(AGE_BAND_LABELS) as AgeBand[]).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAgeBand(a)}
            className={cn(
              "h-9 rounded-full border px-3 text-xs font-medium",
              ageBand === a
                ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-fg)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
            )}
          >
            {AGE_BAND_LABELS[a]}
          </button>
        ))}
      </div>

      <section className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-subtle)]">
          Default contact ceiling · {AGE_BAND_LABELS[ageBand]}
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-[var(--color-primary)]">
          {CONTACT_LABELS[rules.maxDefault]}
        </p>
        <ul className="mt-3 space-y-2">
          {rules.notes.map((n) => (
            <li key={n} className="text-sm text-[var(--color-muted)]">
              · {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 space-y-4">
        {safetyTopics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Badge>{catLabel[topic.category] ?? topic.category}</Badge>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              {topic.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{topic.summary}</p>
            <ul className="mt-3 space-y-1.5">
              {topic.points.map((p) => (
                <li key={p} className="text-sm leading-relaxed text-[var(--color-fg)]">
                  <span className="text-[var(--color-primary)]">·</span> {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
