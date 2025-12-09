import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { Layout } from "@/components/layout/Layout";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const updateProject = useUpdateProject();

  if (authLoading || projectLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!project) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (project.user_id !== user.id) {
    return <Navigate to={`/projects/${id}`} replace />;
  }

  const handleSubmit = async (data: Parameters<typeof updateProject.mutateAsync>[0]["data"]) => {
    await updateProject.mutateAsync({ id: project.id, data });
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/projects/${project.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Editar proyecto</h1>
          <p className="text-muted-foreground">Actualiza la información de tu proyecto.</p>
        </div>

        <ProjectForm
          project={project}
          onSubmit={handleSubmit}
          isLoading={updateProject.isPending}
        />
      </div>
    </Layout>
  );
}
