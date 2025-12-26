import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectPosts } from "@/hooks/useProjectPosts";
import { usePostComments } from "@/hooks/usePostComments";
import { PostCard } from "@/components/posts/PostCard";
import { FileText } from "lucide-react";

export default function News() {
  const { data: posts, isLoading } = useProjectPosts();

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Novedades</h1>
          <p className="text-muted-foreground">
            Últimas actualizaciones de los proyectos
          </p>
        </div>

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCardWithComments key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay posts aún</h3>
            <p className="text-muted-foreground">
              Sé el primero en compartir una actualización
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Helper component to fetch comment count for each post
function PostCardWithComments({ post }: { post: any }) {
  const { data: comments } = usePostComments(post.id);

  // Count all comments including nested replies
  const countComments = (comments: any[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
  };

  const commentCount = comments ? countComments(comments) : 0;

  return <PostCard post={post} commentCount={commentCount} />;
}
