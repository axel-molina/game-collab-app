import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

/**
 * Hook to manually check and unlock all achievements for the current user
 * This is useful for retroactively unlocking achievements for existing data
 */
export function useCheckAllAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user logged in");

      const unlockedAchievements: string[] = [];

      // Helper function to unlock an achievement
      const unlockAchievement = async (achievementName: string) => {
        const { data: achievement } = await supabase
          .from("achievements")
          .select("*")
          .eq("name", achievementName)
          .single();

        if (!achievement) return false;

        // Check if already unlocked
        const { data: existing } = await supabase
          .from("user_achievements")
          .select("id")
          .eq("user_id", user.id)
          .eq("achievement_id", achievement.id)
          .maybeSingle();

        if (existing) return false;

        // Unlock achievement
        await supabase.from("user_achievements").insert({
          user_id: user.id,
          achievement_id: achievement.id,
        });

        unlockedAchievements.push(
          `${achievement.name}: ${achievement.description}`,
        );
        return true;
      };

      // Check project achievements
      const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (projectCount !== null) {
        if (projectCount >= 1) {
          await unlockAchievement("Primer Proyecto");
        }
        if (projectCount >= 3) {
          await unlockAchievement("Emprendedor");
        }
      }

      // Check follower achievements
      const { count: followerCount } = await supabase
        .from("project_followers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (followerCount !== null) {
        if (followerCount >= 5) {
          await unlockAchievement("Seguidor Activo");
        }
        if (followerCount >= 10) {
          await unlockAchievement("Networker");
        }
      }

      // Check post achievements
      const { count: postCount } = await supabase
        .from("project_posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (postCount !== null) {
        if (postCount >= 5) {
          await unlockAchievement("Creador de Contenido");
        }
        if (postCount >= 20) {
          await unlockAchievement("Influencer");
        }
      }

      // Check like achievements
      const { count: likeCount } = await supabase
        .from("project_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (likeCount !== null && likeCount >= 10) {
        await unlockAchievement("Socialite");
      }

      // Check comment achievements
      const { count: commentCount } = await supabase
        .from("post_comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (commentCount !== null && commentCount >= 10) {
        await unlockAchievement("Comentarista");
      }

      return unlockedAchievements;
    },
    onSuccess: (unlockedAchievements) => {
      queryClient.invalidateQueries({ queryKey: ["user-achievements"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });

      if (unlockedAchievements.length > 0) {
        unlockedAchievements.forEach((achievement) => {
          const [name, description] = achievement.split(": ");
          toast.success(`🏆 ¡Logro desbloqueado!`, {
            description: `${name}: ${description}`,
            duration: 5000,
          });
        });
      }
    },
    onError: (error) => {
      console.error("Error checking all achievements:", error);
      toast.error("Error al verificar logros");
    },
  });
}
