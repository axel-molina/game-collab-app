import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectPost } from "./useProjectPosts";
import { Project } from "./useProjects";

export type FeedItem =
  | { type: "post"; data: ProjectPost }
  | { type: "project"; data: Project };

// Fetch combined feed of posts and projects with infinite scroll
export function useInfiniteFeed(pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: ["infinite-feed"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      // Fetch posts
      const { data: rawPosts, error: postsError } = await supabase
        .from("project_posts")
        .select(
          `
          *,
          profiles(username, avatar_url),
          projects(id, name, engine, custom_engine),
          post_media(*)
        `,
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (postsError) throw postsError;

      const posts = (rawPosts || []) as ProjectPost[];

      // Populate signed URLs for posts
      const allMedia = posts.flatMap((p) => p.post_media || []);
      if (allMedia.length > 0) {
        const allPaths = allMedia.map((m) => m.storage_path);
        const { data: signedData, error: signedError } = await supabase.storage
          .from("project-posts")
          .createSignedUrls(allPaths, 60 * 60);

        posts.forEach((post) => {
          if (post.post_media) {
            post.post_media = post.post_media.map((m) => {
              const signed = !signedError
                ? signedData?.find((s) => s.path === m.storage_path)
                : null;
              if (signed?.signedUrl) {
                return { ...m, url: signed.signedUrl };
              }
              const { data: publicData } = supabase.storage
                .from("project-posts")
                .getPublicUrl(m.storage_path);
              return { ...m, url: publicData.publicUrl };
            });
          }
        });
      }

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles(username),
          project_images(id, project_id, image_url),
          project_positions(id, project_id, position, is_custom)
        `,
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (projectsError) throw projectsError;

      // Combine and sort by created_at
      const feedItems: FeedItem[] = [
        ...(posts || []).map((post) => ({
          type: "post" as const,
          data: post as ProjectPost,
        })),
        ...(projects || []).map((project) => ({
          type: "project" as const,
          data: project as Project,
        })),
      ].sort((a, b) => {
        const dateA = new Date(a.data.created_at).getTime();
        const dateB = new Date(b.data.created_at).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      // Get total count for pagination
      const { count: postsCount } = await supabase
        .from("project_posts")
        .select("*", { count: "exact", head: true });

      const { count: projectsCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      const totalCount = (postsCount || 0) + (projectsCount || 0);

      return {
        items: feedItems.slice(0, pageSize), // Limit to pageSize after combining
        nextPage: feedItems.length >= pageSize ? pageParam + 1 : undefined,
        totalCount,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}
