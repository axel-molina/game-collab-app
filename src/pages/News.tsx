import { useState, useMemo, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { usePostComments } from "@/hooks/usePostComments";
import { useFollowedProjects } from "@/hooks/useFollowedProjects";
import { useAuth } from "@/hooks/useAuth";
import { PostCard } from "@/components/posts/PostCard";
import { ProjectAnnouncementCard } from "@/components/posts/ProjectAnnouncementCard";
import { FileText, Loader2 } from "lucide-react";

export default function News() {
  const { user } = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFeed(10);
  const { data: followedProjectIds } = useFollowedProjects(user?.id);
  const [filter, setFilter] = useState<"all" | "following">("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all pages into a single array
  const allItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // Filter items based on selected tab
  const filteredItems = useMemo(() => {
    if (!allItems) return [];
    if (filter === "all") return allItems;
    if (!followedProjectIds || followedProjectIds.length === 0) return [];

    return allItems.filter((item) => {
      if (item.type === "post") {
        return (
          item.data.project_id &&
          followedProjectIds.includes(item.data.project_id)
        );
      } else {
        return followedProjectIds.includes(item.data.id);
      }
    });
  }, [allItems, filter, followedProjectIds]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Novedades</h1>
          <p className="text-muted-foreground">
            Últimas actualizaciones y proyectos nuevos
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

        {/* Feed */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : filteredItems && filteredItems.length > 0 ? (
          <>
            <div className="space-y-6">
              {filteredItems.map((item, index) => {
                if (item.type === "post") {
                  return (
                    <PostCardWithComments
                      key={`post-${item.data.id}`}
                      post={item.data}
                    />
                  );
                } else {
                  return (
                    <ProjectAnnouncementCard
                      key={`project-${item.data.id}`}
                      project={item.data}
                    />
                  );
                }
              })}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Cargando más...</span>
                </div>
              ) : hasNextPage ? (
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  Cargar más
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay más contenido para mostrar
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === "following"
                ? "No hay contenido de proyectos seguidos"
                : "No hay contenido aún"}
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
