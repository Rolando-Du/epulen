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

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const emailjsReady = useMemo(() => {
    return Boolean(
      EMAILJS_SERVICE_ID &&
        EMAILJS_TEMPLATE_ID &&
        EMAILJS_PUBLIC_KEY
    );
  }, [
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
  ]);

  const swalBase = {
    background: "#FCFBF8",
    color: "#243128",
    confirmButtonColor: "#405A47",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailjsReady) {
      await Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Configuración incompleta",
        text: "Las credenciales de EmailJS no están configuradas correctamente.",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      );

      await Swal.fire({
        ...swalBase,
        icon: "success",
        title: "Solicitud enviada",
        text: "Recibimos tu consulta. Nos pondremos en contacto a la brevedad.",
        timer: 3200,
        showConfirmButton: false,
      });

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
      });

      form.current?.reset();
    } catch (error) {
      console.error("Error enviando formulario:", error);

      await Swal.fire({
        ...swalBase,
        icon: "error",
        title: "No se pudo enviar",
        text: "Intentá nuevamente en unos minutos o contactanos por WhatsApp.",
        confirmButtonColor: "#9A5D51",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl bg-[#F8F7F3] border border-[#D7DDD4] text-[#243128] outline-none " +
    "px-4 py-3.5 text-sm placeholder:text-[#A0A7A0] transition-all " +
    "focus:border-[#788873] focus:ring-4 focus:ring-[#788873]/10 disabled:opacity-60";

  const labelBase =
    "block text-sm font-medium text-[#526054] mb-2";

  return (
    <section
      id="contacto"
      className="relative overflow-hidden rounded-4xl border border-[#D8DDD4] bg-[#FCFBF8] px-5 py-10 shadow-[0_22px_65px_rgba(36,49,40,0.06)] sm:px-8 lg:px-10 lg:py-12"
    >
      {/* Decoración muy sutil */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#AAB7A6]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#C6AD98]/15 blur-[90px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* ENCABEZADO */}
        <div className="mb-9 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#788873]">
            Contacto
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#243128] sm:text-4xl">
            Contanos qué necesitás.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#6D776F] sm:text-base">
            Enviá tu consulta y te ayudamos a encontrar el equipamiento o la
            solución de seguridad más adecuada para tu actividad.
          </p>
        </div>

        <form
          ref={form}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* NOMBRE */}
          <div>
            <label htmlFor="nombre" className={labelBase}>
              Nombre y apellido
            </label>

            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Ej. Juan Pérez"
              className={inputBase}
              onChange={handleChange}
              value={formData.nombre}
              disabled={isLoading}
              autoComplete="name"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className={labelBase}>
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="nombre@empresa.com"
              className={inputBase}
              onChange={handleChange}
              value={formData.email}
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          {/* TELÉFONO */}
          <div className="md:col-span-2">
            <label htmlFor="telefono" className={labelBase}>
              Teléfono
            </label>

            <input
              id="telefono"
              type="tel"
              name="telefono"
              placeholder="WhatsApp o teléfono con código de área"
              className={inputBase}
              onChange={handleChange}
              value={formData.telefono}
              disabled={isLoading}
              autoComplete="tel"
              required
            />
          </div>

          {/* MENSAJE */}
          <div className="md:col-span-2">
            <label htmlFor="mensaje" className={labelBase}>
              Consulta
            </label>

            <textarea
              id="mensaje"
              name="mensaje"
              placeholder="Contanos qué productos, cantidades o servicio necesitás..."
              className={`${inputBase} min-h-36 resize-y`}
              onChange={handleChange}
              value={formData.mensaje}
              disabled={isLoading}
              required
            />
          </div>

          {/* FOOTER FORM */}
          <div className="md:col-span-2 flex flex-col gap-4 border-t border-[#E0E4DD] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-[#8A938B]">
              Usaremos estos datos únicamente para responder tu consulta.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#405A47] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#334A3A] hover:shadow-[0_12px_28px_rgba(64,90,71,0.16)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar consulta
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {!emailjsReady && (
          <p className="mt-5 rounded-xl border border-[#E9D5D0] bg-[#F9EFEC] px-4 py-3 text-xs text-[#965C52]">
            EmailJS no está configurado en este entorno.
          </p>
        )}
      </div>
    </section>
  );
};

export default ContactForm;