import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export function FeedHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          {t("news.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("news.subtitle")}</p>
      </div>
    </div>
  );
}
