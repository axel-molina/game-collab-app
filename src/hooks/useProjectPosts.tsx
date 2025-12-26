import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectPost {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: { username: string } | null;
  projects?: {
    id: string;
    name: string;
    engine: string;
    custom_engine: string | null;
  } | null;
}

export interface CreatePostData {
  project_id: string;
  title: string;
  content: string;
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
          profiles(username),
          projects(id, name, engine, custom_engine)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectPost[];
    },
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
          profiles(username),
          projects(id, name, engine, custom_engine)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as ProjectPost | null;
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

      const { data, error } = await supabase
        .from("project_posts")
        .insert({
          project_id: postData.project_id,
          user_id: user.id,
          content: formattedContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-posts"] });
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
