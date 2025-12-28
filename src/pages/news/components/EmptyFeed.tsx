import { FileText } from "lucide-react";

interface EmptyFeedProps {
  filter: "all" | "following";
}

export function EmptyFeed({ filter }: EmptyFeedProps) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {filter === "following"
          ? "No hay contenido de proyectos seguidos"
          : "No hay contenido aún"}
      </h3>
      <p className="text-muted-foreground">
        {filter === "following"
          ? "Guarda proyectos para ver sus actualizaciones aquí"
          : "Sé el primero en compartir una actualización"}
      </p>
    </div>
  );
}
