import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/hooks/useProjects";
import {
  getEngineLabel,
  getPositionLabel,
  getEngineColor,
} from "@/lib/constants";
import { Calendar, User, Bookmark, BookmarkCheck, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useProjectFollows } from "@/hooks/useProjectFollows";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { isFollowing, toggleFollow, useProjectFollowerCount } =
    useProjectFollows(user?.id);
  const { data: followerCount = 0 } = useProjectFollowerCount(project.id);

  const locale = i18n.language === "es" ? es : enUS;

  const mainImage = project.project_images?.[0]?.image_url;
  const positions = project.project_positions || [];
  const engineLabel =
    project.engine === "other" && project.custom_engine
      ? project.custom_engine
      : getEngineLabel(project.engine);

  const isOwner = user?.id === project.user_id;

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative w-full md:w-64 h-48 md:h-auto md:min-h-[200px] flex-shrink-0 bg-muted overflow-hidden">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-4xl">🎮</span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Badge
                  className={`${getEngineColor(
                    project.engine
                  )} text-primary-foreground border-0`}
                >
                  {engineLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  v{project.engine_version}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>

                {/* Positions */}
                {positions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {positions.slice(0, 5).map((pos) => (
                      <Badge
                        key={pos.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {pos.is_custom
                          ? pos.position
                          : getPositionLabel(pos.position)}
                      </Badge>
                    ))}
                    {positions.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{positions.length - 5} {t("common.more")}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {project.profiles?.username || t("common.anonymous")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                      locale: locale,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{followerCount}</span>
                  </div>
                  {!isOwner && user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFollow.mutate({
                          projectId: project.id,
                          userId: user.id,
                        });
                      }}
                      title={
                        isFollowing(project.id)
                          ? t("projects.remove_saved")
                          : t("projects.save")
                      }
                    >
                      {isFollowing(project.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary fill-current" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isFollowing(project.id)
                          ? t("projects.remove_saved")
                          : t("projects.save")}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
