import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAchievements } from "@/hooks/useUserAchievements";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementsGrid } from "../achievements/AchievementsGrid";
import { Award } from "lucide-react";

interface AchievementsSectionProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function AchievementsSection({
  userId,
  isOwnProfile = false,
}: AchievementsSectionProps) {
  const { data: userAchievements = [], isLoading: loadingUserAchievements } =
    useUserAchievements(userId);
  const { data: allAchievements = [], isLoading: loadingAllAchievements } =
    useAchievements();

  const isLoading = loadingUserAchievements || loadingAllAchievements;
  const earnedCount = userAchievements.length;
  const totalCount = allAchievements.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Logros
          </CardTitle>
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {earnedCount} de {totalCount}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AchievementsGrid
          userAchievements={userAchievements}
          allAchievements={allAchievements}
          showLocked={isOwnProfile}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
