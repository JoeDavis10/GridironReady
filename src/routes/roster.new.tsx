import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { POSITION_LABELS, type PositionId } from "@/data/positions";
import { useRosterStore } from "@/store/roster";

export const Route = createFileRoute("/roster/new")({
  component: NewPlayerPage,
});

function NewPlayerPage() {
  const navigate = useNavigate();
  const addPlayer = useRosterStore((s) => s.addPlayer);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [gradeOrYear, setGradeOrYear] = useState("");
  const [listedPosition, setListedPosition] = useState<PositionId | "">("");

  const canSave = firstName.trim() && lastName.trim();

  return (
    <AppShell hideNav>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/roster">
          <ArrowLeft aria-hidden /> Roster
        </Link>
      </Button>
      <h1 className="font-display text-[2rem] font-semibold leading-none tracking-tight">
        Add player
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Start with identity — traits and measurables on the next screen.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSave) return;
          const id = addPlayer({
            firstName,
            lastName,
            number: number || undefined,
            gradeOrYear: gradeOrYear || undefined,
            listedPosition: listedPosition || undefined,
          });
          void navigate({ to: "/roster/$playerId", params: { playerId: id } });
        }}
      >
        <Field label="First name">
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Last name">
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Number">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={inputClass}
              inputMode="numeric"
            />
          </Field>
          <Field label="Grade / year">
            <input
              value={gradeOrYear}
              onChange={(e) => setGradeOrYear(e.target.value)}
              placeholder="Jr, 10, RS-Fr…"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Listed position">
          <select
            value={listedPosition}
            onChange={(e) =>
              setListedPosition((e.target.value || "") as PositionId | "")
            }
            className={inputClass}
          >
            <option value="">Unlisted</option>
            {(Object.keys(POSITION_LABELS) as PositionId[]).map((id) => (
              <option key={id} value={id}>
                {POSITION_LABELS[id]}
              </option>
            ))}
          </select>
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={!canSave}>
          Create & rate traits
        </Button>
      </form>
    </AppShell>
  );
}

const inputClass =
  "h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-primary)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}
