import { useState, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, uploadAvatar } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mail,
  User,
  Upload,
  Camera,
  Bookmark,
  LogOut,
  FileText,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { FollowingProjectsTab } from "@/components/profile/FollowingProjectsTab";
import { UserPostsTab } from "@/components/profile/UserPostsTab";
import { UserProjectsTab } from "@/components/profile/UserProjectsTab";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "projects" | "posts" | "saved"
  >("profile");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get initials from username or email
  const getInitials = () => {
    if (profile?.username) {
      return profile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      toast.error((error as Error).message || "Error al subir la imagen");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id) return;
    setIsUploading(true);
    try {
      // Delete avatar from storage
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(user.id);

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(
          (file) => `${user.id}/${file.name}`
        );
        await supabase.storage.from("avatars").remove(filesToDelete);
      }

      // Update profile
      await updateProfile.mutateAsync({ avatar_url: null });
    } catch (error: unknown) {
      console.error("Error removing avatar:", error);
      toast.error((error as Error).message || "Error al eliminar la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={profile?.username || "Usuario"}
                      />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="text-center w-full">
                    <h2 className="text-xl font-bold">
                      {profile?.username || "Usuario"}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {profile?.email || user.email}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1 gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      {profile?.avatar_url ? "Cambiar" : "Subir"}
                    </Button>
                    {profile?.avatar_url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        disabled={isUploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {profile?.created_at && (
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
                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
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
                  <Button
                    variant={activeTab === "saved" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("saved")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Guardados
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* Sign Out Button */}
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Cerrar sesión
            </Button>
          </aside>

          {/* Main Content */}
          <div className="min-h-[600px]">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Nombre de usuario
                      </p>
                      <p className="text-lg font-semibold">
                        {profile?.username || "Sin nombre"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Correo electrónico
                      </p>
                      <p className="text-lg font-semibold">
                        {profile?.email || user.email || "Sin email"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Mis Proyectos</h2>
                  <Button asChild>
                    <Link to="/projects/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Proyecto
                    </Link>
                  </Button>
                </div>
                <UserProjectsTab userId={user.id} />
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Mis Posts</h2>
                  <Button asChild>
                    <Link to="/posts/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Post
                    </Link>
                  </Button>
                </div>
                <UserPostsTab userId={user.id} />
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Proyectos Guardados</h2>
                <FollowingProjectsTab userId={user.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
