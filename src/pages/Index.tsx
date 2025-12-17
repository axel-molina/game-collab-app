import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks/useDebounce";
import banner from "../../assets/banner.jpg";

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
      {/* Hero */}
      <section className="text-center mb-8 w-full">
        <img src={banner} alt="Banner" className="mb-6 w-full" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Conecta con desarrolladores
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Encuentra el equipo perfecto para tu próximo videojuego o únete a
          proyectos que te apasionen.
        </p>
      </section>

      <div className="container">
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
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""}{" "}
            encontrado{projects.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Projects List */}
        <ProjectList projects={projects} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Index;
