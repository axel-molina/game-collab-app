import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useSendNotification } from "./useNotifications";

export interface ProjectLike {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface ProjectLikesData {
  likes: ProjectLike[];
  count: number;
  userLiked: boolean;
}

export function useProjectLikes(projectId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch likes
  const { data, isLoading } = useQuery({
    queryKey: ["project-likes", projectId],
    queryFn: async () => {
      const { data: likes, error } = await supabase
        .from("project_likes")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;

      const userLiked = user
        ? likes?.some((like) => like.user_id === user.id) ?? false
        : false;

      return {
        likes: likes || [],
        count: likes?.length || 0,
        userLiked,
      } as ProjectLikesData;
    },
    enabled: !!projectId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!projectId) return;

    const newChannel = supabase
      .channel(`project-likes:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_likes",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          // Invalidate and refetch on any change
          queryClient.invalidateQueries({
            queryKey: ["project-likes", projectId],
          });
        }
      )
      .subscribe();

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [projectId, queryClient]);

  const { sendNotification } = useSendNotification();

  // Toggle like mutation
  const toggleLike = useMutation({
    mutationFn: async ({
      recipientId,
      projectName,
    }: {
      recipientId: string;
      projectName: string;
    }) => {
      if (!user) {
        toast.error("Debes iniciar sesión para dar like");
        throw new Error("Not authenticated");
      }

      // Check if user already liked
      const { data: existingLike } = await supabase
        .from("project_likes")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike - delete directly using project_id and user_id
        const { error } = await supabase
          .from("project_likes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", user.id);

        if (error) {
          toast.error("Error al quitar el like");
          throw error;
        }
        toast.success("Like eliminado");
        return { action: "unliked" as const };
      } else {
        // Like
        const { error } = await supabase.from("project_likes").upsert(
          {
            project_id: projectId,
            user_id: user.id,
          },
          {
            onConflict: "project_id,user_id",
            ignoreDuplicates: true,
          }
        );

        if (error) {
          // Check if it's because user is the owner
          if (error.message.includes("policy") || error.code === "42501") {
            toast.error("No puedes dar like a tu propio proyecto");
          } else {
            toast.error("Error al dar like");
          }
          throw error;
        }
        toast.success("Like agregado");
        return { action: "liked" as const };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-likes", projectId] });
    },
  });

  return {
    likes: data?.likes || [],
    count: data?.count || 0,
    userLiked: data?.userLiked || false,
    isLoading,
    toggleLike: toggleLike.mutate,
    isToggling: toggleLike.isPending,
  };
}
