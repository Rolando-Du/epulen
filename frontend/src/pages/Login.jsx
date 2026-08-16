import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "";

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password || isLoading) return;

    if (!API_URL) {
      alert(
        "Falta configurar VITE_API_URL en tu .env / Vercel."
      );
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (
        response.ok &&
        data?.success
      ) {
        // ==============================
        // LIMPIAR LOGIN ANTIGUO
        // ==============================

        localStorage.removeItem(
          "admin_auth"
        );

        // ==============================
        // SESIÓN ACTUAL
        // ==============================

        /*
        sessionStorage mantiene la sesión
        mientras la pestaña esté abierta.

        Al cerrar la pestaña, la sesión
        desaparece automáticamente.
        */
        sessionStorage.setItem(
          "admin_auth",
          "true"
        );

        navigate("/admin");
      } else {
        setError(true);
        setPassword("");

        setTimeout(() => {
          setError(false);
        }, 2500);
      }
    } catch (err) {
      console.error(
        "Error de conexión:",
        err
      );

      alert(
        "No se pudo conectar con el servidor. Verificá que el backend esté online."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF0E9] flex items-center justify-center px-5 relative overflow-hidden">
      {/* Decoración */}

      <div className="pointer-events-none absolute -top-40 -left-40 w-125 h-125 bg-[#9EAC98]/20 blur-[130px] rounded-full" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 w-125 h-125 bg-[#C6AD98]/20 blur-[130px] rounded-full" />

      <div
        className={[
          "relative z-10 w-full max-w-md",
          "bg-[#FCFBF8]/95 backdrop-blur-xl",
          "rounded-[28px]",
          "border",
          "p-7 sm:p-10",
          "transition-all duration-300",

          error
            ? "border-[#C98E82] shadow-[0_24px_70px_rgba(100,50,40,0.10)]"
            : "border-[#D9DED5] shadow-[0_24px_70px_rgba(36,49,40,0.10)]",
        ].join(" ")}
      >
        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <div className="mb-9">
          <div
            className={[
              "w-12 h-12",
              "flex items-center justify-center",
              "rounded-2xl",
              "mb-6",

              error
                ? "bg-[#F5E5E1]"
                : "bg-[#E4E9E1]",
            ].join(" ")}
          >
            {error ? (
              <svg
                className="w-6 h-6 text-[#A15D50]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-[#405A47]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>

          <p className="text-[#788873] text-xs uppercase tracking-[0.2em] font-medium mb-2">
            Panel de administración
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-[#243128]">
            {error
              ? "Acceso denegado"
              : "Bienvenido"}
          </h2>

          <p className="text-[#758077] text-sm mt-3 leading-relaxed">
            {error
              ? "La contraseña ingresada no es correcta. Intentá nuevamente."
              : "Ingresá tu contraseña para acceder a la gestión del catálogo."}
          </p>
        </div>

        {/* ============================== */}
        {/* FORMULARIO */}
        {/* ============================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#455147]">
                Contraseña
              </label>

              {error && (
                <span className="text-[#A15D50] text-xs font-medium">
                  Contraseña incorrecta
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                disabled={isLoading}
                autoComplete="current-password"
                className={[
                  "w-full",
                  "px-4 py-3.5 pr-12",
                  "bg-[#F7F6F2]",
                  "border",
                  "rounded-xl",
                  "text-[#243128]",
                  "placeholder:text-[#A6ADA5]",
                  "outline-none",
                  "transition-all duration-200",

                  error
                    ? "border-[#C98E82] focus:ring-4 focus:ring-[#C98E82]/10"
                    : "border-[#D6DCD2] focus:border-[#788873] focus:ring-4 focus:ring-[#788873]/10",
                ].join(" ")}
              />

              {/* ============================== */}
              {/* MOSTRAR / OCULTAR PASSWORD */}
              {/* ============================== */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (v) => !v
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B948C] hover:text-[#405A47] transition-colors"
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A9.8 9.8 0 0112 4c5 0 9 4 10 8a11.5 11.5 0 01-2.1 4.1M6.5 6.5A11.6 11.6 0 002 12c1 4 5 8 10 8a9.7 9.7 0 004.3-1"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ============================== */}
          {/* BOTÓN LOGIN */}
          {/* ============================== */}

          <button
            type="submit"
            disabled={isLoading}
            className={[
              "w-full py-3.5",
              "rounded-xl",
              "text-sm font-medium",
              "transition-all duration-300",
              "flex items-center justify-center gap-3",

              isLoading
                ? "bg-[#C8CEC5] text-[#7B847C] cursor-not-allowed"
                : error
                  ? "bg-[#9A5D51] hover:bg-[#874E44] text-white"
                  : "bg-[#405A47] hover:bg-[#334A3A] text-white hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(64,90,71,0.16)]",
            ].join(" ")}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>

                Verificando...
              </>
            ) : error ? (
              "Intentar nuevamente"
            ) : (
              "Ingresar"
            )}
          </button>

          {!API_URL && (
            <p className="text-xs text-[#A15D50] text-center">
              Falta configurar
              VITE_API_URL.
            </p>
          )}
        </form>

        {/* ============================== */}
        {/* FOOTER */}
        {/* ============================== */}

        <div className="mt-8 pt-6 border-t border-[#E1E4DE]">
          <p className="text-[#8B948C] text-xs text-center">
            Acceso restringido · Panel
            administrativo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;