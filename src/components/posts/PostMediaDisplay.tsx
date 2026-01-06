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
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden bg-muted border animate-in fade-in duration-500",
        className
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

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-black/20 backdrop-blur-sm">
            {media.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  i === currentIndex ? "bg-white w-4" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Multi-item indicator */}
      {media.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm font-medium">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
