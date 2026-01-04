import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSendNotification } from "./useNotifications";

export function useProjectFollows(userId?: string) {
  const queryClient = useQueryClient();
  const { sendNotification } = useSendNotification();

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

        // Send notification
        if (recipientId && projectName && userId !== recipientId) {
          await sendNotification({
            recipientId,
            type: "follow",
            entityType: "project",
            entityId: projectId,
            projectName,
          });
        }

        return true;
      }
    },
    onSuccess: (isNowFollowing, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["followed-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success(
        isNowFollowing
          ? "¡Ahora sigues este proyecto!"
          : "Has dejado de seguir este proyecto"
      );
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
