import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

interface AchievementCheck {
  achievementName: string;
  condition: () => Promise<boolean>;
}

export function useCheckAchievements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkAndUnlockAchievement = useMutation({
    mutationFn: async (achievementName: string) => {
      if (!user?.id) return null;

      // Get achievement by name
      const { data: achievement, error: achievementError } = await supabase
        .from("achievements")
        .select("*")
        .eq("name", achievementName)
        .single();

      if (achievementError || !achievement) {
        console.error("Achievement not found:", achievementName);
        return null;
      }

      // Check if user already has this achievement
      const { data: existing, error: existingError } = await supabase
        .from("user_achievements")
        .select("id")
        .eq("user_id", user.id)
        .eq("achievement_id", achievement.id)
        .maybeSingle();

      if (existingError) throw existingError;

      // If already unlocked, do nothing
      if (existing) {
        return null;
      }

      // Unlock the achievement
      const { data: newAchievement, error: insertError } = await supabase
        .from("user_achievements")
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return { ...newAchievement, achievement };
    },
    onSuccess: (data) => {
      if (data) {
        // Invalidate achievements queries
        queryClient.invalidateQueries({ queryKey: ["user-achievements"] });
        queryClient.invalidateQueries({ queryKey: ["achievements"] });

        // Show success toast with achievement info
        toast.success(`🏆 ¡Logro desbloqueado!`, {
          description: `${data.achievement.name}: ${data.achievement.description}`,
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      console.error("Error unlocking achievement:", error);
    },
  });

  // Check for "Seguidor Activo" (5 projects)
  const checkFollowerAchievements = async () => {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from("project_followers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking follower count:", error);
      return;
    }

    if (count !== null) {
      if (count >= 10) {
        await checkAndUnlockAchievement.mutateAsync("Networker");
      } else if (count >= 5) {
        await checkAndUnlockAchievement.mutateAsync("Seguidor Activo");
      }
    }
  };

  // Check for "Primer Proyecto" and "Emprendedor" (3 projects)
  const checkProjectAchievements = async () => {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking project count:", error);
      return;
    }

    if (count !== null) {
      if (count >= 3) {
        await checkAndUnlockAchievement.mutateAsync("Emprendedor");
      } else if (count >= 1) {
        await checkAndUnlockAchievement.mutateAsync("Primer Proyecto");
      }
    }
  };

  // Check for "Creador de Contenido" (5 posts) and "Influencer" (20 posts)
  const checkPostAchievements = async () => {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from("project_posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking post count:", error);
      return;
    }

    if (count !== null) {
      if (count >= 20) {
        await checkAndUnlockAchievement.mutateAsync("Influencer");
      } else if (count >= 5) {
        await checkAndUnlockAchievement.mutateAsync("Creador de Contenido");
      }
    }
  };

  // Check for "Socialite" (10 project likes)
  const checkLikeAchievements = async () => {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from("project_likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking like count:", error);
      return;
    }

    if (count !== null && count >= 10) {
      await checkAndUnlockAchievement.mutateAsync("Socialite");
    }
  };

  // Check for "Comentarista" (10 comments)
  const checkCommentAchievements = async () => {
    if (!user?.id) return;

    const { count, error } = await supabase
      .from("post_comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking comment count:", error);
      return;
    }

    if (count !== null && count >= 10) {
      await checkAndUnlockAchievement.mutateAsync("Comentarista");
    }
  };

  return {
    checkFollowerAchievements,
    checkProjectAchievements,
    checkPostAchievements,
    checkLikeAchievements,
    checkCommentAchievements,
  };
}
