import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectPosts } from "@/hooks/useProjectPosts";
import { usePostComments } from "@/hooks/usePostComments";
import { useFollowedProjects } from "@/hooks/useFollowedProjects";
import { useAuth } from "@/hooks/useAuth";
import { PostCard } from "@/components/posts/PostCard";
import { FileText } from "lucide-react";

export default function News() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useProjectPosts();
  const { data: followedProjectIds } = useFollowedProjects(user?.id);
  const [filter, setFilter] = useState<"all" | "following">("all");

  // Filter posts based on selected tab
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (filter === "all") return posts;
    if (!followedProjectIds || followedProjectIds.length === 0) return [];

    return posts.filter(
      (post) => post.project_id && followedProjectIds.includes(post.project_id)
    );
  }, [posts, filter, followedProjectIds]);

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Novedades</h1>
          <p className="text-muted-foreground">
            Últimas actualizaciones de los proyectos
          </p>
        </div>

        {/* Filter Tabs */}
        {user && (
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | "following")}
            className="mb-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="following">Seguidos</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCardWithComments key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === "following"
                ? "No hay posts de proyectos seguidos"
                : "No hay posts aún"}
            </h3>
            <p className="text-muted-foreground">
              {filter === "following"
                ? "Guarda proyectos para ver sus actualizaciones aquí"
                : "Sé el primero en compartir una actualización"}
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
