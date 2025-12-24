import { Layout } from "@/components/layout/Layout";

export default function News() {
  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Próximamente
          </h1>
          <p className="text-lg text-muted-foreground">
            Estamos trabajando en algo increíble. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    </Layout>
  );
}
