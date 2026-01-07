import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface PostLikesData {
  count: number;
  userLiked: boolean;
}

export function usePostLikes(postId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const queryKey = ["post-likes", postId, user?.id];

  // Fetch likes data
  const { data: likesData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const [countResult, likeResult] = await Promise.all([
        supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId),
        user
          ? supabase
              .from("post_likes")
              .select("id")
              .eq("post_id", postId)
              .eq("user_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (countResult.error) throw countResult.error;
      if (likeResult.error) throw likeResult.error;

      return {
        count: countResult.count || 0,
        userLiked: !!likeResult.data,
      } as PostLikesData;
    },
    enabled: !!postId,
  });

  // Toggle like mutation with Deterministic Logic
  const toggleLikeMutation = useMutation({
    mutationFn: async ({
      postUserId,
      isCurrentlyLiked,
    }: {
      postUserId: string;
      isCurrentlyLiked: boolean;
    }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const currentTime = Date.now();
      if (currentTime - lastClickTime < 300) return;
      setLastClickTime(currentTime);

      const isLiking = !isCurrentlyLiked;

      if (isLiking) {
        // Perform LIKE
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        // Unique violation (23505) is acceptable here
        if (error && error.code !== "23505") throw error;
      } else {
        // Perform UNLIKE
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      }

      return { isLiking };
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<PostLikesData>(queryKey);
      const isLiking = !variables.isCurrentlyLiked;

      queryClient.setQueryData<PostLikesData>(queryKey, {
        count: isLiking
          ? (previousData?.count || 0) + 1
          : Math.max(0, (previousData?.count || 0) - 1),
        userLiked: isLiking,
      });

      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      const errorMessage = (err as any).message;
      if (errorMessage === "Not authenticated") {
        toast.error(t("auth.login_required"));
      } else {
        toast.error(t("common.error_generic"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const getLikesText = useCallback(() => {
    const count = likesData?.count || 0;
    if (count === 0) return "";
    if (count === 1 && likesData?.userLiked) return t("posts.you_liked");
    if (count === 1) return t("posts.one_person_liked");
    return t("posts.multiple_people_liked", { count });
  }, [likesData, t]);

  return {
    count: likesData?.count || 0,
    userLiked: likesData?.userLiked || false,
    isLoading,
    toggleLike: toggleLikeMutation.mutate,
    isToggling: toggleLikeMutation.isPending,
    isAnimating,
    likesText: getLikesText(),
  };
}
