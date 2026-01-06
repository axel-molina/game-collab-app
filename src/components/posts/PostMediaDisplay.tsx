import { useState } from "react";
import { PostMedia } from "@/hooks/useProjectPosts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PostMediaDisplayProps {
  media: PostMedia[];
  className?: string;
}

export function PostMediaDisplay({ media, className }: PostMediaDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) return null;

  const current = media[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative group rounded-xl overflow-hidden bg-muted border animate-in fade-in duration-500"
        )}
      >
        {/* Media item */}
        <div className="aspect-video w-full flex items-center justify-center">
          {current.type === "image" ? (
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={current.url}
                  alt="Post media"
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
                />
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] h-[90vh] p-0 border-none bg-black/90">
                <img
                  src={current.url}
                  alt="Post media full"
                  className="w-full h-full object-contain"
                />
              </DialogContent>
            </Dialog>
          ) : (
            <video
              key={current.url}
              controls
              className="w-full h-full object-contain bg-black"
              poster={media.find((m) => m.type === "image")?.url}
            >
              <source src={current.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Navigation arrows (if multiple) */}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Multi-item indicator */}
            <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm font-medium">
              {currentIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {media.map((item, i) => (
            <button
              key={item.id || i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative flex-shrink-0 w-20 aspect-video rounded-md overflow-hidden border-2 transition-all",
                i === currentIndex
                  ? "border-primary ring-2 ring-primary/20 scale-95"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <div className="bg-primary/20 p-1.5 rounded-full">
                    <Maximize2 className="h-3 w-3 text-primary" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
