import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
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

interface PostHeaderProps {
  post: any;
  title: string;
  engineLabel: string;
  getEngineColor: (engine: string) => string;
  isAuthor: boolean;
  handleDelete: () => void;
  deletePostPending: boolean;
}

export function PostHeader({
  post,
  title,
  engineLabel,
  getEngineColor,
  isAuthor,
  handleDelete,
  deletePostPending,
}: PostHeaderProps) {
  return (
    <>
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
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {isAuthor && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <Link to={`/posts/${post.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
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
                    disabled={deletePostPending}
                  >
                    {deletePostPending && (
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
    </>
  );
}
