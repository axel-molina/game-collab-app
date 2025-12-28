import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useAuth } from "@/hooks/useAuth";
import { Project } from "@/hooks/useProjects";
import { LoginPrompt } from "./components/LoginPrompt";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import HeaderFollowingProjects from "./components/HeaderFollowingProjects";

interface ProjectWithRelations
  extends Omit<
    Project,
    "project_images" | "project_tasks" | "project_positions"
  > {
  project_images: Array<{ id: string; image_url: string }>;
  project_tasks: Array<{ id: string; title: string; completed: boolean }>;
  project_positions: Array<{
    id: string;
    position: string;
    is_custom: boolean;
  }>;
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
    return <LoginPrompt />;
  }

  return (
    <div className="container mx-auto py-8">
      <HeaderFollowingProjects />
      {isLoading ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyState />
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
