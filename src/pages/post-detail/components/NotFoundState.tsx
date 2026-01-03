import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function NotFoundState() {
  const { t } = useTranslation();

  return (
    <div className="container max-w-4xl py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">{t("posts.not_found")}</h1>
      <p className="text-muted-foreground mb-8">{t("posts.not_found_desc")}</p>
      <Button asChild>
        <Link to="/">{t("posts.back_to_home")}</Link>
      </Button>
    </div>
  );
}
