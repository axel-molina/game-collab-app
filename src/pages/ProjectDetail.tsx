import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject, useDeleteProject } from "@/hooks/useProjects";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getEngineLabel, getPositionLabel, getEngineColor } from "@/lib/constants";
import { ArrowLeft, Calendar, User, Edit, Trash2, Mail, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id!);
  const deleteProject = useDeleteProject();
  const [selectedImage, setSelectedImage] = useState(0);

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
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El proyecto que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isOwner = user?.id === project.user_id;
  const images = project.project_images || [];
  const tasks = project.project_tasks || [];
  const positions = project.project_positions || [];
  const completedTasks = tasks.filter((t) => t.completed).length;

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
            Volver
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className={`${getEngineColor(project.engine)} text-primary-foreground border-0`}>
                {engineLabel}
              </Badge>
            </div>
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
              <Badge variant="outline">v{project.engine_version}</Badge>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/projects/${project.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El proyecto y todos sus datos serán
                      eliminados permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleteProject.isPending}>
                      {deleteProject.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="mb-8">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
              <img
                src={images[selectedImage]?.image_url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{project.description}</p>
              </CardContent>
            </Card>

            {/* Tasks */}
            {tasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Tareas</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {completedTasks}/{tasks.length} completadas
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Checkbox checked={task.completed} disabled />
                        <span
                          className={task.completed ? "line-through text-muted-foreground" : ""}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Positions */}
            {positions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Se busca</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {positions.map((pos) => (
                      <Badge key={pos.id} variant="secondary">
                        {pos.is_custom ? pos.position : getPositionLabel(pos.position)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span className="break-all">{project.contact}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
