import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoEpulen from "../assets/epulen.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("admin_auth") === "true"
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("admin_auth") === "true");
    };
    window.addEventListener("storage", checkAuth);
    checkAuth();
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#020617] border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* LOGO E IDENTIDAD - COLORES SINCRONIZADOS */}
        <Link to="/" className="flex items-center group gap-4">
          <div className="relative flex items-center py-1">
            {/* Resplandor de fondo mejorado */}
            <div className="absolute -inset-3 bg-[#24A35A] rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition duration-700"></div>

            {/* Logo con efecto de elevación */}
            <div className="relative transform transition-transform duration-500 group-hover:-translate-y-0.5">
              <img
                src={LogoEpulen}
                alt="Epulen Seguridad Industrial"
                className="w-28 h-14 md:w-36 md:h-18 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Divisor Vertical Decorativo */}
          <div className="h-8 w-px bg-linear-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>

          {/* Texto Institucional Estilizado */}
          <div className="flex flex-col">
            <span
              className="
      text-[#24A35A] 
      text-[10px] md:text-xs 
      font-black 
      uppercase 
      tracking-[0.3em] 
      leading-none 
      mb-1
    "
            >
              Seguridad e Higiene
            </span>
            <span
              className="
      text-slate-400 
      text-[9px] md:text-[11px] 
      font-light 
      uppercase 
      tracking-[0.15em] 
      group-hover:text-slate-200 
      transition-colors 
      duration-500
    "
            >
              Industrial
            </span>
          </div>
        </Link>

        {/* MENÚ DE NAVEGACIÓN */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
              location.pathname === "/"
                ? "text-[#24A35A]" /* Verde del logo para estado activo */
                : "text-slate-400 hover:text-white"
            }`}
          >
            Catálogo
          </Link>

          {/* ÁREA PRIVADA ADMIN */}
          {isAuthenticated && (
            <div className="flex items-center gap-8 pl-8 border-l border-slate-800">
              <Link
                to="/admin"
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                  location.pathname === "/admin"
                    ? "text-[#24A35A]" /* Verde del logo */
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Panel Control
              </Link>

              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 px-4 py-2 rounded-xl transition-all border border-red-500/20"
              >
                <span className="text-red-500 group-hover:text-white text-[10px] font-black uppercase tracking-tighter">
                  Salir
                </span>
                <svg
                  className="w-4 h-4 text-red-500 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
