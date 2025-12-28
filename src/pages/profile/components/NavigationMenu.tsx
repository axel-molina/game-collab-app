import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FolderOpen, FileText, Bookmark } from "lucide-react";

interface NavigationMenuProps {
  activeTab: "profile" | "projects" | "posts" | "saved";
  onTabChange: (tab: "profile" | "projects" | "posts" | "saved") => void;
}

export function NavigationMenu({
  activeTab,
  onTabChange,
}: NavigationMenuProps) {
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
            Perfil
          </Button>
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
          <Button
            variant={activeTab === "saved" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onTabChange("saved")}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Guardados
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
}
