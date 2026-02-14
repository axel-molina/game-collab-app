import { Card, CardContent } from "@/components/ui/card";
import { Achievement } from "@/hooks/useAchievements";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AchievementBadgeProps {
  achievement: Achievement;
  earnedAt?: string;
  size?: "sm" | "md" | "lg";
  locked?: boolean;
}

export function AchievementBadge({
  achievement,
  earnedAt,
  size = "md",
  locked = false,
}: AchievementBadgeProps) {
  // Get the icon component dynamically
  const IconComponent =
    LucideIcons[achievement.icon as keyof typeof LucideIcons] ||
    LucideIcons.Award;

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg",
        locked && "opacity-50 grayscale"
      )}
    >
      <CardContent className={cn("text-center", sizeClasses[size])}>
        <div className="flex flex-col items-center gap-3">
          {/* Icon */}
          <div
            className={cn(
              "rounded-full p-3 bg-primary/10",
              locked && "bg-muted"
            )}
          >
            <IconComponent
              className={cn(
                iconSizes[size],
                locked ? "text-muted-foreground" : "text-primary"
              )}
            />
          </div>

          {/* Name */}
          <h3
            className={cn(
              "font-semibold",
              textSizes[size],
              locked && "text-muted-foreground"
            )}
          >
            {achievement.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {achievement.description}
          </p>

          {/* Earned date */}
          {earnedAt && !locked && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(earnedAt), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          )}

          {locked && (
            <p className="text-xs text-muted-foreground font-medium">
              🔒 Bloqueado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
