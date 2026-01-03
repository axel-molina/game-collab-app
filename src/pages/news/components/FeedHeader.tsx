import { useTranslation } from "react-i18next";

export function FeedHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{t("news.title")}</h1>
      <p className="text-muted-foreground">{t("news.subtitle")}</p>
    </div>
  );
}
