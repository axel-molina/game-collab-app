import React from "react";
import banner from "../../../../assets/banner.jpg";

const Hero = () => {
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
              Conecta con desarrolladores
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Encuentra el equipo perfecto para tu próximo videojuego o únete a
              proyectos que te apasionen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
