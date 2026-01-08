import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export type CollaborationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface CollaborationRequest {
  id: string;
  project_id: string;
  requester_id: string;
  owner_id: string;
  status: CollaborationStatus;
  created_at: string;
  responded_at: string | null;
}

export function useProjectCollaboration(
  projectId: string,
  userId: string | undefined
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: request, isLoading } = useQuery({
    queryKey: ["project_collaboration_request", projectId, userId],
    queryFn: async () => {
      if (!userId || !projectId) return null;
      const { data, error } = await supabase
        .from("project_collaboration_requests")
        .select("*")
        .eq("project_id", projectId)
        .eq("requester_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as CollaborationRequest | null;
    },
    enabled: !!userId && !!projectId,
  });

  const requestMutation = useMutation({
    mutationFn: async (ownerId: string) => {
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("project_collaboration_requests")
        .upsert({
          project_id: projectId,
          requester_id: userId,
          owner_id: ownerId,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project_collaboration_request", projectId, userId],
      });
      toast.success(t("projects.request_sent_success"));
    },
    onError: (error) => {
      console.error("Error requesting collaboration:", error);
      toast.error(t("projects.request_sent_error"));
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("project_collaboration_requests")
        .update({ status: "cancelled" })
        .eq("id", requestId)
        .eq("requester_id", userId!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project_collaboration_request", projectId, userId],
      });
      toast.success(t("projects.request_cancelled_success"));
    },
    onError: (error) => {
      console.error("Error cancelling request:", error);
      toast.error(t("projects.request_cancelled_error"));
    },
  });

  return {
    request,
    isLoading,
    requestCollaboration: requestMutation.mutate,
    isRequesting: requestMutation.isPending,
    cancelRequest: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}

export function useCollaborationRequests(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["owner_collaboration_requests", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("project_collaboration_requests")
        .select(
          `
          *,
          projects (name),
          profiles:requester_id (username)
        `
        )
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });

  const respondMutation = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "accepted" | "rejected";
    }) => {
      const { error } = await supabase
        .from("project_collaboration_requests")
        .update({ status, responded_at: new Date().toISOString() })
        .eq("id", requestId)
        .eq("owner_id", userId!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner_collaboration_requests", userId],
      });
      // We might also need to invalidate the requester's status if we had a way to know it,
      // but usually the owner is the one performing this.
      toast.success(t("projects.response_sent_success"));
    },
    onError: (error) => {
      console.error("Error responding to request:", error);
      toast.error(t("projects.response_sent_error"));
    },
  });

  return {
    requests,
    isLoading,
    respondToRequest: respondMutation.mutate,
    isResponding: respondMutation.isPending,
  };
}
