import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, uploadAvatar } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User, Upload, Camera, Bookmark, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowingProjectsTab } from "@/components/profile/FollowingProjectsTab";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
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
        const filesToDelete = existingFiles.map((file) => `${user.id}/${file.name}`);
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
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-2xl">{profile?.username || 'Perfil'}</CardTitle>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                {isSigningOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Cerrar sesión
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "Usuario"} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {profile?.avatar_url ? "Cambiar foto" : "Subir foto"}
                </Button>
                {profile?.avatar_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                  >
                    Eliminar
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
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-6">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Guardados</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Nombre de usuario</p>
                      <p className="text-lg font-semibold">{profile?.username || "Sin nombre"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Correo electrónico</p>
                      <p className="text-lg font-semibold">{profile?.email || user.email || "Sin email"}</p>
                    </div>
                  </div>

                  {profile?.created_at && (
                    <div className="text-center text-sm text-muted-foreground pt-2">
                      Miembro desde{" "}
                      {profile.created_at && new Date(profile.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Proyectos guardados</h3>
                  <FollowingProjectsTab userId={user.id} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default Profile;
