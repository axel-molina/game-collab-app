import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  AlignLeft,
  Briefcase,
  Cpu,
  Check,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useRoles,
  useTechnologies,
  useUpdateProfile,
  useCreateRole,
  useDeleteRole,
} from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileInfoProps {
  profile: any;
  user: any;
}

export function ProfileInfo({ profile, user }: ProfileInfoProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<number[]>([]);

  const [roleSearch, setRoleSearch] = useState("");
  const { data: allRoles } = useRoles(roleSearch);
  const { data: allTechs } = useTechnologies();
  const updateProfile = useUpdateProfile();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  const handleCreateRole = async () => {
    if (!roleSearch.trim()) return;
    try {
      const newRole = await createRole.mutateAsync(roleSearch.trim());
      toggleRole(newRole.id);
      setRoleSearch("");
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleDeleteRole = async (e: React.MouseEvent, roleId: number) => {
    e.stopPropagation();
    try {
      await deleteRole.mutateAsync(roleId);
      // Remove from selectedRoles if it was selected
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setSelectedRoles(profile.roles?.map((r: any) => r.id) || []);
      setSelectedTechs(profile.technologies?.map((t: any) => t.id) || []);
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      bio,
      role_ids: selectedRoles,
      technology_ids: selectedTechs,
    });
    setIsEditing(false);
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleTech = (techId: number) => {
    setSelectedTechs((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t("common.personal_info")}</CardTitle>
        <Button
          variant={isEditing ? "ghost" : "outline"}
          size="sm"
          onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
        >
          {isEditing ? <X className="h-4 w-4" /> : t("common.edit_profile")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Username and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {t("common.username")}
              </p>
              <p className="text-base font-semibold truncate">
                {profile?.username || t("common.anonymous_user")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {t("common.email")}
              </p>
              <p className="text-base font-semibold truncate">
                {profile?.email || user.email || t("common.anonymous_user")}
              </p>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <AlignLeft className="h-4 w-4" />
            {t("common.bio")}
          </div>
          {isEditing ? (
            <>
              <Textarea
                placeholder={t("common.bio_placeholder")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`min-h-[100px] resize-none ${
                  bio.length > 300
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              <p
                className={`text-xs text-right mt-1 ${
                  bio.length > 300
                    ? "text-destructive font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {t("posts.characters", { count: bio.length, max: 300 })}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
              {profile?.bio || t("common.bio_empty")}
            </p>
          )}
        </div>

        {/* Roles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            {t("common.roles")}
          </div>
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <div className="w-full space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("profile.role_search_placeholder")}
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="h-9"
                  />
                  {roleSearch &&
                    !allRoles?.some(
                      (r) => r.name.toLowerCase() === roleSearch.toLowerCase()
                    ) && (
                      <Button
                        type="button"
                        size="sm"
                        className="h-9 gap-1"
                        onClick={handleCreateRole}
                        disabled={createRole.isPending}
                      >
                        {createRole.isPending ? (
                          <Plus className="h-3 w-3 animate-spin" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                        {t("profile.create_role")}
                      </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allRoles?.map((role: any) => (
                    <Badge
                      key={role.id}
                      variant={
                        selectedRoles.includes(role.id) ? "default" : "outline"
                      }
                      className="group cursor-pointer py-1.5 px-3 hover:bg-primary/90 flex items-center gap-1.5"
                      onClick={() => toggleRole(role.id)}
                    >
                      {role.name}
                      {role.is_custom && (
                        <Sparkles className="h-3 w-3 text-yellow-400 fill-current" />
                      )}
                      {selectedRoles.includes(role.id) && (
                        <Check className="h-3 w-3" />
                      )}
                      {role.is_custom && role.created_by === user.id && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteRole(e, role.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive rounded-full transition-all"
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : profile?.roles && profile.roles.length > 0 ? (
              profile.roles.map((role: any) => (
                <Badge key={role.id} variant="secondary" className="py-1 px-3">
                  {role.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">
                {t("profile.no_roles")}
              </span>
            )}
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Cpu className="h-4 w-4" />
            {t("common.techs")}
          </div>
          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              allTechs?.map((tech: any) => (
                <Badge
                  key={tech.id}
                  variant={
                    selectedTechs.includes(tech.id) ? "default" : "outline"
                  }
                  className="cursor-pointer py-1.5 px-3 hover:bg-primary/90"
                  onClick={() => toggleTech(tech.id)}
                >
                  {tech.name}
                  {selectedTechs.includes(tech.id) && (
                    <Check className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))
            ) : profile?.technologies && profile.technologies.length > 0 ? (
              profile.technologies.map((tech: any) => (
                <Badge key={tech.id} variant="secondary" className="py-1 px-3">
                  {tech.name}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground italic">
                {t("profile.no_techs")}
              </span>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={updateProfile.isPending || bio.length > 300}
            >
              {updateProfile.isPending && (
                <Plus className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("common.save_changes")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
