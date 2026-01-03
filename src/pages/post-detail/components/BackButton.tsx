import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const BackButton = () => {
  const { t } = useTranslation();
  return (
    <Button variant="ghost" asChild className="mb-6">
      <Link to="/">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("posts.back_to_home")}
      </Link>
    </Button>
  );
};

export default BackButton;
