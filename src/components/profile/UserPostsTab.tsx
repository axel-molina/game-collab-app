import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUserPosts,
  useDeletePost,
  extractTitleFromContent,
  extractExcerptFromContent,
} from "@/hooks/useProjectPosts";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { Edit, Trash2, Loader2, Calendar, FileText } from "lucide-react";
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

interface UserPostsTabProps {
  userId: string;
}

export function UserPostsTab({ userId }: UserPostsTabProps) {
  const { data: posts, isLoading } = useUserPosts(userId);
  const deletePost = useDeletePost();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No tienes posts aún</h3>
        <p className="text-muted-foreground mb-4">
          Crea tu primer post para compartir novedades de tus proyectos
        </p>
        <Button asChild>
          <Link to="/posts/new">Crear Post</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const title = extractTitleFromContent(post.content);
        const excerpt = extractExcerptFromContent(post.content, 100);
        const engineLabel =
          post.projects?.engine === "other" && post.projects?.custom_engine
            ? post.projects.custom_engine
            : getEngineLabel(post.projects?.engine || "");

        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/posts/${post.id}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-1">
                      {title}
                    </CardTitle>
                  </Link>
                  {post.projects && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={`${getEngineColor(
                          post.projects.engine
                        )} text-primary-foreground border-0 text-xs`}
                      >
                        {post.projects.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {engineLabel}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <Link to={`/posts/${post.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
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
                          onClick={() => deletePost.mutate(post.id)}
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
              </div>
            </CardHeader>
            <CardContent>
              <Link to={`/posts/${post.id}`}>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {excerpt}
                </p>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
