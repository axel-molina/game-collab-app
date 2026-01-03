import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useRoles,
  useTechnologies,
  useUpdateProfile,
  useCreateRole,
  useDeleteRole,
  Profile,
} from "@/hooks/useProfile";
import {
  Check,
  Loader2,
  Sparkles,
  Briefcase,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface OnboardingModalProps {
  profile: Profile;
}

export function OnboardingModal({ profile }: OnboardingModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Welcome, 1: Bio, 2: Roles, 3: Techs
  const [bio, setBio] = useState("");
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
    if (profile && !profile.onboarding_completed) {
      setIsOpen(true);
      setBio(profile.bio || "");
      if (profile.roles) {
        setSelectedRoles(profile.roles.map((r) => r.id));
      }
      if (profile.technologies) {
        setSelectedTechs(profile.technologies.map((t) => t.id));
      }
    }
  }, [profile]);

  const handleFinish = async (skip = false) => {
    await updateProfile.mutateAsync({
      bio: skip ? profile.bio : bio,
      role_ids: skip ? undefined : selectedRoles,
      technology_ids: skip ? undefined : selectedTechs,
      onboarding_completed: true,
    });
    setIsOpen(false);
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

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {step === 0 && t("profile.onboarding.welcome")}
            {step === 1 && t("profile.onboarding.about_you")}
            {step === 2 && t("profile.onboarding.what_is_your_role")}
            {step === 3 && t("profile.onboarding.what_tools")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 0 && t("profile.onboarding.welcome_desc")}
            {step === 1 && t("profile.onboarding.about_you_desc")}
            {step === 2 && t("profile.onboarding.what_is_your_role_desc")}
            {step === 3 && t("profile.onboarding.what_tools_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[200px]">
          {step === 0 && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {t("profile.onboarding.welcome_help")}
              </p>
              <div className="pt-4">
                <span className="text-xs font-bold uppercase text-primary tracking-widest">
                  {t("profile.onboarding.quick_steps")}
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Textarea
                placeholder={t("profile.onboarding.about_you_placeholder")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p
                className={`text-xs text-right ${
                  bio.length > 300
                    ? "text-destructive font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {t("posts.characters", { count: bio.length, max: 300 })}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("profile.role_search_placeholder")}
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="h-10"
                />
                {roleSearch &&
                  !allRoles?.some(
                    (r) => r.name.toLowerCase() === roleSearch.toLowerCase()
                  ) && (
                    <Button
                      type="button"
                      className="gap-1"
                      onClick={handleCreateRole}
                      disabled={createRole.isPending}
                    >
                      {createRole.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {t("profile.onboarding.add")}
                    </Button>
                  )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-h-[250px] overflow-y-auto p-1">
                {allRoles?.map((role: any) => (
                  <Badge
                    key={role.id}
                    variant={
                      selectedRoles.includes(role.id) ? "default" : "outline"
                    }
                    className="group cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105 flex items-center gap-2"
                    onClick={() => toggleRole(role.id)}
                  >
                    <Briefcase className="h-3 w-3" />
                    {role.name}
                    {role.is_custom && (
                      <Sparkles className="h-3 w-3 text-yellow-400 fill-current" />
                    )}
                    {selectedRoles.includes(role.id) && (
                      <Check className="h-3 w-3" />
                    )}
                    {role.is_custom && role.created_by === profile.id && (
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
          )}

          {step === 3 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {allTechs?.map((tech: any) => (
                <Badge
                  key={tech.id}
                  variant={
                    selectedTechs.includes(tech.id) ? "default" : "outline"
                  }
                  className="cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105"
                  onClick={() => toggleTech(tech.id)}
                >
                  <Cpu className="h-3 w-3 mr-2" />
                  {tech.name}
                  {selectedTechs.includes(tech.id) && (
                    <Check className="ml-2 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFinish(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              {t("profile.onboarding.do_later")}
            </Button>
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("profile.back")}
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && bio.length > 300}
              >
                {t("profile.onboarding.continue")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => handleFinish()}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("profile.onboarding.get_started")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
