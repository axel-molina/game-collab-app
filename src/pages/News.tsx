import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectPosts } from "@/hooks/useProjectPosts";
import { usePostComments } from "@/hooks/usePostComments";
import { PostCard } from "@/components/posts/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function News() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useProjectPosts();

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              Novedades
            </h1>
            <p className="text-lg text-muted-foreground">
              Últimas actualizaciones de los proyectos
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCardWithComments key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">
              No hay novedades aún
            </h2>
            <p className="text-muted-foreground mb-6">
              {user
                ? "Sé el primero en compartir novedades de tu proyecto"
                : "Inicia sesión para crear posts"}
            </p>
            {user && (
              <Button asChild>
                <Link to="/posts/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Post
                </Link>
              </Button>
            )}
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
