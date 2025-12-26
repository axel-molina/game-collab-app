import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  PostComment,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/usePostComments";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { User, Edit, Trash2, Reply, Loader2 } from "lucide-react";
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

interface CommentProps {
  comment: PostComment;
  postId: string;
  depth?: number;
}

export function Comment({ comment, postId, depth = 0 }: CommentProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");

  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const isAuthor = user?.id === comment.user_id;
  const maxDepth = 3; // Limit nesting depth

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    await updateComment.mutateAsync({
      id: comment.id,
      postId,
      data: { content: editContent.trim() },
    });

    setIsEditing(false);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    await createComment.mutateAsync({
      post_id: postId,
      content: replyContent.trim(),
      parent_id: comment.id,
    });

    setReplyContent("");
    setIsReplying(false);
  };

  const handleDelete = async () => {
    await deleteComment.mutateAsync({ id: comment.id, postId });
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <div className="bg-muted/30 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {comment.profiles?.username || "Anónimo"}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: es,
              })}
            </span>
          </div>

          {/* Actions for author */}
          {isAuthor && !isEditing && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteComment.isPending}
                    >
                      {deleteComment.isPending && (
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

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={!editContent.trim() || updateComment.isPending}
              >
                {updateComment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap mb-2">
              {comment.content}
            </p>

            {/* Reply Button */}
            {user && depth < maxDepth && !isReplying && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsReplying(true)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Responder
              </Button>
            )}
          </>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={2}
              className="resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim() || createComment.isPending}
              >
                {createComment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Responder
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment?.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment?.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
