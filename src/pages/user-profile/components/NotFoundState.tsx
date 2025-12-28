import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundState() {
  return (
    <div className="container max-w-4xl py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Usuario no encontrado</h1>
      <p className="text-muted-foreground mb-8">
        El usuario que buscas no existe.
      </p>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
