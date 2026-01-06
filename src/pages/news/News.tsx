import { useState, useMemo, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { useFollowedProjects } from "@/hooks/useFollowedProjects";
import { useAuth } from "@/hooks/useAuth";
import { ProjectAnnouncementCard } from "@/components/posts/ProjectAnnouncementCard";
import { FeedHeader } from "./components/FeedHeader";
import { FilterTabs } from "./components/FilterTabs";
import { EmptyFeed } from "./components/EmptyFeed";
import { LoadMoreTrigger } from "./components/LoadMoreTrigger";
import { PostCardWithComments } from "./components/PostCardWithComments";
import { SEO } from "@/components/shared/SEO";
import { useTranslation } from "react-i18next";

export default function News() {
  const { t } = useTranslation();
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
      <SEO
        title={t("nav.home")}
        description={t(
          "news.description",
          "Novedades y actualizaciones de los mejores proyectos de videojuegos en desarrollo."
        )}
        url="/"
      />
      <div className="container max-w-3xl py-8">
        <FeedHeader />

        {/* Filter Tabs */}
        {user && <FilterTabs filter={filter} onFilterChange={setFilter} />}

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
            <LoadMoreTrigger
              ref={loadMoreRef}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={fetchNextPage}
            />
          </>
        ) : (
          <EmptyFeed filter={filter} />
        )}
      </div>
    </Layout>
  );
}
