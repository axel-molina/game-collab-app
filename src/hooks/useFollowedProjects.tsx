import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch projects that the user has saved/followed
export function useFollowedProjects(userId: string | undefined) {
  return useQuery({
    queryKey: ["followed-projects", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("project_followers")
        .select("project_id")
        .eq("user_id", userId);

      if (error) throw error;
      return data.map((item) => item.project_id);
    },
    enabled: !!userId,
  });
}
