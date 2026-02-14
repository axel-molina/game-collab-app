import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  FolderOpen,
  FileText,
  Bookmark,
  Users,
  Settings,
  Award,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavigationMenuProps {
  activeTab:
    | "profile"
    | "projects"
    | "posts"
    | "saved"
    | "collaborations"
    | "achievements"
    | "settings";
  onTabChange: (
    tab:
      | "profile"
      | "projects"
      | "posts"
      | "saved"
      | "collaborations"
      | "achievements"
      | "settings",
  ) => void;
}

export function NavigationMenu({
  activeTab,
  onTabChange,
}: NavigationMenuProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-2">
        <nav className="space-y-1">
          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("profile")}
          >
            <User className="h-4 w-4 mr-2" />
            {t("profile.profile")}
          </Button>
          <Button
            variant={activeTab === "projects" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("projects")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            {t("profile.projects")}
          </Button>
          <Button
            variant={activeTab === "posts" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("posts")}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("profile.posts")}
          </Button>
          <Button
            variant={activeTab === "collaborations" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("collaborations")}
          >
            <Users className="h-4 w-4 mr-2" />
            {t("projects.collaboration_requests")}
          </Button>
          <Button
            variant={activeTab === "saved" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("saved")}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            {t("profile.saved")}
          </Button>
          <Button
            variant={activeTab === "achievements" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("achievements")}
          >
            <Award className="h-4 w-4 mr-2" />
            {t("profile.achievements")}
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("notifications.settings_title")}
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
}
