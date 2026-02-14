import { Skeleton } from "@/components/ui/skeleton";
import { AchievementBadge } from "./AchievementBadge";
import { UserAchievement } from "@/hooks/useUserAchievements";
import { Achievement } from "@/hooks/useAchievements";
import { Trophy } from "lucide-react";

interface AchievementsGridProps {
  userAchievements: UserAchievement[];
  allAchievements?: Achievement[];
  showLocked?: boolean;
  isLoading?: boolean;
}

export function AchievementsGrid({
  userAchievements,
  allAchievements = [],
  showLocked = false,
  isLoading = false,
}: AchievementsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  // Get earned achievement IDs
  const earnedIds = new Set(
    userAchievements.map((ua) => ua.achievement_id)
  );

  // Combine earned and locked achievements
  const displayAchievements = showLocked
    ? [
        ...userAchievements,
        ...allAchievements
          .filter((a) => !earnedIds.has(a.id))
          .map((achievement) => ({
            id: crypto.randomUUID(),
            user_id: "",
            achievement_id: achievement.id,
            earned_at: "",
            achievement,
          })),
      ]
    : userAchievements;

  if (displayAchievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No hay logros todavía
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Los logros se desbloquean automáticamente al completar ciertas
          acciones en la plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayAchievements.map((userAchievement) => (
        <AchievementBadge
          key={userAchievement.id}
          achievement={userAchievement.achievement}
          earnedAt={userAchievement.earned_at || undefined}
          locked={!userAchievement.earned_at}
          size="md"
        />
      ))}
    </div>
  );
}
