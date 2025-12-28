import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundState() {
  return (
    <div className="container max-w-4xl py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Post no encontrado</h1>
      <p className="text-muted-foreground mb-8">
        El post que buscas no existe o ha sido eliminado.
      </p>
      <Button asChild>
        <Link to="/">Volver al Inicio</Link>
      </Button>
    </div>
  );
}
