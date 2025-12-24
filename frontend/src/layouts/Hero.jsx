import React from "react";

const Hero = () => {
  return (
    <header className="relative py-20 md:py-32 px-6 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(36,163,90,0.08),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#24A35A]/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Badge de Certificación */}
            <div className="inline-flex items-center gap-3 w-fit px-4 py-1.5 rounded-full border border-[#24A35A]/30 bg-[#24A35A]/10 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24A35A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#24A35A]"></span>
              </span>
              <span className="text-[#24A35A] text-[10px] font-black tracking-[0.25em] uppercase">
                Suministros Técnicos Certificados
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              EQUIPANDO TU <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#24A35A] via-[#E67E22] to-[#24A35A]">
                INTEGRIDAD
              </span>
            </h1>

            <div className="relative mb-10">
              <p className="text-slate-400 max-w-lg text-lg md:text-xl leading-relaxed border-l-4 border-[#E67E22] pl-6 py-2">
                Especialistas en EPP de alto impacto para{" "}
                <span className="text-white font-semibold">
                  Minería y Petróleo
                </span>
                . Seguridad diseñada para entornos críticos de alto riesgo.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <a
                href="#catalogo"
                className="bg-[#24A35A] hover:bg-[#E67E22] text-white px-10 py-5 rounded-2xl font-black transition-all duration-500 shadow-2xl shadow-[#24A35A]/20 uppercase tracking-[0.15em] text-xs transform hover:-translate-y-1"
              >
                Explorar Catálogo
              </a>
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
                <div className="text-[#E67E22] font-black text-sm tracking-tighter uppercase">
                  Normativa 2025
                </div>
                <div className="w-px h-4 bg-slate-700"></div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  ANSI Z87.1
                </div>
              </div>
            </div>

            {/* Stats Compactos Integrados */}
            <div className="mt-16 flex gap-12 border-t border-slate-800/50 pt-10">
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl tracking-tighter">
                  +500
                </span>
                <span className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">
                  Items
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl tracking-tighter">
                  100%
                </span>
                <span className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">
                  Oficial
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl tracking-tighter">
                  ARG
                </span>
                <span className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">
                  Industria
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-slate-800 group transition-all duration-500 hover:border-[#24A35A]/50 shadow-[0_0_50px_-12px_rgba(36,163,90,0.3)]">
              <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>

              <img
                src="https://imgs.search.brave.com/vIbC1jOSZ7YZvDhhdg-lTVhycIChWlovzo5-OuYQjnI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNTA5/NDI1MjYyL2VzL2Zv/dG8vY2FsbGUtc29s/ZGFkb3IuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXpHSVJo/VW5lYXRZN0ZVcFRi/WGFOSVN0UjUzeXhH/d05BRnNvelJmSktl/bzQ9"
                alt="Seguridad Industrial Epulen"
                className="w-full h-150 object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Badge Flotante Estilo Ingeniería */}
              <div className="absolute bottom-8 left-8 right-8 bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-5 rounded-[19px] flex items-center justify-between">
                <div>
                  <div className="text-[#24A35A] font-black text-xl tracking-tighter italic">
                    MAX-GEAR
                  </div>
                  <div className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                    Máxima Protección
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-[#24A35A]/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#24A35A] animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Elemento Decorativo (Marco Desplazado) */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l-2 border-b-2 border-[#24A35A]/30 rounded-bl-[2.5rem] -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 border-r-2 border-t-2 border-[#E67E22]/30 rounded-tr-[2.5rem] -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
