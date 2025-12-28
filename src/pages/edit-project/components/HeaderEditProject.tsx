import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderEditProjectProps {
  projectId: string;
}

const HeaderEditProject = ({ projectId }: HeaderEditProjectProps) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={`/projects/${projectId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">Editar proyecto</h1>
      <p className="text-muted-foreground">
        Actualiza la información de tu proyecto.
      </p>
    </div>
  );
};

export default HeaderEditProject;
