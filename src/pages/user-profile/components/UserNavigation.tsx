import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserNavigationProps {
  activeTab: "projects" | "posts";
  onTabChange: (tab: "projects" | "posts") => void;
}

export function UserNavigation({
  activeTab,
  onTabChange,
}: UserNavigationProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-2">
        <nav className="space-y-1">
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
        </nav>
      </CardContent>
    </Card>
  );
}
