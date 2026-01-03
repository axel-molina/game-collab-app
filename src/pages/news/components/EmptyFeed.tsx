import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyFeedProps {
  filter: "all" | "following";
}

export function EmptyFeed({ filter }: EmptyFeedProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {filter === "following"
          ? t("news.empty_following_title")
          : t("news.empty_all_title")}
      </h3>
      <p className="text-muted-foreground">
        {filter === "following"
          ? t("news.empty_following_desc")
          : t("news.empty_all_desc")}
      </p>
    </div>
  );
}
