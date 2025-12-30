import { useTranslation } from "react-i18next";
import { useProjectMatches } from "@/hooks/useProjectMatches";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedProjects() {
  const { t } = useTranslation();
  const { data: projects = [], isLoading } = useProjectMatches();

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="mb-12 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
          <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("home.recommended")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.slice(0, 4).map((project) => (
          <div key={project.id} className="h-full">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
