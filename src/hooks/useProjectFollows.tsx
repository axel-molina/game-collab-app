import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProjectFollows(userId?: string) {
  const queryClient = useQueryClient();

  // Get all projects followed by the user
  const { data: followedProjects = [], ...query } = useQuery({
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

  // Check if current user follows a specific project
  const isFollowing = (projectId: string) => {
    return followedProjects.includes(projectId);
  };

  // Toggle follow status for a project
  const toggleFollow = useMutation({
    mutationFn: async ({
      projectId,
      userId,
      projectName,
      recipientId,
    }: {
      projectId: string;
      userId: string;
      projectName?: string;
      recipientId?: string;
    }) => {
      const isCurrentlyFollowing = isFollowing(projectId);

      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("project_followers")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", userId);

        if (error) throw error;
        return false;
      } else {
        // Follow
        const { error } = await supabase
          .from("project_followers")
          .insert([{ project_id: projectId, user_id: userId }]);

        if (error) throw error;

        return true;
      }
    },
    onSuccess: (isNowFollowing, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["followed-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success(
        isNowFollowing
          ? "¡Ahora sigues este proyecto!"
          : "Has dejado de seguir este proyecto",
      );

      // Check for follower achievements after following a project
      if (isNowFollowing && userId) {
        // Dynamically check achievements
        setTimeout(async () => {
          try {
            const { count } = await supabase
              .from("project_followers")
              .select("*", { count: "exact", head: true })
              .eq("user_id", userId);

            if (count !== null) {
              // Check for achievements
              const achievements = await supabase
                .from("achievements")
                .select("*")
                .in("name", ["Seguidor Activo", "Networker"]);

              if (achievements.data) {
                for (const achievement of achievements.data) {
                  const requiredCount =
                    achievement.name === "Networker" ? 10 : 5;

                  if (count >= requiredCount) {
                    // Check if already unlocked
                    const { data: existing } = await supabase
                      .from("user_achievements")
                      .select("id")
                      .eq("user_id", userId)
                      .eq("achievement_id", achievement.id)
                      .maybeSingle();

                    if (!existing) {
                      // Unlock achievement
                      await supabase.from("user_achievements").insert({
                        user_id: userId,
                        achievement_id: achievement.id,
                      });

                      // Show notification
                      toast.success(`🏆 ¡Logro desbloqueado!`, {
                        description: `${achievement.name}: ${achievement.description}`,
                        duration: 5000,
                      });

                      // Invalidate queries
                      queryClient.invalidateQueries({
                        queryKey: ["user-achievements"],
                      });
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error checking achievements:", error);
          }
        }, 500);
      }
    },
    onError: (error) => {
      console.error("Error toggling follow:", error);
      toast.error("No se pudo actualizar el seguimiento");
    },
  });

  // Get followers count for a project
  const useProjectFollowerCount = (projectId: string) => {
    return useQuery({
      queryKey: ["project-followers-count", projectId],
      queryFn: async () => {
        const { count, error } = await supabase
          .from("project_followers")
          .select("*", { count: "exact", head: true })
          .eq("project_id", projectId);

        if (error) throw error;
        return count || 0;
      },
    });
  };

  return {
    ...query,
    followedProjects,
    isFollowing,
    toggleFollow,
    useProjectFollowerCount,
  };
}
