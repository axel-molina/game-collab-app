import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { PublicUserProjectsTab } from "@/components/profile/PublicUserProjectsTab";
import { PublicUserPostsTab } from "@/components/profile/PublicUserPostsTab";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { UserProfileCard } from "./components/UserProfileCard";
import { UserNavigation } from "./components/UserNavigation";
import { NotFoundState } from "./components/NotFoundState";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, error } = usePublicProfile(username!);
  const [activeTab, setActiveTab] = useState<"projects" | "posts">("projects");

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <NotFoundState />
      </Layout>
    );
  }

  const getInitials = () => {
    if (profile.username) {
      return profile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("profile.back")}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <UserProfileCard profile={profile} getInitials={getInitials} />
            <UserNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </aside>

          {/* Main Content */}
          <div className="min-h-[600px]">
            {activeTab === "projects" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t("profile.projects")}</h2>
                <PublicUserProjectsTab userId={profile.id} />
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t("profile.posts")}</h2>
                <PublicUserPostsTab userId={profile.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
