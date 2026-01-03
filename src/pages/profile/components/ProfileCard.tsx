import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { useUpdateProfile, uploadAvatar } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { enUS, es } from "date-fns/locale";

interface ProfileCardProps {
  profile: any;
  user: any;
  getInitials: () => string;
}

export function ProfileCard({ profile, user, getInitials }: ProfileCardProps) {
  const { t, i18n } = useTranslation();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.image_type_error"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.image_size_error"));
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      toast.error((error as Error).message || t("profile.image_upload_error"));
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
      toast.error((error as Error).message || t("profile.image_delete_error"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile?.avatar_url || undefined}
                alt={profile?.username || t("common.anonymous_user")}
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
              {profile?.username || t("common.anonymous_user")}
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
              {profile?.avatar_url ? t("common.change") : t("common.upload")}
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
              {t("common.member_since")}{" "}
              {new Date(profile.created_at).toLocaleDateString(
                i18n.language === "es" ? "es-ES" : "en-US",
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
  );
}
