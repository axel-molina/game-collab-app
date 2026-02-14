import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "./useAchievements";

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

export function useUserAchievements(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-achievements", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_achievements")
        .select(
          `
          *,
          achievement:achievements(*)
        `,
        )
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!userId,
  });
}
