import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const HeaderNewProject = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("projects.back")}
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">{t("projects.create_title")}</h1>
      <p className="text-muted-foreground">{t("projects.create_subtitle")}</p>
    </div>
  );
};

export default HeaderNewProject;
