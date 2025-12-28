import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  created_at: string;
  roles?: Array<{ id: number; name: string }>;
  technologies?: Array<{ id: number; name: string }>;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("profile_roles_user")
        .select("role_id, profile_roles(id, name)")
        .eq("profile_id", user.id);

      if (rolesError) throw rolesError;

      // Fetch technologies
      const { data: techsData, error: techsError } = await supabase
        .from("profile_technologies")
        .select("technology_id, technologies(id, name)")
        .eq("profile_id", user.id);

      if (techsError) throw techsError;

      return {
        ...profile,
        roles: rolesData?.map((r) => r.profile_roles) as any[],
        technologies: techsData?.map((t) => t.technologies) as any[],
      } as Profile;
    },
    enabled: !!user?.id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      avatar_url?: string | null;
      username?: string;
      bio?: string | null;
      onboarding_completed?: boolean;
      role_ids?: number[];
      technology_ids?: number[];
    }) => {
      if (!user?.id) throw new Error("No user logged in");

      const { role_ids, technology_ids, ...profileData } = data;

      // Update profile bio and other fields
      if (Object.keys(profileData).length > 0) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      // Update roles if provided
      if (role_ids !== undefined) {
        // Delete current roles
        const { error: deleteRolesError } = await supabase
          .from("profile_roles_user")
          .delete()
          .eq("profile_id", user.id);

        if (deleteRolesError) throw deleteRolesError;

        // Insert new roles
        if (role_ids.length > 0) {
          const { error: insertRolesError } = await supabase
            .from("profile_roles_user")
            .insert(
              role_ids.map((role_id) => ({ profile_id: user.id, role_id }))
            );

          if (insertRolesError) throw insertRolesError;
        }
      }

      // Update technologies if provided
      if (technology_ids !== undefined) {
        // Delete current technologies
        const { error: deleteTechsError } = await supabase
          .from("profile_technologies")
          .delete()
          .eq("profile_id", user.id);

        if (deleteTechsError) throw deleteTechsError;

        // Insert new technologies
        if (technology_ids.length > 0) {
          const { error: insertTechsError } = await supabase
            .from("profile_technologies")
            .insert(
              technology_ids.map((technology_id) => ({
                profile_id: user.id,
                technology_id,
              }))
            );

          if (insertTechsError) throw insertTechsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar perfil: ${error.message}`);
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile_roles").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useTechnologies() {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("technologies").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  // Delete old avatar if exists
  const { data: existingFiles } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map((file) => `${userId}/${file.name}`);
    await supabase.storage.from("avatars").remove(filesToDelete);
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
