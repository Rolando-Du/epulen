// src/components/Navbar.jsx (o donde lo tengas)
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoEpulen from "../assets/epulen.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("admin_auth") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("admin_auth") === "true");
    };

    window.addEventListener("storage", checkAuth);
    checkAuth();

    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

  // ✅ En vez de useEffect para cerrar menú, lo cerramos al hacer click o logout
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setMobileOpen(false);
    navigate("/");
  };

  const links = useMemo(() => {
    const base = [
      { to: "/", label: "Inicio" },
      { to: "/productos", label: "Productos" },
    ];
    if (isAuthenticated) base.push({ to: "/admin", label: "Panel" });
    return base;
  }, [isAuthenticated]);

  const linkClass = (to) =>
    [
      "text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
      location.pathname === to
        ? "text-[#24A35A]"
        : "text-slate-400 hover:text-white",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 lg:h-20 flex items-center justify-between">
          {/* LOGO E IDENTIDAD */}
          <Link to="/" className="flex items-center group gap-3">
            <div className="relative flex items-center">
              <div className="absolute -inset-3 bg-[#24A35A] rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition duration-700" />
              <div className="relative transform transition-transform duration-500 group-hover:-translate-y-0.5">
                <img
                  src={LogoEpulen}
                  alt="Epulen Seguridad Industrial"
                  className="w-20 h-10 sm:w-24 sm:h-12 lg:w-28 lg:h-14 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-linear-to-b from-transparent via-slate-700 to-transparent hidden sm:block" />

            <div className="hidden sm:flex flex-col">
              <span className="text-[#24A35A] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.28em] leading-none mb-1">
                Seguridad e Higiene
              </span>
              <span className="text-slate-400 text-[9px] sm:text-[10px] font-light uppercase tracking-[0.15em] group-hover:text-slate-200 transition-colors duration-500">
                Industrial
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                {l.label}
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 px-3 py-2 rounded-xl transition-all border border-red-500/20"
              >
                <span className="text-red-500 group-hover:text-white text-[10px] font-black uppercase tracking-widest">
                  Salir
                </span>
              </button>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-slate-200"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md p-3">
              <div className="flex flex-col">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={closeMobileMenu}
                    className={[
                      "px-3 py-3 rounded-xl",
                      location.pathname === l.to
                        ? "bg-[#24A35A]/10 text-[#24A35A]"
                        : "text-slate-200 hover:bg-white/5",
                      "text-[11px] font-black uppercase tracking-[0.2em]",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                ))}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 px-3 py-3 rounded-xl text-left bg-red-500/10 hover:bg-red-500 transition-all border border-red-500/20"
                  >
                    <span className="text-red-500 hover:text-white text-[11px] font-black uppercase tracking-widest">
                      Salir
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
