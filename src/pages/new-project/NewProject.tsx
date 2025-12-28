import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProject } from "@/hooks/useProjects";
import { Layout } from "@/components/layout/Layout";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SpinnerComponent from "@/components/Spinner.component";
import HeaderNewProject from "./components/HeaderNewProject";

export default function NewProject() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const createProject = useCreateProject();

  if (authLoading) {
    return <SpinnerComponent />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (
    data: Parameters<typeof createProject.mutateAsync>[0]
  ) => {
    const project = await createProject.mutateAsync(data);
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <HeaderNewProject />
        <ProjectForm
          onSubmit={handleSubmit}
          isLoading={createProject.isPending}
        />
      </div>
    </Layout>
  );
}
