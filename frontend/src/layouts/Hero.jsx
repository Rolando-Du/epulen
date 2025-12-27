import React from "react";

const Hero = () => {
  return (
    <header className="relative py-16 md:py-28 px-4 sm:px-8 md:px-12 overflow-hidden bg-[#020617]">
      {/* Fondo y Decoración Sólida */}
      <div className="absolute inset-0 bg-[#E67E22]/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-[#E67E22]/30"></div>

      {/* Contenedor Principal */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Columna de Texto */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Badge de Certificación - Color Sólido */}
            <div className="inline-flex items-center gap-3 w-fit px-4 py-2 rounded-full border border-[#E67E22]/30 bg-[#E67E22]/10 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E67E22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E67E22]"></span>
              </span>
              <span className="text-[#E67E22] text-[10px] font-black tracking-[0.2em] uppercase">
                Suministros Técnicos Certificados
              </span>
            </div>

            {/* Título con Color Sólido */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              EQUIPANDO TU <br />
              <span className="text-[#E67E22]">INTEGRIDAD</span>
            </h1>

            <div className="relative mb-10">
              <p className="text-slate-400 max-w-lg text-base md:text-xl leading-relaxed border-l-4 border-[#E67E22] pl-6 py-1">
                Especialistas en EPP de alto impacto para{" "}
                <span className="text-white font-semibold">
                  Minería y Petróleo
                </span>
                . Seguridad diseñada para entornos críticos de alto riesgo.
              </p>
            </div>

            {/* Botones - Sin degradados */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              <a
                href="#catalogo"
                className="bg-[#E67E22] hover:bg-[#d36d10] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black transition-all duration-300 shadow-lg shadow-[#E67E22]/20 uppercase tracking-widest text-xs transform hover:-translate-y-1 text-center"
              >
                Explorar Catálogo
              </a>
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="text-white font-black text-xs md:text-sm tracking-tighter uppercase">
                  Normativa 2025
                </div>
                <div className="w-px h-4 bg-slate-700"></div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  ANSI Z87.1
                </div>
              </div>
            </div>

            {/* Stats Compactos */}
            <div className="mt-12 md:mt-16 flex gap-8 md:gap-12 border-t border-slate-800/50 pt-10">
              {[
                { val: "+500", lab: "Items" },
                { val: "100%", lab: "Oficial" },
                { val: "ARG", lab: "Industria" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-white font-black text-xl md:text-2xl tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">
                    {stat.lab}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de Imagen */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-4xl overflow-hidden border border-slate-800 group transition-all duration-500 hover:border-[#E67E22]/50 shadow-2xl">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <img
                src="https://imgs.search.brave.com/vIbC1jOSZ7YZvDhhdg-lTVhycIChWlovzo5-OuYQjnI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTA5/NDI1MjYyL2VzL2Zv/dG8vY2FsbGUtc29s/ZGFkb3IuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXpHSVJo/VW5lYXRZN0ZVcFRi/WGFOSVN0UjUzeXhH/d05BRnNvelJmSktl/bzQ9"
                alt="Seguridad Industrial Epulen"
                className="w-full aspect-4/5 object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Badge Flotante con el color unificado */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#020617]/95 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[#E67E22] font-black text-lg tracking-tighter italic">
                    MAX-GEAR
                  </div>
                  <div className="text-[#4ade80] text-[8px] uppercase tracking-widest font-bold">
                    Protección Profesional
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full border border-[#4ade80]/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E67E26] animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Decoración geométrica en naranja sólido */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l-2 border-b-2 border-[#E67E22]/20 rounded-bl-4xl -z-10"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-r-2 border-t-2 border-[#E67E22]/20 rounded-tr-4xl -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
