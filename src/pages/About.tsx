import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import IconGamepad from "../../assets/icon.png";
import { Colors } from "@/lib/colors";

export default function About() {
  return (
    <Layout>
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
            Sobre nosotros
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              <span style={{ color: Colors.gameBlue }}>Game</span>
              <span style={{ color: Colors.collabGreen }}>
                Collab
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">
              GameCollab es la plataforma diseñada para centralizar la
              colaboración en el desarrollo de videojuegos. Conectamos a
              desarrolladores, artistas, músicos y otros creativos del sector en
              un ecosistema dinámico y eficiente.
            </p>

            <p className="text-lg leading-relaxed">
              En GameCollab, los usuarios pueden compartir sus ideas, mostrar
              avances y gestionar la planificación de sus proyectos. Además, la
              plataforma permite a los profesionales destacar sus aptitudes en
              perfiles personalizados, facilitando que encuentren proyectos que
              se alineen perfectamente con sus conocimientos y metas.
            </p>

            <p className="text-lg leading-relaxed font-semibold text-primary">
              Donde las ideas se convierten en juegos.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
