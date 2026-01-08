import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export type NotificationType =
  | "like"
  | "follow"
  | "comment"
  | "project_request"
  | "collaboration_request"
  | "collaboration_response"
  | "new_project_post"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!userId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          // Show real-time toast
          toast.success(newNotification.title, {
            description: newNotification.message,
            duration: 2000,
            position: "bottom-right",
          });

          // Update local cache automatically
          queryClient.setQueryData(
            ["notifications", userId],
            (old: Notification[] = []) => [newNotification, ...old]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        ["notifications", userId],
        (old: Notification[] = []) =>
          old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications", userId],
        (old: Notification[] = []) => old.map((n) => ({ ...n, is_read: true }))
      );
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}

/**
 * Helper to send a notification
 * Since RLS might restrict client-side insertion if not properly configured,
 * this function assumes the necessary insert policy exists.
 */
export async function createNotification({
  user_id,
  type,
  title,
  message,
  entity_type,
  entity_id,
}: Omit<Notification, "id" | "is_read" | "created_at">) {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id,
      type,
      title,
      message,
      entity_type,
      entity_id,
    },
  ]);

  if (error) {
    console.error("Error creating notification:", error);
    return { error };
  }
  return { success: true };
}

/**
 * Hook to send notifications from other components
 */
export function useSendNotification() {
  const { t } = useTranslation();

  const send = async ({
    recipientId,
    type,
    entityType,
    entityId,
    projectName,
  }: {
    recipientId: string;
    type: NotificationType;
    entityType?: string;
    entityId?: string;
    projectName?: string;
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id === recipientId) return;

    // Get current user profile for the name
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const username = profile?.username || t("common.anonymous");

    let title = "";
    let message = "";

    switch (type) {
      case "like":
        title = t("notifications.new_like");
        message = t("notifications.new_like_desc", { username, projectName });
        break;
      case "follow":
        title = t("notifications.new_favorite");
        message = t("notifications.new_favorite_desc", {
          username,
          projectName,
        });
        break;
      case "comment":
        title = t("notifications.new_comment");
        message = t("notifications.new_comment_desc", { username });
        break;
      case "project_request":
        title = t("notifications.new_join_request");
        message = t("notifications.new_join_request_desc", {
          username,
          projectName,
        });
        break;
    }

    return createNotification({
      user_id: recipientId,
      type,
      title,
      message,
      entity_type: entityType || null,
      entity_id: entityId || null,
    });
  };

  return { sendNotification: send };
}
