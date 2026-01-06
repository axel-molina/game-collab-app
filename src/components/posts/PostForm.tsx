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
import { useTranslation } from "react-i18next";
import { PostMediaUpload } from "./PostMediaUpload";

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
    media?: File[];
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
  submitLabel,
}: PostFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [projectId, setProjectId] = useState(initialData?.project_id || "");
  const [media, setMedia] = useState<File[]>([]);

  const { data: projects, isLoading: loadingProjects } = useUserProjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !projectId) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      project_id: projectId,
      media,
    });
  };

  const isFormValid = title.trim() && content.trim() && projectId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Selector */}
      <div className="space-y-2">
        <Label htmlFor="project">{t("posts.project_label")} *</Label>
        {loadingProjects ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("posts.loading_projects")}
          </div>
        ) : projects && projects.length > 0 ? (
          <Select
            value={projectId}
            onValueChange={setProjectId}
            disabled={!!initialData?.project_id}
          >
            <SelectTrigger id="project">
              <SelectValue placeholder={t("posts.project_placeholder")} />
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
            {t("posts.no_projects")}
          </p>
        )}
      </div>

      {/* Media Upload */}
      <div className="space-y-2">
        <Label>{t("posts.media_label")}</Label>
        <PostMediaUpload files={media} onChange={setMedia} />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("posts.title_label")} *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("posts.title_placeholder")}
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">
          {t("posts.characters", { count: title.length })}
        </p>
      </div>

      {/* Content with Markdown Preview */}
      <div className="space-y-2">
        <Label htmlFor="content">{t("posts.content_label")} *</Label>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">{t("posts.write")}</TabsTrigger>
            <TabsTrigger value="preview">{t("posts.preview")}</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-2">
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("posts.content_placeholder")}
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
                  {t("posts.preview_empty")}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          {t("posts.markdown_help")}
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
          {t("posts.cancel")}
        </Button>
        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel || t(initialData ? "posts.save" : "posts.submit")}
        </Button>
      </div>
    </form>
  );
}
