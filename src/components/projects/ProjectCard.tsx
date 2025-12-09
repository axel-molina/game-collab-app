import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/hooks/useProjects";
import { getEngineLabel, getPositionLabel, getEngineColor } from "@/lib/constants";
import { Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const mainImage = project.project_images?.[0]?.image_url;
  const positions = project.project_positions || [];
  const engineLabel = project.engine === "other" && project.custom_engine 
    ? project.custom_engine 
    : getEngineLabel(project.engine);

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
              <Badge 
                className={`absolute top-3 left-3 ${getEngineColor(project.engine)} text-primary-foreground border-0`}
              >
                {engineLabel}
              </Badge>
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
                      <Badge key={pos.id} variant="secondary" className="text-xs">
                        {pos.is_custom ? pos.position : getPositionLabel(pos.position)}
                      </Badge>
                    ))}
                    {positions.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{positions.length - 5} más
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{project.profiles?.username || "Anónimo"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  v{project.engine_version}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
