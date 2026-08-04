import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export type SupabaseAuthState = {
  configured: boolean;
  session: Session | null;
  user: User | null;
  isPending: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthState | null>(null);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(supabaseConfigured);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setIsPending(false);
      return;
    }

    let cancelled = false;
    void sb.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setSession(data.session);
        setIsPending(false);
      }
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setIsPending(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    const sb = getSupabase();
    if (!sb) throw new Error("Supabase is not configured");
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo ?? `${origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<SupabaseAuthState>(
    () => ({
      configured: supabaseConfigured,
      session,
      user: session?.user ?? null,
      isPending,
      signInWithGoogle,
      signOut,
    }),
    [session, isPending, signInWithGoogle, signOut],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth(): SupabaseAuthState {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) {
    return {
      configured: false,
      session: null,
      user: null,
      isPending: false,
      signInWithGoogle: async () => {
        throw new Error("SupabaseAuthProvider missing");
      },
      signOut: async () => {},
    };
  }
  return ctx;
}
