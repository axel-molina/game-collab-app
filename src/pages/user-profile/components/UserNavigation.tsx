import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText } from "lucide-react";

interface UserNavigationProps {
  activeTab: "projects" | "posts";
  onTabChange: (tab: "projects" | "posts") => void;
}

export function UserNavigation({
  activeTab,
  onTabChange,
}: UserNavigationProps) {
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
            Proyectos
          </Button>
          <Button
            variant={activeTab === "posts" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("posts")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
}
