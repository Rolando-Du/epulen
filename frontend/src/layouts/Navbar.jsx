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
        {/* LOGO E IDENTIDAD */}
        <Link to="/" className="flex items-center group gap-4">
          <div className="relative flex items-center py-1">
            <div className="absolute -inset-3 bg-[#24A35A] rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition duration-700"></div>
            <div className="relative transform transition-transform duration-500 group-hover:-translate-y-0.5">
              <img
                src={LogoEpulen}
                alt="Epulen Seguridad Industrial"
                className="w-28 h-14 md:w-36 md:h-18 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="h-8 w-px bg-linear-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>

          <div className="flex flex-col">
            <span className="text-[#24A35A] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] leading-none mb-1">
              Seguridad e Higiene
            </span>
            <span className="text-slate-400 text-[9px] md:text-[11px] font-light uppercase tracking-[0.15em] group-hover:text-slate-200 transition-colors duration-500">
              Industrial
            </span>
          </div>
        </Link>

        {/* MENÚ DE NAVEGACIÓN */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              location.pathname === "/"
                ? "text-[#24A35A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              location.pathname === "/productos"
                ? "text-[#24A35A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Productos
          </Link>

          {/* ÁREA PRIVADA ADMIN */}
          {isAuthenticated && (
            <div className="flex items-center gap-6 pl-6 border-l border-slate-800">
              <Link
                to="/admin"
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  location.pathname === "/admin"
                    ? "text-[#24A35A]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Panel
              </Link>

              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all border border-red-500/20"
              >
                <span className="text-red-500 group-hover:text-white text-[9px] font-black uppercase">
                  Salir
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
