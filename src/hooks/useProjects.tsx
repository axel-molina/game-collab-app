import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  completed: boolean;
}

export interface ProjectPosition {
  id: string;
  project_id: string;
  position: string;
  is_custom: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  engine: string;
  custom_engine: string | null;
  engine_version: string;
  description: string;
  contact: string;
  created_at: string;
  updated_at: string;
  profiles?: { username: string } | null;
  project_images?: ProjectImage[];
  project_tasks?: ProjectTask[];
  project_positions?: ProjectPosition[];
}

interface ProjectFilters {
  engine?: string;
  position?: string;
  search?: string;
}

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select(
          `
          *,
          profiles(username),
          project_images(*),
          project_tasks(*),
          project_positions(*)
        `
        )
        .order("created_at", { ascending: false });

      if (filters.engine && filters.engine !== "all") {
        query = query.eq("engine", filters.engine);
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      let projects = data as Project[];

      // Filter by position client-side (needs to check nested data)
      if (filters.position && filters.position !== "all") {
        projects = projects.filter((project) =>
          project.project_positions?.some(
            (pos) => pos.position === filters.position
          )
        );
      }

      return projects;
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          profiles(username),
          project_images(*),
          project_tasks(*),
          project_positions(*)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!id,
  });
}

export interface CreateProjectData {
  name: string;
  engine: string;
  custom_engine?: string;
  engine_version: string;
  description: string;
  contact: string;
  images: File[];
  tasks: { title: string; completed: boolean }[];
  positions: { position: string; is_custom: boolean }[];
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: data.name,
          engine: data.engine,
          custom_engine: data.custom_engine || null,
          engine_version: data.engine_version,
          description: data.description,
          contact: data.contact,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Upload images
      const imageUrls: string[] = [];
      for (const file of data.images) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${
          project.id
        }/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      // Insert image records
      if (imageUrls.length > 0) {
        const { error: imagesError } = await supabase
          .from("project_images")
          .insert(
            imageUrls.map((url) => ({ project_id: project.id, image_url: url }))
          );

        if (imagesError) throw imagesError;
      }

      // Insert tasks
      if (data.tasks.length > 0) {
        const { error: tasksError } = await supabase
          .from("project_tasks")
          .insert(
            data.tasks.map((task) => ({
              project_id: project.id,
              title: task.title,
              completed: task.completed,
            }))
          );

        if (tasksError) throw tasksError;
      }

      // Insert positions
      if (data.positions.length > 0) {
        const { error: positionsError } = await supabase
          .from("project_positions")
          .insert(
            data.positions.map((pos) => ({
              project_id: project.id,
              position: pos.position,
              is_custom: pos.is_custom,
            }))
          );

        if (positionsError) throw positionsError;
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Proyecto creado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al crear el proyecto: " + error.message);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProjectData> & { imagesToDelete?: string[] };
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Update project
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          name: data.name,
          engine: data.engine,
          custom_engine: data.custom_engine || null,
          engine_version: data.engine_version,
          description: data.description,
          contact: data.contact,
        })
        .eq("id", id);

      if (projectError) throw projectError;

      // Delete removed images
      if (data.imagesToDelete?.length) {
        await supabase
          .from("project_images")
          .delete()
          .in("id", data.imagesToDelete);
      }

      // Upload new images
      if (data.images?.length) {
        const imageUrls: string[] = [];
        for (const file of data.images) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

          imageUrls.push(urlData.publicUrl);
        }

        if (imageUrls.length > 0) {
          await supabase
            .from("project_images")
            .insert(
              imageUrls.map((url) => ({ project_id: id, image_url: url }))
            );
        }
      }

      // Update tasks - delete and recreate
      if (data.tasks) {
        await supabase.from("project_tasks").delete().eq("project_id", id);
        if (data.tasks.length > 0) {
          await supabase.from("project_tasks").insert(
            data.tasks.map((task) => ({
              project_id: id,
              title: task.title,
              completed: task.completed,
            }))
          );
        }
      }

      // Update positions - delete and recreate
      if (data.positions) {
        await supabase.from("project_positions").delete().eq("project_id", id);
        if (data.positions.length > 0) {
          await supabase.from("project_positions").insert(
            data.positions.map((pos) => ({
              project_id: id,
              position: pos.position,
              is_custom: pos.is_custom,
            }))
          );
        }
      }

      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
      toast.success("Proyecto actualizado exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar el proyecto: " + error.message);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Proyecto eliminado");
    },
    onError: (error) => {
      toast.error("Error al eliminar el proyecto: " + error.message);
    },
  });
}
