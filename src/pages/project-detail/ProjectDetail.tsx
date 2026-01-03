import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject, useDeleteProject } from "@/hooks/useProjects";
import { useProjectLikes } from "@/hooks/useProjectLikes";
import { useProjectFollows } from "@/hooks/useProjectFollows";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEngineLabel,
  getPositionLabel,
  getEngineColor,
} from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectImages } from "./components/ProjectImages";
import { ProjectTasks } from "./components/ProjectTasks";
import { ProjectPositions } from "./components/ProjectPositions";
import { ProjectContact } from "./components/ProjectContact";
import { NotFoundState } from "./components/NotFoundState";

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id!);
  const deleteProject = useDeleteProject();
  const {
    count: likesCount,
    userLiked,
    toggleLike,
    isToggling,
  } = useProjectLikes(id!);

  const { isFollowing, toggleFollow } = useProjectFollows(user?.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <NotFoundState />
      </Layout>
    );
  }

  const isOwner = user?.id === project.user_id;
  const images = project.project_images || [];
  const tasks = project.project_tasks || [];
  const positions = project.project_positions || [];

  const engineLabel =
    project.engine === "other" && project.custom_engine
      ? project.custom_engine
      : getEngineLabel(project.engine);

  const handleDelete = async () => {
    await deleteProject.mutateAsync(project.id);
    navigate("/");
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("projects.back")}
          </Link>
        </Button>

        {/* Header */}
        <ProjectHeader
          project={project}
          engineLabel={engineLabel}
          getEngineColor={getEngineColor}
          isOwner={isOwner}
          likesCount={likesCount}
          userLiked={userLiked}
          isToggling={isToggling}
          toggleLike={toggleLike}
          isFollowing={isFollowing(project.id)}
          toggleFollow={() =>
            toggleFollow.mutate({ projectId: project.id, userId: user!.id })
          }
          isFollowPending={toggleFollow.isPending}
          handleDelete={handleDelete}
          deleteProjectPending={deleteProject.isPending}
        />

        {/* Images */}
        <ProjectImages images={images} projectName={project.name} />

        <div className="space-y-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t("projects.description_label")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>

          {/* Tasks */}
          <ProjectTasks tasks={tasks} />

          {/* Positions and Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProjectPositions
              positions={positions}
              getPositionLabel={getPositionLabel}
            />
            <ProjectContact contact={project.contact} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
