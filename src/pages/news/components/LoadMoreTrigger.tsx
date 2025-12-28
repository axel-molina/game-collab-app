import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface LoadMoreTriggerProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const LoadMoreTrigger = forwardRef<HTMLDivElement, LoadMoreTriggerProps>(
  ({ isFetchingNextPage, hasNextPage, onLoadMore }, ref) => {
    return (
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando más...</span>
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            Cargar más
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">
            No hay más contenido para mostrar
          </p>
        )}
      </div>
    );
  }
);

LoadMoreTrigger.displayName = "LoadMoreTrigger";
