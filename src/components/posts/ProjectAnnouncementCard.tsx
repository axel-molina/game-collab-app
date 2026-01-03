import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project } from "@/hooks/useProjects";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { Calendar, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectAnnouncementCardProps {
  project: Project;
}

// Helper function to get simplified time format
const getSimplifiedTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}sem`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}mes`;
  return `${Math.floor(diffInSeconds / 31536000)}a`;
};

// Helper to get user initials
const getUserInitials = (username: string): string => {
  return username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ProjectAnnouncementCard({
  project,
}: ProjectAnnouncementCardProps) {
  const engineLabel =
    project.engine === "other" && project.custom_engine
      ? project.custom_engine
      : getEngineLabel(project.engine);

  const username = project.profiles?.username || "Anónimo";
  const timeAgo = getSimplifiedTime(new Date(project.created_at));
  const mainImage = project.project_images?.[0]?.image_url;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md relative">
      {/* New Project Flag */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          🎉 Nuevo Proyecto
        </Badge>
      </div>

      <CardContent className="p-6">
        {/* Header with user info */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/users/${username}`} onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src={project.profiles?.avatar_url || undefined}
                alt={username}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getUserInitials(username)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/users/${username}`}
                className="font-semibold hover:text-primary hover:underline text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </Link>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link to={`/projects/${project.id}`}>
                <Badge
                  className={`${getEngineColor(
                    project.engine
                  )} text-black dark:text-primary-foreground border-0 text-xs font-medium hover:opacity-80 transition-opacity`}
                >
                  {project.name}
                </Badge>
              </Link>
              <Badge variant="outline" className="text-xs">
                {engineLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Project Image */}
        {mainImage && (
          <Link to={`/projects/${project.id}`} className="block mb-4">
            <div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img
                src={mainImage}
                alt={project.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>
        )}

        {/* Title */}
        <Link to={`/projects/${project.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
            {project.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>

        {/* Footer with positions */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>
              {project.project_positions?.length || 0} tarea
              {(project.project_positions?.length || 0) !== 1 ? "s" : ""}{" "}
              disponible
              {(project.project_positions?.length || 0) !== 1 ? "s" : ""}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
