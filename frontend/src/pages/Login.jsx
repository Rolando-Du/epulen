import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password || isLoading) return;

    if (!API_URL) {
      alert("Falta configurar VITE_API_URL en tu .env / Vercel.");
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        localStorage.setItem("admin_auth", "true");
        navigate("/admin");
      } else {
        setError(true);
        setPassword("");
        setTimeout(() => setError(false), 2500);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert(
        "No se pudo conectar con el servidor. Verificá que el backend esté online."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Efectos de iluminación */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[60%] sm:w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[55%] sm:w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />

      {/* Card */}
      <div
        className={[
          "w-full max-w-md bg-slate-900/40 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border relative z-10 transition-all duration-300",
          error
            ? "border-red-500/50 shadow-[0_30px_80px_rgba(127,29,29,0.25)]"
            : "border-slate-800 shadow-2xl",
        ].join(" ")}
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div
            className={[
              "inline-flex p-4 rounded-3xl mb-6 border transition-colors",
              error
                ? "bg-red-500/10 border-red-500/20"
                : "bg-orange-600/10 border-orange-600/20",
            ].join(" ")}
          >
            {error ? (
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {error ? (
              <>
                Acceso <span className="text-red-500">Denegado</span>
              </>
            ) : (
              <>
                Acceso <span className="text-orange-500">Admin</span>
              </>
            )}
          </h2>

          <p className="text-slate-500 text-[10px] mt-3 uppercase tracking-[0.35em] font-black italic">
            SecurityPro Authentication
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Contraseña Maestra
              </label>
              {error && (
                <span className="text-red-500 text-[9px] font-black uppercase animate-bounce">
                  Error de Clave
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={[
                  "w-full p-4 pr-14 bg-slate-950/50 border-2 rounded-2xl text-white outline-none transition-all font-mono text-base sm:text-lg placeholder:text-slate-800",
                  error
                    ? "border-red-500/50 ring-4 ring-red-500/10"
                    : "border-slate-800 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15",
                ].join(" ")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-orange-500 transition-colors p-1"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
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
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L5.122 5.122m7.878 7.878l4.242 4.242M21 12a9.505 9.505 0 01-2.123 5.676m-5.003-12.723a9.99 9.99 0 013.123 2.047M18.825 5.175l-4.243 4.243"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={[
              "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 active:scale-[0.98]",
              isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : error
                ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/40 hover:-translate-y-0.5",
            ].join(" ")}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verificando...
              </>
            ) : error ? (
              "Reintentar"
            ) : (
              "Desbloquear Sistema"
            )}
          </button>

          {!API_URL && (
            <p className="text-[11px] text-red-300/80 text-center">
              Falta <span className="text-red-200 font-bold">VITE_API_URL</span>{" "}
              en tu .env / Vercel.
            </p>
          )}
        </form>

        <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-300 text-[9px] font-medium uppercase tracking-widest">
            Protocolo de Encriptación AES-256 Activado
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
