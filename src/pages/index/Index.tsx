import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { useProjects } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks/useDebounce";
import Hero from "@/components/shared/Hero";
import { RecommendedProjects } from "./components/RecommendedProjects";
import { SEO } from "@/components/shared/SEO";

const Index = () => {
  const { t } = useTranslation();
  // ... rest of state
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
      <SEO
        title={t("nav.projects")}
        description={t(
          "projects.description_seo",
          "Explora proyectos de videojuegos, encuentra colaboradores y únete a equipos de desarrollo."
        )}
        url="/projects"
      />
      {/* Hero */}
      <Hero />
      <div id="projects-list" className="container mb-4">
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
            {t("home.results", { count: projects.length })}
          </p>
        )}
        {/* Projects List */}
        <ProjectList projects={projects} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Index;
