import { useState } from "react";
import { Link } from "react-router-dom";
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
import { es, enUS } from "date-fns/locale";
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
import { useTranslation } from "react-i18next";

interface CommentProps {
  comment: PostComment;
  postId: string;
  depth?: number;
}

export function Comment({ comment, postId, depth = 0 }: CommentProps) {
  const { t, i18n } = useTranslation();
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

  const dateLocale = i18n.language === "es" ? es : enUS;

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : ""}`}>
      <div className="bg-muted/30 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <Link
              to={`/users/${comment.profiles?.username}`}
              className="font-medium hover:text-primary hover:underline"
            >
              {comment.profiles?.username || t("common.anonymous")}
            </Link>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: dateLocale,
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
                    <AlertDialogTitle>
                      {t("comments.delete_title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("comments.delete_desc")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t("projects.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteComment.isPending}
                    >
                      {deleteComment.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {t("projects.delete")}
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
                {t("projects.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={!editContent.trim() || updateComment.isPending}
              >
                {updateComment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {t("comments.save")}
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
                {t("comments.reply")}
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
              placeholder={t("comments.reply_placeholder")}
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
                {t("projects.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim() || createComment.isPending}
              >
                {createComment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {t("comments.reply")}
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
