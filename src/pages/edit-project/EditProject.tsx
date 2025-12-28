import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { Layout } from "@/components/layout/Layout";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpinnerComponent from "@/components/Spinner.component";
import NotProject from "./components/NotProject";
import HeaderEditProject from "./components/HeaderEditProject";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const updateProject = useUpdateProject();

  if (authLoading || projectLoading) {
    return <SpinnerComponent />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!project) {
    return <NotProject />;
  }

  if (project.user_id !== user.id) {
    return <Navigate to={`/projects/${id}`} replace />;
  }

  const handleSubmit = async (
    data: Parameters<typeof updateProject.mutateAsync>[0]["data"]
  ) => {
    await updateProject.mutateAsync({ id: project.id, data });
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <HeaderEditProject projectId={project.id} />
        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          isLoading={updateProject.isPending}
        />
      </div>
    </Layout>
  );
}
