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
} from "lucide-react";
import { Colors } from "@/lib/colors";

interface OnboardingModalProps {
  profile: Profile;
}

export function OnboardingModal({ profile }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Welcome, 1: Bio, 2: Roles, 3: Techs
  const [bio, setBio] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<number[]>([]);

  const { data: allRoles } = useRoles();
  const { data: allTechs } = useTechnologies();
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      setIsOpen(true);
      setBio(profile.bio || "");
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
            {step === 0 && "¡Bienvenido a GameCollab!"}
            {step === 1 && "Cuéntanos sobre ti"}
            {step === 2 && "¿Cuál es tu rol?"}
            {step === 3 && "¿Qué herramientas usas?"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 0 &&
              "Estamos emocionados de tenerte aquí. Ayúdanos a personalizar tu experiencia."}
            {step === 1 &&
              "Una biografía corta ayuda a otros desarrolladores a conocerte mejor."}
            {step === 2 && "Selecciona las áreas en las que te especializas."}
            {step === 3 &&
              "Indica las tecnologías con las que trabajas habitualmente."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[200px]">
          {step === 0 && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Completar tu perfil te ayudará a encontrar proyectos que se
                ajusten a tus habilidades y a que otros te encuentren.
              </p>
              <div className="pt-4">
                <span className="text-xs font-bold uppercase text-primary tracking-widest">
                  3 pasos rápidos
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Textarea
                placeholder="Ej: Desarrollador indie apasionado por los RPGs y la música electrónica..."
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
                {bio.length}/300 caracteres
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {allRoles?.map((role: any) => (
                <Badge
                  key={role.id}
                  variant={
                    selectedRoles.includes(role.id) ? "default" : "outline"
                  }
                  className="cursor-pointer py-2 px-4 text-sm transition-all hover:scale-105"
                  onClick={() => toggleRole(role.id)}
                >
                  <Briefcase className="h-3 w-3 mr-2" />
                  {role.name}
                  {selectedRoles.includes(role.id) && (
                    <Check className="ml-2 h-3 w-3" />
                  )}
                </Badge>
              ))}
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
              Hacer más tarde
            </Button>
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 1 && bio.length > 300}
              >
                Continuar
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
                ¡Empezar!
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
