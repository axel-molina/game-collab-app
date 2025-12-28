import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserProjectsTab } from "@/components/profile/UserProjectsTab";
import { useAuth } from "@/hooks/useAuth";

const HeaderNewProjectsProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Proyectos</h2>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>
      <UserProjectsTab userId={user.id} />
    </div>
  );
};

export default HeaderNewProjectsProfile;
