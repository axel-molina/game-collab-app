import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  useProjectPost,
  useDeletePost,
  extractTitleFromContent,
} from "@/hooks/useProjectPosts";
import { CommentSection } from "@/components/posts/CommentSection";
import { MarkdownRenderer } from "@/components/posts/MarkdownRenderer";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { PostHeader } from "./components/PostHeader";
import { PostMeta } from "./components/PostMeta";
import { NotFoundState } from "./components/NotFoundState";
import LoadingMultipleSkeleton from "./components/LoadingMultipleSkeleton";
import BackButton from "./components/BackButton";
import { SEO } from "@/components/shared/SEO";
import { PostMediaDisplay } from "@/components/posts/PostMediaDisplay";
import { usePostLikes } from "@/hooks/usePostLikes";
import { Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useProjectPost(id!);
  const deletePost = useDeletePost();
  const { count, userLiked, toggleLike, isAnimating, likesText } = usePostLikes(
    id!
  );
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingMultipleSkeleton />;
  }

  if (error || !post) {
    return (
      <Layout>
        <NotFoundState />
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
    navigate("/");
  };

  return (
    <Layout>
      <SEO
        title={title}
        description={content.substring(0, 160)}
        url={`/posts/${post.id}`}
        type="article"
      />
      <div className="container max-w-4xl py-8">
        {/* Back button */}
        <BackButton />
        {/* Post Content */}
        <Card className="mb-8">
          <CardHeader>
            <PostHeader
              post={post}
              title={title}
              engineLabel={engineLabel}
              getEngineColor={getEngineColor}
              isAuthor={isAuthor}
              handleDelete={handleDelete}
              deletePostPending={deletePost.isPending}
            />
            <PostMeta post={post} />
          </CardHeader>

          {post.post_media && post.post_media.length > 0 && (
            <div className="px-6 pb-4">
              <PostMediaDisplay media={post.post_media} />
            </div>
          )}

          <CardContent>
            <MarkdownRenderer content={content} />
          </CardContent>

          <CardContent className="pt-0 border-t mt-4">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() =>
                    toggleLike({
                      postUserId: post.user_id,
                      isCurrentlyLiked: userLiked,
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 text-sm transition-all active:scale-95",
                    userLiked
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-6 w-6 transition-transform",
                      userLiked && "fill-current",
                      isAnimating && "animate-bounce scale-125"
                    )}
                  />
                  <span className="text-base">{count > 0 ? count : ""}</span>
                </button>

                <div className="ml-auto flex items-center gap-2"></div>
              </div>

              {likesText && (
                <p className="text-sm text-muted-foreground">{likesText}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <CommentSection postId={post?.id} />
      </div>
    </Layout>
  );
}
