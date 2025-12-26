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
      <section className="relative mb-8 w-full overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 z-0">
            <img 
              src={banner} 
              alt="Banner" 
              className="w-full h-[400px] object-cover filter blur-sm brightness-75"
            />
          </div>
          <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                Conecta con desarrolladores
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Encuentra el equipo perfecto para tu próximo videojuego o únete a
                proyectos que te apasionen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mb-4">
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
