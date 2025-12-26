import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserProjects } from "@/hooks/useProjectPosts";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Loader2 } from "lucide-react";
import { getEngineLabel } from "@/lib/constants";

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    project_id?: string;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    project_id: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function PostForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Publicar",
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [projectId, setProjectId] = useState(initialData?.project_id || "");

  const { data: projects, isLoading: loadingProjects } = useUserProjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !projectId) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      project_id: projectId,
    });
  };

  const isFormValid = title.trim() && content.trim() && projectId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Selector */}
      <div className="space-y-2">
        <Label htmlFor="project">Proyecto *</Label>
        {loadingProjects ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando proyectos...
          </div>
        ) : projects && projects.length > 0 ? (
          <Select
            value={projectId}
            onValueChange={setProjectId}
            disabled={!!initialData?.project_id}
          >
            <SelectTrigger id="project">
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => {
                const engineLabel =
                  project.engine === "other" && project.custom_engine
                    ? project.custom_engine
                    : getEngineLabel(project.engine);
                return (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({engineLabel})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">
            No tienes proyectos publicados. Crea un proyecto primero para poder
            publicar posts.
          </p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la novedad"
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">
          {title.length}/100 caracteres
        </p>
      </div>

      {/* Content with Markdown Preview */}
      <div className="space-y-2">
        <Label htmlFor="content">Contenido *</Label>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Escribir</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-2">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí el contenido de tu novedad usando Markdown...

**Ejemplos de formato:**
- **Negrita** o __negrita__
- *Cursiva* o _cursiva_
- [Enlaces](https://ejemplo.com)
- `código en línea`
- # Título grande
- ## Título mediano
- ### Título pequeño
- - Lista con viñetas
- 1. Lista numerada
- > Cita
"
              rows={15}
              required
              className="resize-none font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-2">
            <div className="min-h-[400px] border rounded-md p-4 bg-muted/30">
              {content ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <MarkdownRenderer content={content} />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Escribe algo para ver la vista previa...
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          Usa Markdown para dar formato al texto. Cambia a "Vista Previa" para
          ver cómo se verá.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
