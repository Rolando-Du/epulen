import React from "react";
import LogoEpulen from "../assets/epulen.png";
import { MapPin, Navigation, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#35463A] bg-[#243128] text-[#D9E0D8]">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {/* MARCA */}
          <div>
            <div className="inline-flex rounded-2xl bg-[#F7F4ED] px-4 py-3">
              <img
                src={LogoEpulen}
                alt="Epulén Seguridad Industrial"
                className="h-9 w-auto sm:h-10"
                loading="lazy"
              />
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#B9C3B8]">
              Soluciones en seguridad e higiene industrial, equipamiento y
              elementos de protección personal para acompañar entornos de
              trabajo más seguros.
            </p>
          </div>

          {/* ÁREAS */}
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#9FB09F]">
              Áreas de trabajo
            </p>

            <ul className="space-y-3 text-sm text-[#CBD3CA]">
              <li>Elementos de Protección Personal (EPP)</li>
              <li>Ingeniería y Gestión Ambiental</li>
              <li>Capacitaciones Técnicas</li>
              <li>Consultoría en Higiene y Seguridad</li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div id="contacto">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[#9FB09F]">
              Contacto
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#AAB7A6]" />

                <p className="leading-relaxed text-[#CBD3CA]">
                  Q8371 Junín de los Andes
                  <br />
                  Neuquén, Argentina
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Jun%C3%ADn+de+los+Andes+Neuqu%C3%A9n"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#CBD3CA] transition-colors hover:text-white"
              >
                <Navigation className="h-4 w-4 shrink-0 text-[#AAB7A6]" />
                <span>Ver ubicación</span>
              </a>

              <a
                href="tel:+542944682812"
                className="flex items-center gap-3 text-[#CBD3CA] transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#AAB7A6]" />
                <span>+54 294 468-2812</span>
              </a>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#526655] bg-[#2C3B31] px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-[#AAB7A6]" />
              <span className="text-xs font-medium text-[#C8D1C7]">
                Atención personalizada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className="border-t border-[#35463A]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-center sm:flex-row sm:px-8 lg:px-12">
          <p className="text-[11px] text-[#8FA08F]">
            © {year} Epulén Seguridad Industrial. Todos los derechos reservados.
          </p>

          <p className="text-[11px] text-[#7F917F]">
            Diseño y desarrollo · Rolando Duarte
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;