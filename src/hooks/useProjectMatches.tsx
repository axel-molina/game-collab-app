import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Project } from "./useProjects";

export function useProjectMatches() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["project-matches", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // 1. Call the RPC function to get matched project IDs
      const { data: matches, error: matchesError } = await supabase.rpc(
        "get_project_matches",
        { profile_uuid: user.id }
      );

      if (matchesError) throw matchesError;
      if (!matches || matches.length === 0) return [];

      const projectIds = matches.map((m: any) => m.project_id);

      // 2. Fetch full project details for these IDs
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles(username),
          project_images(*),
          project_tasks(*),
          project_positions(*)
        `
        )
        .in("id", projectIds)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      return projects as Project[];
    },
    enabled: !!user?.id,
  });
}
