import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { useProjects } from "@/hooks/useProjects";
import { Gamepad2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const Index = () => {
  const [search, setSearch] = useState("");
  const [engine, setEngine] = useState("all");
  const [position, setPosition] = useState("all");

  const debouncedSearch = useDebounce(search, 300);

  const { data: projects = [], isLoading } = useProjects({
    search: debouncedSearch,
    engine,
    position,
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Hero */}
        <section className="text-center py-12 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-6">
            <Gamepad2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Conecta con desarrolladores
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra el equipo perfecto para tu próximo videojuego o únete a proyectos que te apasionen.
          </p>
        </section>

        {/* Filters */}
        <ProjectFilters
          search={search}
          engine={engine}
          position={position}
          onSearchChange={setSearch}
          onEngineChange={setEngine}
          onPositionChange={setPosition}
        />

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""} encontrado{projects.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Projects List */}
        <ProjectList projects={projects} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Index;
