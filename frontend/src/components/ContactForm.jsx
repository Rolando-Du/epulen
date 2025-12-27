import React, { useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const ContactForm = () => {
  const form = useRef(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Configuración de EmailJS
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const emailjsReady = useMemo(() => {
    return Boolean(
      EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
    );
  }, [EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailjsReady) {
      Swal.fire({
        icon: "error",
        title: "Error de Configuración",
        text: "Las credenciales de envío no están listas en el entorno.",
        background: "#020617",
        color: "#fff",
        confirmButtonColor: "#E67E22",
      });
      return;
    }

    setIsLoading(true);

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setIsLoading(false);
          Swal.fire({
            icon: "success",
            title: "¡Solicitud Enviada!",
            text: "Un asesor técnico se pondrá en contacto a la brevedad.",
            background: "#020617",
            color: "#fff",
            confirmButtonColor: "#22c55e",
            timer: 3500,
          });
          setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
        },
        (error) => {
          setIsLoading(false);
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error de Envío",
            text: "No se pudo procesar la solicitud. Reintente más tarde.",
            background: "#020617",
            color: "#fff",
            confirmButtonColor: "#ef4444",
          });
        }
      );
  };

  const inputBase =
    "w-full rounded-2xl bg-slate-900/50 border border-slate-800 text-white outline-none " +
    "px-4 py-3.5 text-sm placeholder:text-slate-600 transition-all " +
    "focus:border-[#E67E22] focus:ring-1 focus:ring-[#E67E22]/20";

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/60 bg-[#020617] px-6 lg:px-10 py-12 my-14 shadow-2xl">
      {/* Decoración Ambiental */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E67E22]/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#4ade80]/5 blur-[80px] pointer-events-none" />

      <div className="mx-auto w-full max-w-4xl relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
            SOLICITAR <span className="text-[#E67E22]">COTIZACIÓN</span>
          </h2>
          <div className="h-1 w-16 bg-[#E67E22] mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Suministros Técnicos Certificados para Minería y Petróleo.
          </p>
        </div>

        <form
          ref={form}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Campo: Nombre */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Nombre y Apellido
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              className={inputBase}
              onChange={handleChange}
              value={formData.nombre}
              required
            />
          </div>

          {/* Campo: Email */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Email Corporativo
            </label>
            <input
              type="email"
              name="email"
              placeholder="email@empresa.com"
              className={inputBase}
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* Campo: Teléfono */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              name="telefono"
              placeholder="WhatsApp o teléfono con código de área"
              className={inputBase}
              onChange={handleChange}
              value={formData.telefono}
              required
            />
          </div>

          {/* Campo: Mensaje */}
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              Requerimiento Técnico
            </label>
            <textarea
              name="mensaje"
              placeholder="Detalla los productos y cantidades que necesitas..."
              className={`${inputBase} min-h-32 resize-none`}
              onChange={handleChange}
              value={formData.mensaje}
              required
            />
          </div>

          {/* Botón con Efecto de Barrido y Borde Neón */}
          <div className="md:col-span-2 flex flex-col items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-950 px-12 py-4.5 font-black uppercase tracking-[0.2em] text-[11px] border-2 border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              {/* Texto con efecto de barrido */}
              <span className="relative z-10 text-white transition-colors duration-500 group-hover:text-transparent bg-clip-text bg-linear-to-r from-[#E67E22] from-50% to-white to-50% bg-size-[200%_100%] bg-position-[100%_0] group-hover:bg-position-[0%_0]">
                {isLoading ? "Procesando..." : "Enviar Solicitud"}
              </span>

              {/* Capa de brillo al hover */}
              <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
