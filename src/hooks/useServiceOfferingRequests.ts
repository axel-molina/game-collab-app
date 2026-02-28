import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useCreateServiceCollaborationRequest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({
      serviceOfferingId,
      requesterId,
      ownerId,
    }: {
      serviceOfferingId: string;
      requesterId: string;
      ownerId: string;
    }) => {
      // Check if a request already exists
      const { data: existingRequest, error: fetchError } = await supabase
        .from("service_offering_collaboration_requests")
        .select("*")
        .eq("service_offering_id", serviceOfferingId)
        .eq("requester_id", requesterId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingRequest) {
        throw new Error("Request already exists");
      }

      const { data, error } = await supabase
        .from("service_offering_collaboration_requests")
        .insert({
          service_offering_id: serviceOfferingId,
          requester_id: requesterId,
          owner_id: ownerId,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Also create a notification for the owner
      await supabase.from("notifications").insert({
        user_id: ownerId,
        type: "service_collaboration_request",
        title: "New Collaboration Request",
        message: "Someone wants to collaborate on your service offering.",
        entity_type: "service_offering",
        entity_id: serviceOfferingId,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["service_offering_requests"],
      });
      toast.success(
        t("services.request_sent", "Collaboration request sent successfully!"),
      );
    },
    onError: (error) => {
      if (
        error instanceof Error &&
        error.message === "Request already exists"
      ) {
        toast.error(
          t(
            "services.request_already_exists",
            "You have already sent a request for this service.",
          ),
        );
      } else {
        console.error("Error creating collaboration request:", error);
        toast.error(
          t("services.request_error", "Failed to send collaboration request"),
        );
      }
    },
  });
};
