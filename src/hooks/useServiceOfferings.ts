import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useServiceOfferings = () => {
  return useQuery({
    queryKey: ["service_offerings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_offerings")
        .select(
          `
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching service offerings:", error);
        throw error;
      }
      return data;
    },
  });
};

export const useServiceOffering = (id: string) => {
  return useQuery({
    queryKey: ["service_offerings", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("service_offerings")
        .select(
          `
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching service offering:", error);
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateServiceOffering = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (newOffering: {
      title: string;
      description: string;
      specialty: string;
      contact: string;
      user_id: string;
      image: File | null;
    }) => {
      let imageUrl = null;

      if (newOffering.image) {
        const fileExt = newOffering.image.name.split(".").pop();
        const fileName = `${newOffering.user_id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, newOffering.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("service_offerings")
        .insert({
          title: newOffering.title,
          description: newOffering.description,
          specialty: newOffering.specialty,
          contact: newOffering.contact,
          user_id: newOffering.user_id,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_offerings"] });
      toast.success(
        t("services.created_success", "Service offering created successfully"),
      );
    },
    onError: (error) => {
      console.error("Error creating service offering:", error);
      toast.error(
        t("services.create_error", "Failed to create service offering"),
      );
    },
  });
};

export const useDeleteServiceOffering = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_offerings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_offerings"] });
      toast.success(
        t("services.deleted_success", "Service offering deleted successfully"),
      );
    },
    onError: (error) => {
      console.error("Error deleting service offering:", error);
      toast.error(
        t("services.delete_error", "Failed to delete service offering"),
      );
    },
  });
};
