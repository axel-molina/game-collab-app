import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { PublicUserProjectsTab } from "@/components/profile/PublicUserProjectsTab";
import { PublicUserPostsTab } from "@/components/profile/PublicUserPostsTab";
import { ArrowLeft, User, FolderOpen, FileText } from "lucide-react";
import { useState } from "react";

export default function UserProfile() {
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
        <div className="container max-w-4xl py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Usuario no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            El usuario que buscas no existe.
          </p>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
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
            Volver
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.username}
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center w-full">
                    <h2 className="text-xl font-bold">{profile.username}</h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {profile.email}
                    </p>
                  </div>

                  {profile.created_at && (
                    <div className="text-xs text-muted-foreground text-center pt-2 border-t w-full">
                      Miembro desde{" "}
                      {new Date(profile.created_at).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "short",
                        }
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "projects" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("projects")}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Proyectos
                  </Button>
                  <Button
                    variant={activeTab === "posts" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("posts")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Posts
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="min-h-[600px]">
            {activeTab === "projects" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Proyectos</h2>
                <PublicUserProjectsTab userId={profile.id} />
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Posts</h2>
                <PublicUserPostsTab userId={profile.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
