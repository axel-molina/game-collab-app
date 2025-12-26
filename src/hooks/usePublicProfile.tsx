import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

// Fetch public profile by username
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url, created_at")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;
      return data as PublicProfile | null;
    },
    enabled: !!username,
  });
}
