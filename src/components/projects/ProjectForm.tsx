import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENGINES, POSITIONS } from "@/lib/constants";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Project, ProjectTask, ProjectPosition, ProjectImage } from "@/hooks/useProjects";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  engine: z.string().min(1, "Selecciona un motor"),
  custom_engine: z.string().optional(),
  engine_version: z.string().min(1, "La versión es requerida"),
  description: z.string().min(10, "Mínimo 10 caracteres").max(2000, "Máximo 2000 caracteres"),
  contact: z.string().min(1, "El contacto es requerido").max(200, "Máximo 200 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: {
    name: string;
    engine: string;
    custom_engine?: string;
    engine_version: string;
    description: string;
    contact: string;
    images: File[];
    imagesToDelete?: string[];
    tasks: { title: string; completed: boolean }[];
    positions: { position: string; is_custom: boolean }[];
  }) => Promise<void>;
  isLoading: boolean;
}

export function ProjectForm({ project, onSubmit, isLoading }: ProjectFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>(project?.project_images || []);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [tasks, setTasks] = useState<{ id?: string; title: string; completed: boolean }[]>(
    project?.project_tasks?.map((t) => ({ id: t.id, title: t.title, completed: t.completed })) || []
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedPositions, setSelectedPositions] = useState<{ position: string; is_custom: boolean }[]>(
    project?.project_positions?.map((p) => ({ position: p.position, is_custom: p.is_custom })) || []
  );
  const [customPosition, setCustomPosition] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || "",
      engine: project?.engine || "",
      custom_engine: project?.custom_engine || "",
      engine_version: project?.engine_version || "",
      description: project?.description || "",
      contact: project?.contact || "",
    },
  });

  const watchEngine = form.watch("engine");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (image: ProjectImage) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    setImagesToDelete((prev) => [...prev, image.id]);
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks((prev) => [...prev, { title: newTaskTitle.trim(), completed: false }]);
      setNewTaskTitle("");
    }
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task))
    );
  };

  const togglePosition = (position: string) => {
    setSelectedPositions((prev) => {
      const exists = prev.some((p) => p.position === position);
      if (exists) {
        return prev.filter((p) => p.position !== position);
      }
      return [...prev, { position, is_custom: false }];
    });
  };

  const addCustomPosition = () => {
    if (customPosition.trim() && !selectedPositions.some((p) => p.position === customPosition.trim())) {
      setSelectedPositions((prev) => [...prev, { position: customPosition.trim(), is_custom: true }]);
      setCustomPosition("");
    }
  };

  const removePosition = (position: string) => {
    setSelectedPositions((prev) => prev.filter((p) => p.position !== position));
  };

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name,
      engine: values.engine,
      custom_engine: values.custom_engine,
      engine_version: values.engine_version,
      description: values.description,
      contact: values.contact,
      images,
      imagesToDelete,
      tasks: tasks.map(({ title, completed }) => ({ title, completed })),
      positions: selectedPositions,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Mi increíble juego" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="engine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un motor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ENGINES.map((engine) => (
                          <SelectItem key={engine.value} value={engine.value}>
                            {engine.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchEngine === "other" && (
                <FormField
                  control={form.control}
                  name="custom_engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motor personalizado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Construct 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="engine_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versión del motor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 2022.3.10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu proyecto, qué tipo de juego es, en qué etapa está..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.map((file, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm">Subir imagen</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas del proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nueva tarea..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
              />
              <Button type="button" variant="secondary" onClick={addTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(index)}
                  />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Posiciones necesarias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {POSITIONS.map((pos) => {
                const isSelected = selectedPositions.some((p) => p.position === pos.value);
                return (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() => togglePosition(pos.value)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>

            {/* Custom positions */}
            <div className="space-y-2">
              <Label>Posición personalizada</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Otra posición..."
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomPosition())}
                />
                <Button type="button" variant="secondary" onClick={addCustomPosition}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected custom positions */}
            <div className="flex flex-wrap gap-2">
              {selectedPositions
                .filter((p) => p.is_custom)
                .map((pos) => (
                  <span
                    key={pos.position}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
                  >
                    {pos.position}
                    <button type="button" onClick={() => removePosition(pos.position)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Email, Discord, Twitter, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {project ? "Guardar cambios" : "Publicar proyecto"}
        </Button>
      </form>
    </Form>
  );
}
