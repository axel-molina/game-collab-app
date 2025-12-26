import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Project } from "@/hooks/useProjects";

interface ProjectWithRelations extends Omit<Project, 'project_images' | 'project_tasks' | 'project_positions'> {
  project_images: Array<{ id: string; image_url: string }>;
  project_tasks: Array<{ id: string; title: string; completed: boolean }>;
  project_positions: Array<{ id: string; position: string; is_custom: boolean }>;
  profiles: { username: string } | null;
}

interface ProjectFollower {
  projects: ProjectWithRelations;
}

export default function FollowingProjects() {
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["followed-projects-details", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("project_followers")
        .select(
          `
          projects(
            *,
            profiles(username),
            project_images(*),
            project_tasks(*),
            project_positions(*)
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      
      // Extract projects from the nested structure
      return data.map((item: ProjectFollower) => item.projects);
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver los proyectos que sigues</h1>
        <p className="text-muted-foreground">
          Necesitas iniciar sesión para ver los proyectos que sigues.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Proyectos que sigues</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver todos los proyectos que estás siguiendo.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No estás siguiendo ningún proyecto</h3>
          <p className="text-muted-foreground">
            Comienza a seguir proyectos para verlos aparecer aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: ProjectWithRelations) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
