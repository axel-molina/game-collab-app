import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import banner from "../../../assets/dragon3d.png";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative mb-8 w-full overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <img
            src={banner}
            alt="Banner"
            className="w-full h-[400px] object-cover filter blur-sm brightness-75"
          />
        </div>
        <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto font-semibold px-8 h-12 bg-primary hover:bg-primary/90 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
                onClick={() => {
                  const element = document.getElementById("projects-list");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/projects");
                  }
                }}
              >
                {t("hero.cta")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-semibold px-8 h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                onClick={() => {
                  if (user) {
                    navigate("/projects/new");
                  } else {
                    navigate("/auth");
                  }
                }}
              >
                {t("nav.new_project")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
