import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useProjectPost,
  useDeletePost,
  extractTitleFromContent,
} from "@/hooks/useProjectPosts";
import { CommentSection } from "@/components/posts/CommentSection";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { ArrowLeft, Calendar, User, Edit, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
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

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useProjectPost(id!);
  const deletePost = useDeletePost();

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Post no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El post que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link to="/news">Volver a Novedades</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isAuthor = user?.id === post.user_id;
  const title = extractTitleFromContent(post.content);

  // Extract content without title (skip first line)
  const contentLines = post.content.split("\n");
  const content = contentLines.slice(1).join("\n").trim();

  const engineLabel =
    post.projects?.engine === "other" && post.projects?.custom_engine
      ? post.projects.custom_engine
      : getEngineLabel(post.projects?.engine || "");

  const handleDelete = async () => {
    await deletePost.mutateAsync(post.id);
    navigate("/news");
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Novedades
          </Link>
        </Button>

        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader>
            {/* Project Badge */}
            {post.projects && (
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  className={`${getEngineColor(
                    post.projects.engine
                  )} text-primary-foreground border-0`}
                >
                  {post.projects.name}
                </Badge>
                <Badge variant="outline">{engineLabel}</Badge>
              </div>
            )}

            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold flex-1">{title}</h1>
              {isAuthor && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/posts/${post.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El post y todos sus
                          comentarios serán eliminados permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={deletePost.isPending}
                        >
                          {deletePost.isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.profiles?.username || "Anónimo"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </Layout>
  );
}
