import { useState, useCallback } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Video, X, Upload, FileIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface PostMediaUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function PostMediaUpload({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 50,
}: PostMediaUploadProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const currentFiles = [...files];
      const validFiles: File[] = [];

      Array.from(newFiles).forEach((file) => {
        // Validate type
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) {
          toast.error(t("posts.invalid_file_type", { name: file.name }));
          return;
        }

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(
            t("posts.file_too_large", { name: file.name, size: maxSizeMB })
          );
          return;
        }

        // Validate count
        if (currentFiles.length + validFiles.length >= maxFiles) {
          toast.error(t("posts.max_files_reached", { count: maxFiles }));
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        onChange([...currentFiles, ...validFiles]);
      }
    },
    [files, maxFiles, maxSizeMB, onChange, t]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/50",
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border",
          files.length >= maxFiles &&
            "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = "image/*,video/*";
          input.onchange = (e) => {
            const fileList = (e.target as HTMLInputElement).files;
            if (fileList) handleFiles(fileList);
          };
          input.click();
        }}
      >
        <div className="bg-primary/10 p-4 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold">{t("posts.upload_media_title")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("posts.upload_max_files")} {maxFiles}.{" "}
            {t("posts.upload_max_size")} {maxSizeMB} {"mb"}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <ScrollArea className="h-auto max-h-[400px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative aspect-square rounded-lg border bg-muted overflow-hidden animate-in fade-in zoom-in duration-300"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-2">
                    <Video className="h-8 w-8 text-primary" />
                    <span className="text-[10px] text-center truncate w-full px-2">
                      {file.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
