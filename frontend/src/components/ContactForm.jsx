import React, { useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const form = useRef(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  // ✅ EmailJS desde variables de entorno (Vercel friendly)
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
      setStatus({
        type: "error",
        msg: "❌ Falta configurar EmailJS (VITE_EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY) en el .env o en Vercel.",
      });
      return;
    }

    setStatus({ type: "loading", msg: "Enviando solicitud..." });

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus({
            type: "success",
            msg: "✅ ¡Mensaje enviado! Te contactaremos pronto.",
          });
          setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
        },
        (error) => {
          console.log(error);
          setStatus({
            type: "error",
            msg: "❌ Hubo un error. Intenta de nuevo más tarde.",
          });
        }
      );
  };

  const inputBase =
    "w-full rounded-2xl bg-slate-900/40 border border-slate-800 text-white outline-none " +
    "px-4 py-3.5 text-sm placeholder:text-slate-500 transition-colors " +
    "focus:border-[#24A35A] focus:ring-2 focus:ring-[#24A35A]/20";

  return (
    <section className="relative overflow-hidden rounded-4xl border border-slate-800/60 bg-[#020617] px-4 sm:px-6 lg:px-10 py-10 sm:py-12 my-10 sm:my-14 shadow-2xl">
      {/* Decoración */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#24A35A]/6 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#E67E22]/6 blur-[90px] pointer-events-none" />

      <div className="mx-auto w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[#24A35A] font-black text-[10px] uppercase tracking-[0.35em] mb-2">
            Contacto técnico
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
            Solicitar <span className="text-[#24A35A]">Cotización</span>
          </h2>

          <div className="h-1 w-16 sm:w-20 bg-[#E67E22] mx-auto mt-4 rounded-full" />

          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Déjanos tus datos y un asesor técnico se pondrá en contacto.
          </p>
        </div>

        {/* Form */}
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className={inputBase}
              onChange={handleChange}
              value={formData.nombre}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className={inputBase}
              onChange={handleChange}
              value={formData.email}
              required
              autoComplete="email"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              name="telefono"
              placeholder="Ej: +54 9 294 ..."
              className={inputBase}
              onChange={handleChange}
              value={formData.telefono}
              autoComplete="tel"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              placeholder="¿Qué productos necesitas cotizar? (Ej: 20 cascos, 10 pares de botas...)"
              className={`${inputBase} min-h-35 resize-none`}
              onChange={handleChange}
              value={formData.mensaje}
              required
            />
          </div>

          <div className="md:col-span-2 flex flex-col items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status.type === "loading"}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#24A35A] hover:bg-[#E67E22] text-white font-black px-7 sm:px-10 py-4 transition-all shadow-xl shadow-[#24A35A]/15 uppercase tracking-[0.2em] text-[11px] active:scale-[0.99] disabled:opacity-50"
            >
              {status.type === "loading"
                ? "Procesando..."
                : "Enviar Requerimiento Técnico"}
            </button>

            {status.msg && (
              <div
                className={[
                  "px-4 py-3 rounded-2xl border text-sm text-center w-full sm:w-auto",
                  status.type === "success"
                    ? "border-green-500/25 bg-green-500/10 text-green-300"
                    : status.type === "loading"
                    ? "border-slate-700 bg-slate-900/40 text-slate-300"
                    : "border-red-500/25 bg-red-500/10 text-red-300",
                ].join(" ")}
              >
                {status.msg}
              </div>
            )}

            {!emailjsReady && (
              <p className="text-[11px] text-slate-500 text-center max-w-2xl">
                Tip: configurá estas variables en tu{" "}
                <span className="text-slate-300">.env</span> y en Vercel:{" "}
                <span className="text-slate-300">VITE_EMAILJS_SERVICE_ID</span>,{" "}
                <span className="text-slate-300">VITE_EMAILJS_TEMPLATE_ID</span>
                ,{" "}
                <span className="text-slate-300">VITE_EMAILJS_PUBLIC_KEY</span>.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
