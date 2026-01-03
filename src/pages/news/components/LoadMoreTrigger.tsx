import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface LoadMoreTriggerProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const LoadMoreTrigger = forwardRef<HTMLDivElement, LoadMoreTriggerProps>(
  ({ isFetchingNextPage, hasNextPage, onLoadMore }, ref) => {
    const { t } = useTranslation();

    return (
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("common.loading_more")}</span>
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {t("common.load_more")}
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">
            {t("common.no_more_content")}
          </p>
        )}
      </div>
    );
  }
);

LoadMoreTrigger.displayName = "LoadMoreTrigger";
