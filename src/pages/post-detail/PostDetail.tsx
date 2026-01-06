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

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useProjectPost(id!);
  const deletePost = useDeletePost();

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
        </Card>

        {/* Comments */}
        <CommentSection postId={post?.id} />
      </div>
    </Layout>
  );
}
