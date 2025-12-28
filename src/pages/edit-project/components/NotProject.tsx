import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotProject = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotProject;
