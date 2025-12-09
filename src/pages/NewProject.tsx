import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProject } from "@/hooks/useProjects";
import { Layout } from "@/components/layout/Layout";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NewProject() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const createProject = useCreateProject();

  if (authLoading) {
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

  const handleSubmit = async (data: Parameters<typeof createProject.mutateAsync>[0]) => {
    const project = await createProject.mutateAsync(data);
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Nuevo proyecto</h1>
          <p className="text-muted-foreground">
            Comparte tu proyecto con la comunidad y encuentra colaboradores.
          </p>
        </div>

        <ProjectForm onSubmit={handleSubmit} isLoading={createProject.isPending} />
      </div>
    </Layout>
  );
}
