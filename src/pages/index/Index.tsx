import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks/useDebounce";
import Hero from "./components/Hero";
import { RecommendedProjects } from "./components/RecommendedProjects";

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
      <Hero />
      <div className="container mb-4">
        {/* Recommended Projects (if any) */}
        <RecommendedProjects />

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
