import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookmarkMinus } from "lucide-react";
import { Project } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

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
  followers_count?: number;
}

interface FollowingProjectsTabProps {
  userId: string;
}

export function FollowingProjectsTab({ userId }: FollowingProjectsTabProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: followedProjects = [], isLoading } = useQuery<
    ProjectWithRelations[]
  >({
    queryKey: ["followed-projects-details", userId],
    queryFn: async () => {
      if (!userId) return [];

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
        .eq("user_id", userId);

      if (error) throw error;

      // Extract projects from the nested structure
      return data.map(
        (item: { projects: ProjectWithRelations }) => item.projects
      );
    },
    enabled: !!userId,
  });

  const unfollowProject = useMutation({
    mutationFn: async (projectId: string) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from("project_followers")
        .delete()
        .eq("user_id", user.id)
        .eq("project_id", projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followed-projects-details"],
      });
      toast.success(t("profile.unfollow_success"));
    },
    onError: () => {
      toast.error(t("profile.unfollow_error"));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (followedProjects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium mb-2">{t("profile.no_saved")}</h3>
        <p className="text-muted-foreground">{t("profile.no_saved_desc")}</p>
      </div>
    );
  }

  const handleUnfollow = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(t("profile.confirm_unfollow"))) {
      unfollowProject.mutate(projectId);
    }
  };

  return (
    <div className="w-full">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {followedProjects.map((project) => {
          const mainImage = project.project_images?.[0]?.image_url;
          const engineLabel =
            project.engine === "other" && project.custom_engine
              ? project.custom_engine
              : getEngineLabel(project.engine);

          return (
            <Card
              key={project.id}
              className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col"
            >
              <Link
                to={`/projects/${project.id}`}
                className="h-full flex flex-col"
              >
                {/* Project Image */}
                <div className="relative aspect-video bg-muted overflow-hidden">
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
                    className={`absolute top-2 left-2 ${getEngineColor(
                      project.engine
                    )} text-primary-foreground border-0 text-[10px]`}
                  >
                    {engineLabel}
                  </Badge>
                </div>

                {/* Project Title */}
                <div className="p-3 flex-1">
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                </div>
              </Link>

              {/* Unfollow Button */}
              <div className="px-3 py-2 border-t bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs gap-2 text-muted-foreground"
                  onClick={(e) => handleUnfollow(e, project.id)}
                  disabled={unfollowProject.isPending}
                >
                  {unfollowProject.isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {t("common.loading")}...
                    </>
                  ) : (
                    <>
                      <BookmarkMinus className="h-3.5 w-3.5" />
                      {t("common.remove")}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
