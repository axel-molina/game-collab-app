import { useState, useLayoutEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ThanksModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    const hasSeenThanksModal = sessionStorage.getItem("thanksModalSeen");
    if (!hasSeenThanksModal) {
      setIsOpen(true);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      sessionStorage.setItem("thanksModalSeen", "true");
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <div className="flex flex-col items-center text-center py-6 px-2">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              ¡Gracias por ser parte de Game Collab!
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Agradecemos tu participación y colaboración en Game Collab. Esta plataforma está totalmente dedicada y dirigida por la comunidad de desarrolladores de videojuegos.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-4 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Plataforma gratuita</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Game Collab es y será siempre gratuita. Sin embargo, nos vemos en la necesidad de aceptar donaciones para continuar funcionando y mejorando.
              </p>
            </div>

            <a
              href="https://tecito.app/gamecollab"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full gap-2" size="lg">
                <Heart className="h-4 w-4" />
                Donar para mantener Game Collab viva
              </Button>
            </a>
          </div>
      </DialogContent>
    </Dialog>
  );
}