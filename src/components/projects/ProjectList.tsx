import { Project } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2 } from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectList({ projects, isLoading }: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
            <Skeleton className="w-full md:w-64 h-48" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
        <p className="text-muted-foreground">
          No se encontraron proyectos con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
