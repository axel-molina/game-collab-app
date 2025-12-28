import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  roles?: Array<{ id: number; name: string }>;
  technologies?: Array<{ id: number; name: string }>;
}

// Fetch public profile by username
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, bio, created_at")
        .eq("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("profile_roles")
        .select("roles(id, name)")
        .eq("profile_id", profile.id);

      if (rolesError) throw rolesError;

      // Fetch technologies
      const { data: techsData, error: techsError } = await supabase
        .from("profile_technologies")
        .select("technology_id, technologies(id, name)")
        .eq("profile_id", profile.id);

      if (techsError) throw techsError;

      return {
        ...profile,
        roles: rolesData?.map((r) => r.roles) as any[],
        technologies: techsData?.map((t) => t.technologies) as any[],
      } as PublicProfile;
    },
    enabled: !!username,
  });
}
