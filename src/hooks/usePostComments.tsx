import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles?: { username: string } | null;
  replies?: PostComment[];
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  parent_id?: string | null;
}

export interface UpdateCommentData {
  content: string;
}

// Fetch all comments for a post with nested replies
export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select(
          `
          *,
          profiles(username)
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Organize comments into nested structure
      const comments = data as PostComment[];
      const commentMap = new Map<string, PostComment>();
      const topLevelComments: PostComment[] = [];

      // First pass: create map and initialize replies array
      comments.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Second pass: organize into tree structure
      comments.forEach((comment) => {
        const commentWithReplies = commentMap.get(comment.id)!;
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies!.push(commentWithReplies);
          }
        } else {
          topLevelComments.push(commentWithReplies);
        }
      });

      return topLevelComments;
    },
    enabled: !!postId,
  });
}

// Create new comment
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: CreateCommentData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Fetch post owner and content for notification
      const { data: postData } = await supabase
        .from("project_posts")
        .select("user_id, content")
        .eq("id", commentData.post_id)
        .single();

      // Fetch parent comment owner if this is a reply
      let parentCommentOwnerId: string | undefined;
      if (commentData.parent_id) {
        const { data: parentData } = await supabase
          .from("post_comments")
          .select("user_id")
          .eq("id", commentData.parent_id)
          .single();
        parentCommentOwnerId = parentData?.user_id;
      }

      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: commentData.post_id,
          user_id: user.id,
          content: commentData.content,
          parent_id: commentData.parent_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", data.post_id],
      });
      toast.success("Comentario agregado");
    },
    onError: (error) => {
      toast.error("Error al agregar comentario: " + error.message);
    },
  });
}

// Update comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      postId,
      data,
    }: {
      id: string;
      postId: string;
      data: UpdateCommentData;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("post_comments")
        .update({
          content: data.content,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return { id, postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", data.postId],
      });
      toast.success("Comentario actualizado");
    },
    onError: (error) => {
      toast.error("Error al actualizar comentario: " + error.message);
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return { id, postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", data.postId],
      });
      toast.success("Comentario eliminado");
    },
    onError: (error) => {
      toast.error("Error al eliminar comentario: " + error.message);
    },
  });
}
