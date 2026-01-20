import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface NotificationSettings {
  user_id: string;
  likes_enabled: boolean;
  follows_enabled: boolean;
  comments_enabled: boolean;
  project_requests_enabled: boolean;
  collaboration_requests_enabled: boolean;
  collaboration_responses_enabled: boolean;
  new_project_posts_enabled: boolean;
  updated_at: string;
}

export function useNotificationSettings(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching notification settings:", error);
        return null;
      }

      // If settings don't exist, create them
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("user_notification_settings")
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating notification settings:", insertError);
          return null;
        }
        return newData as NotificationSettings;
      }

      return data as NotificationSettings;
    },
    enabled: !!userId,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      if (!userId) throw new Error("No user logged in");

      const { error } = await supabase
        .from("user_notification_settings")
        .update({ ...newSettings, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notification-settings", userId],
      });
      toast.success("Configuración de notificaciones actualizada");
    },
    onError: (error: any) => {
      toast.error("Error al actualizar la configuración: " + error.message);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}
