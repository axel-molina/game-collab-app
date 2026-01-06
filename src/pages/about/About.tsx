import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconGamepad from "../../../assets/icon.png";
import { Colors } from "@/lib/colors";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/shared/SEO";

export default function About() {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEO
        title={t("nav.about")}
        description={t(
          "about.description_seo",
          "Conoce más sobre GameCollab, la plataforma para conectar desarrolladores de videojuegos de todo el mundo."
        )}
        url="/about"
      />
      <div className="container max-w-4xl py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <img
              src={IconGamepad}
              alt="GameCollab"
              className="h-12 w-16 text-primary"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("about.title")}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              <span style={{ color: Colors.gameBlue }}>Game</span>
              <span style={{ color: Colors.collabGreen }}>Collab</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">
              {t("about.description_1")}
            </p>

            <p className="text-lg leading-relaxed">
              {t("about.description_2")}
            </p>

            <p className="text-lg leading-relaxed font-semibold text-primary">
              {t("about.motto")}
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
