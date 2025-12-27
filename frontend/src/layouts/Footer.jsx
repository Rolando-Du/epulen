import React from "react";
import LogoEpulen from "../assets/epulen.png";
import { MapPin, Phone, Navigation } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#010409] text-slate-400 border-t border-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Branding */}
          <div>
            <img
              src={LogoEpulen}
              alt="Epulen Seguridad Industrial"
              className="h-10 sm:h-12 w-auto mb-5 opacity-95"
              loading="lazy"
            />
            <p className="text-sm leading-relaxed text-slate-400 max-w-prose">
              Somos especialistas en seguridad e higiene industrial, ofreciendo
              soluciones técnicas y preventivas que garantizan entornos de
              trabajo seguros, cumplimiento normativo y protección del capital
              humano.
            </p>
          </div>

          {/* Áreas de Trabajo */}
          <div className="md:pl-6">
            <h4 className="text-white text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 sm:mb-6">
              Áreas de Trabajo
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-400 max-w-sm">
              <li className="leading-relaxed">
                Elementos de Protección Personal (EPP)
              </li>
              <li className="leading-relaxed">
                Ingeniería y Gestión Ambiental
              </li>
              <li className="leading-relaxed">Capacitaciones Técnicas</li>
              <li className="leading-relaxed">
                Consultoría en Higiene y Seguridad
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="md:pl-6">
            <h4 className="text-white text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 sm:mb-6">
              Contacto
            </h4>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#24A35A]" />
                <p className="leading-relaxed">
                  Q8371 Junín de los Andes
                  <br />
                  Neuquén, Argentina
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Junín+de+los+Andes+Neuquén"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#24A35A] transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#24A35A]" />
                <span>Cómo llegar</span>
              </a>

              <a
                href="tel:+542944682812"
                className="flex items-center gap-3 font-medium hover:text-[#24A35A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#24A35A]" />
                <span>+54 294 468-2812</span>
              </a>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 border border-[#24A35A]/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#24A35A] animate-pulse" />
              <span className="text-[#24A35A] text-[11px] font-semibold tracking-wide">
                DISPONIBILIDAD 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className="border-t border-slate-800/60">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-2 text-center">
            <p className="text-[11px] uppercase tracking-widest text-slate-500">
              © 2025 Epulen Seguridad · Ingeniería en Protección
            </p>
            <p className="text-[10px] text-slate-500">
              Diseño y desarrollo · Rolando Duarte
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
