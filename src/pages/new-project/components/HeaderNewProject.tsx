import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const HeaderNewProject = () => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
      </Button>
      <h1 className="text-3xl font-bold">Nuevo proyecto</h1>
      <p className="text-muted-foreground">
        Comparte tu proyecto con la comunidad y encuentra colaboradores.
      </p>
    </div>
  );
};

export default HeaderNewProject;
