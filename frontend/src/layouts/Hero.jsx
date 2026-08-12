import React from "react";
import VideoEpulen from "../assets/VIDEO-EPULEN.mp4";

const Hero = () => {
  const puntos = [
    {
      titulo: "Protección",
      texto: "Elementos de seguridad para tareas exigentes.",
    },
    {
      titulo: "Industria",
      texto: "Soluciones para distintos entornos de trabajo.",
    },
    {
      titulo: "Asesoramiento",
      texto: "Acompañamiento para elegir el equipo adecuado.",
    },
  ];

  return (
    <header className="relative overflow-hidden bg-[#F4F2EC]">
      {/* Decoración de fondo */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-105 w-105 rounded-full bg-[#AAB7A6]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-105 w-105 rounded-full bg-[#C6AD98]/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* TEXTO */}
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#CBD3C8] bg-[#FCFBF8]/85 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#788873]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5E6D60]">
                Seguridad industrial
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#243128] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Protección para trabajar con{" "}
              <span className="text-[#788873]">confianza.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#687168] sm:text-lg">
              Equipamiento, indumentaria y elementos de protección personal
              pensados para acompañar el trabajo diario en entornos industriales
              y actividades de alta exigencia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#405A47] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#334A3A] hover:shadow-[0_12px_28px_rgba(64,90,71,0.16)]"
              >
                Explorar catálogo
                <span aria-hidden="true">→</span>
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-full border border-[#C7CEC4] bg-[#FCFBF8] px-7 py-3.5 text-sm font-medium text-[#4A584D] transition-colors hover:border-[#9EAA9A] hover:bg-white"
              >
                Solicitar asesoramiento
              </a>
            </div>

            {/* PUNTOS DE VALOR */}
            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {puntos.map((item) => (
                <div
                  key={item.titulo}
                  className="rounded-2xl border border-[#D9DED5] bg-[#FCFBF8]/75 p-4"
                >
                  <p className="text-sm font-semibold text-[#405A47]">
                    {item.titulo}
                  </p>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#7A837B]">
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO */}
          <div className="relative w-full">
            <div className="relative rounded-3xl border border-[#D7DDD4] bg-[#E8EBE5] p-2 shadow-[0_24px_70px_rgba(36,49,40,0.10)] sm:rounded-4xl sm:p-4">
              {/* En mobile usamos 4/3 para darle más altura al video */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#243128] sm:aspect-video sm:rounded-3xl">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Video de Epulén Seguridad Industrial"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.playbackRate = 0.55;
                  }}
                >
                  <source src={VideoEpulen} type="video/mp4" />
                  Tu navegador no soporta reproducción de video.
                </video>

                {/* Overlay suave */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#243128]/35 via-transparent to-transparent" />

                {/* Badge inferior */}
                <div className="absolute bottom-2 left-2 right-2 rounded-xl border border-white/30 bg-[#F8F6F0]/90 px-3 py-2 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:rounded-2xl sm:p-4">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold leading-tight text-[#2F3D33] sm:text-sm">
                        Epulén Seguridad Industrial
                      </p>

                      <p className="mt-0.5 text-[9px] leading-tight text-[#6E796F] sm:mt-1 sm:text-xs">
                        Equipamiento y protección para el trabajo.
                      </p>
                    </div>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#405A47] text-white sm:h-10 sm:w-10">
                      <svg
                        className="h-3.5 w-3.5 sm:h-5 sm:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M9 12.75 11.25 15 15 9.75M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles geométricos */}
            <div className="absolute -bottom-5 -left-5 -z-10 h-28 w-28 rounded-bl-4xl border-b border-l border-[#AEB9AA]" />

            <div className="absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-tr-4xl border-r border-t border-[#C2AA98]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;