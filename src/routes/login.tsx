import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { supabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending, signInWithGoogle } = useSupabaseAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPending && user) {
    return <Navigate to="/roster" />;
  }

  return (
    <AppShell title="Coach sign-in" subtitle="Gridiron Ready" hideNav>
      <section className="mt-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Sync your roster in the cloud
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          Sign in with Google to save players, traits, and drill evals to your
          account — available on every device.
        </p>

        {!supabaseConfigured ? (
          <p className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 text-sm text-[var(--color-muted)]">
            Cloud auth is not configured in this environment. Roster still works
            on-device.
          </p>
        ) : (
          <Button
            size="lg"
            className="mt-5 w-full"
            disabled={busy || isPending}
            onClick={() => {
              setBusy(true);
              setError(null);
              void signInWithGoogle()
                .catch((e: unknown) => {
                  setError(e instanceof Error ? e.message : "Sign-in failed");
                  setBusy(false);
                });
            }}
          >
            {busy ? "Redirecting…" : "Continue with Google"}
          </Button>
        )}

        {error && (
          <p className="mt-3 text-sm text-[var(--color-warn)]">{error}</p>
        )}

        <p className="mt-4 text-xs text-[var(--color-subtle)]">
          Testing mode may limit Google sign-in to pre-approved coaches.
        </p>
      </section>

      <Button asChild variant="ghost" className="mt-4 w-full">
        <Link to="/roster">Use roster without account</Link>
      </Button>
    </AppShell>
  );
}
