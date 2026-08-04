import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

/**
 * OAuth return path. Supabase PKCE exchanges the code in the URL for a session.
 */
function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setMessage("Supabase is not configured.");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        // getSession processes the URL hash/code when detectSessionInUrl is on
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          // Fallback: exchange code if present in query
          const url = new URL(window.location.href);
          const code = url.searchParams.get("code");
          if (code) {
            const ex = await sb.auth.exchangeCodeForSession(code);
            if (ex.error) throw ex.error;
          }
        }
        if (!cancelled) {
          void navigate({ to: "/roster", replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(
            err instanceof Error ? err.message : "Sign-in failed. Try again.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="grid min-h-[50dvh] place-items-center px-4 text-center text-sm text-[var(--color-muted)]">
      {message}
    </div>
  );
}
