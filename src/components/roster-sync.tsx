import { useEffect } from "react";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { useRosterStore } from "@/store/roster";

/**
 * Binds Supabase session → roster cloud user. Mount once under providers.
 */
export function RosterCloudSync() {
  const { user, configured, isPending } = useSupabaseAuth();
  const setCloudUser = useRosterStore((s) => s.setCloudUser);
  const cloudUserId = useRosterStore((s) => s.cloudUserId);

  useEffect(() => {
    if (!configured || isPending) return;
    const next = user?.id ?? null;
    if (next === cloudUserId) return;
    void setCloudUser(next);
  }, [configured, isPending, user?.id, cloudUserId, setCloudUser]);

  return null;
}
