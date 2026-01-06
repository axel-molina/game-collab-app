import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PostMedia {
  id: string;
  post_id: string;
  type: "image" | "video";
  storage_path: string;
  created_at: string;
  url?: string; // Signed URL
}

export interface ProjectPost {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_project_announcement?: boolean;
  profiles?: { username: string; avatar_url: string | null } | null;
  projects?: {
    id: string;
    name: string;
    engine: string;
    custom_engine: string | null;
  } | null;
  post_media?: PostMedia[];
}

export interface CreatePostData {
  project_id: string;
  title: string;
  content: string;
  media?: File[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

// Fetch all posts with project and user data
export function useProjectPosts() {
  return useQuery({
    queryKey: ["project-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_posts")
        .select(
          `
          *,
          profiles(username, avatar_url),
          projects(id, name, engine, custom_engine),
          post_media(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const posts = data as ProjectPost[];

      // Collect all media paths to fetch signed URLs in one go
      const allMedia = posts.flatMap((p) => p.post_media || []);
      if (allMedia.length > 0) {
        const allPaths = allMedia.map((m) => m.storage_path);
        const { data: signedData, error: signedError } = await supabase.storage
          .from("project-posts")
          .createSignedUrls(allPaths, 60 * 60);

        if (!signedError && signedData) {
          // Map signed URLs back to media items
          posts.forEach((post) => {
            if (post.post_media) {
              post.post_media = post.post_media.map((m) => {
                const signed = signedData.find(
                  (s) => s.path === m.storage_path
                );
                if (signed?.signedUrl) {
                  return { ...m, url: signed.signedUrl };
                }
                // Fallback to public URL
                const { data: publicData } = supabase.storage
                  .from("project-posts")
                  .getPublicUrl(m.storage_path);
                return { ...m, url: publicData.publicUrl };
              });
            }
          });
        }
      }

      return posts;
    },
  });
}

// Fetch posts with infinite scroll pagination
export function useInfiniteProjectPosts(pageSize: number = 10) {
  return useInfiniteQuery({
    queryKey: ["infinite-project-posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("project_posts")
        .select(
          `
          *,
          profiles(username, avatar_url),
          projects(id, name, engine, custom_engine),
          post_media(*)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const posts = data as ProjectPost[];

      // Collect all media paths to fetch signed URLs in one go
      const allMedia = posts.flatMap((p) => p.post_media || []);
      if (allMedia.length > 0) {
        const allPaths = allMedia.map((m) => m.storage_path);
        const { data: signedData, error: signedError } = await supabase.storage
          .from("project-posts")
          .createSignedUrls(allPaths, 60 * 60);

        if (!signedError && signedData) {
          posts.forEach((post) => {
            if (post.post_media) {
              post.post_media = post.post_media.map((m) => {
                const signed = signedData.find(
                  (s) => s.path === m.storage_path
                );
                return { ...m, url: signed?.signedUrl };
              });
            }
          });
        }
      }

      return {
        posts,
        nextPage: data.length === pageSize ? pageParam + 1 : undefined,
        totalCount: count || 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}

// Fetch single post with details
export function useProjectPost(id: string) {
  return useQuery({
    queryKey: ["project-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_posts")
        .select(
          `
          *,
          profiles(username, avatar_url),
          projects(id, name, engine, custom_engine),
          post_media(*)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      const post = data as ProjectPost | null;
      if (post && post.post_media && post.post_media.length > 0) {
        const paths = post.post_media.map((m) => m.storage_path);
        const { data: signedData, error: signedError } = await supabase.storage
          .from("project-posts")
          .createSignedUrls(paths, 60 * 60);

        if (!signedError && signedData) {
          post.post_media = post.post_media.map((m) => {
            const signed = signedData.find((s) => s.path === m.storage_path);
            if (signed?.signedUrl) {
              return { ...m, url: signed.signedUrl };
            }
            // Fallback to public URL
            const { data: publicData } = supabase.storage
              .from("project-posts")
              .getPublicUrl(m.storage_path);
            return { ...m, url: publicData.publicUrl };
          });
        }
      }
      return post;
    },
    enabled: !!id,
  });
}

// Fetch user's published projects for post creation
export function useUserProjects() {
  return useQuery({
    queryKey: ["user-projects"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("projects")
        .select("id, name, engine, custom_engine")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Fetch posts by user ID
export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_posts")
        .select(
          `
          *,
          profiles(username, avatar_url),
          projects(id, name, engine, custom_engine),
          post_media(*)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const posts = data as ProjectPost[];

      // Collect all media paths to fetch signed URLs in one go
      const allMedia = posts.flatMap((p) => p.post_media || []);
      if (allMedia.length > 0) {
        const allPaths = allMedia.map((m) => m.storage_path);
        const { data: signedData, error: signedError } = await supabase.storage
          .from("project-posts")
          .createSignedUrls(allPaths, 60 * 60);

        if (!signedError && signedData) {
          posts.forEach((post) => {
            if (post.post_media) {
              post.post_media = post.post_media.map((m) => {
                const signed = signedData.find(
                  (s) => s.path === m.storage_path
                );
                if (signed?.signedUrl) {
                  return { ...m, url: signed.signedUrl };
                }
                // Fallback to public URL
                const { data: publicData } = supabase.storage
                  .from("project-posts")
                  .getPublicUrl(m.storage_path);
                return { ...m, url: publicData.publicUrl };
              });
            }
          });
        }
      }
      return posts;
    },
    enabled: !!userId,
  });
}

// Create new post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Verify user owns the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("user_id")
        .eq("id", postData.project_id)
        .single();

      if (projectError) throw projectError;
      if (project.user_id !== user.id) {
        throw new Error("You don't own this project");
      }

      // Format content with title as first line
      const formattedContent = `# ${postData.title}\n\n${postData.content}`;

      const { data: post, error: postError } = await supabase
        .from("project_posts")
        .insert({
          project_id: postData.project_id,
          user_id: user.id,
          content: formattedContent,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Handle media uploads if any
      if (postData.media && postData.media.length > 0) {
        for (const file of postData.media) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${post.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("project-posts")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Save reference
          await supabase.from("post_media").insert({
            post_id: post.id,
            type: file.type.startsWith("image") ? "image" : "video",
            storage_path: fileName,
          });
        }
      }

      return post;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts", data.user_id] });
      toast.success("Post creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear el post: " + error.message);
    },
  });
}

// Update existing post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostData }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Format content with title if both are provided
      let formattedContent: string | undefined;
      if (data.title && data.content) {
        formattedContent = `# ${data.title}\n\n${data.content}`;
      } else if (data.content) {
        formattedContent = data.content;
      }

      const { error } = await supabase
        .from("project_posts")
        .update({
          content: formattedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-posts"] });
      queryClient.invalidateQueries({ queryKey: ["project-post", data.id] });
      toast.success("Post actualizado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el post: " + error.message);
    },
  });
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("project_posts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-posts"] });
      toast.success("Post eliminado");
    },
    onError: (error) => {
      toast.error("Error al eliminar el post: " + error.message);
    },
  });
}

// Helper function to extract title from content
export function extractTitleFromContent(content: string): string {
  const lines = content.split("\n");
  const firstLine = lines[0] || "";
  // Remove markdown heading syntax if present
  return firstLine.replace(/^#\s*/, "").trim() || "Sin título";
}

// Helper function to extract excerpt from content
export function extractExcerptFromContent(
  content: string,
  maxLength: number = 150
): string {
  const lines = content.split("\n");
  // Skip the title line (first line) and get the content
  const contentWithoutTitle = lines.slice(1).join("\n").trim();

  if (contentWithoutTitle.length <= maxLength) {
    return contentWithoutTitle;
  }

  return contentWithoutTitle.substring(0, maxLength).trim() + "...";
}
