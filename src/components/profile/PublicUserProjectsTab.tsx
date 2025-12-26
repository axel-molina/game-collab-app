import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/useProjects";
import {
  getEngineLabel,
  getEngineColor,
  getPositionLabel,
} from "@/lib/constants";
import { Calendar, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PublicUserProjectsTabProps {
  userId: string;
}

export function PublicUserProjectsTab({ userId }: PublicUserProjectsTabProps) {
  const { data: allProjects, isLoading } = useProjects();

  // Filter projects by user ID
  const userProjects = allProjects?.filter((p) => p.user_id === userId) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay proyectos</h3>
        <p className="text-muted-foreground">
          Este usuario aún no ha creado ningún proyecto
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userProjects.map((project) => {
        const mainImage = project.project_images?.[0]?.image_url;
        const positions = project.project_positions || [];
        const engineLabel =
          project.engine === "other" && project.custom_engine
            ? project.custom_engine
            : getEngineLabel(project.engine);

        return (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <Link to={`/projects/${project.id}`}>
                <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-1">
                  {project.name}
                </CardTitle>
              </Link>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  className={`${getEngineColor(
                    project.engine
                  )} text-primary-foreground border-0 text-xs`}
                >
                  {engineLabel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  v{project.engine_version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {/* Thumbnail */}
                {mainImage && (
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                      <img
                        src={mainImage}
                        alt={project.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${project.id}`}>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </Link>

                  {/* Positions */}
                  {positions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {positions.slice(0, 3).map((pos) => (
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
                      {positions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{positions.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(project.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
