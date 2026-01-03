import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { usePostComments, useCreateComment } from "@/hooks/usePostComments";
import { Comment } from "./Comment";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: comments, isLoading } = usePostComments(postId);
  const createComment = useCreateComment();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await createComment.mutateAsync({
      post_id: postId,
      content: newComment.trim(),
    });

    setNewComment("");
  };

  const commentCount = comments?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("comments.title")} ({commentCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("comments.placeholder")}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newComment.trim() || createComment.isPending}
                size="sm"
              >
                {createComment.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {t("comments.submit")}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("comments.login_to_comment")}
          </p>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} postId={postId} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("comments.no_comments")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
