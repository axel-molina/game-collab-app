import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/shared/SEO";

export default function Donaciones() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title="Donaciones"
        description="Apoya a Game Collab para que sigamos funcionando y mejorando."
        url="/donaciones"
      />
      <div className="container max-w-2xl py-16">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Gracias por ser parte de Game Collab!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Agradecemos tu participación y colaboración en Game Collab. Esta plataforma está totalmente dedicada y dirigida por la comunidad de desarrolladores de videojuegos.
          </p>

          <Card className="w-full mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Plataforma gratuita</span>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Game Collab es y será siempre gratuita. Sin embargo, nos vemos en la necesidad de aceptar donaciones para continuar funcionando y mejorando.
              </p>
            </CardContent>
          </Card>

          <a
            href="https://tecito.app/gamecollab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button className="gap-2 w-full sm:w-auto" size="lg">
              <Heart className="h-5 w-5" />
              Donar para mantener Game Collab viva
            </Button>
          </a>
        </div>
      </div>
    </Layout>
  );
}