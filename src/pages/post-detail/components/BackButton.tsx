import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  return (
    <Button variant="ghost" asChild className="mb-6">
      <Link to="/">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Inicio
      </Link>
    </Button>
  );
};

export default BackButton;
