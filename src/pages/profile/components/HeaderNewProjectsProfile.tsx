import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserProjectsTab } from "@/components/profile/UserProjectsTab";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

const HeaderNewProjectsProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("profile.projects")}</h2>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            {t("projects.create_title")}
          </Link>
        </Button>
      </div>
      <UserProjectsTab userId={user.id} />
    </div>
  );
};

export default HeaderNewProjectsProfile;
