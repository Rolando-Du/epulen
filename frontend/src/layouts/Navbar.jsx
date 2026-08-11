import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

    if (isAuthenticated) {
      base.push({ to: "/admin", label: "Panel" });
    }

    return base;
  }, [isAuthenticated]);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#D7DDD4] bg-[#F4F2EC]/92 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-18 items-center justify-between sm:h-20">
          {/* LOGO / MARCA */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 items-center rounded-xl bg-[#FCFBF8] px-2.5 ring-1 ring-[#D8DDD4] transition-all duration-300 group-hover:ring-[#A9B4A6]">
              <img
                src={LogoEpulen}
                alt="Epulén Seguridad Industrial"
                className="h-8 w-auto object-contain sm:h-9"
              />
            </div>

            <div className="hidden sm:flex sm:flex-col">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-[#405A47]">
                Epulén
              </span>

              <span className="mt-0.5 text-[10px] tracking-[0.08em] text-[#7C857D]">
                Seguridad Industrial
              </span>
            </div>
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-[#D8DDD4] bg-[#FCFBF8]/80 p-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive(link.to)
                      ? "bg-[#E5EAE2] text-[#405A47]"
                      : "text-[#687168] hover:bg-[#F0F2ED] hover:text-[#243128]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center gap-2 rounded-full border border-[#E4D0CB] bg-[#F8EFEC] px-4 py-2.5 text-sm font-medium text-[#9A5D51] transition-colors hover:bg-[#F1E2DE] hover:text-[#7F493F]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M15 12H3m0 0 4-4m-4 4 4 4m5-13h5a2 2 0 012 2v14a2 2 0 01-2 2h-5"
                  />
                </svg>

                Salir
              </button>
            )}
          </div>

          {/* BOTÓN MOBILE */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6DCD3] bg-[#FCFBF8] text-[#405A47] transition-colors hover:bg-[#EEF1EA] md:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 6l12 12M18 6 6 18"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* MENÚ MOBILE */}
        {mobileOpen && (
          <div className="pb-4 md:hidden">
            <div className="rounded-2xl border border-[#D8DDD4] bg-[#FCFBF8] p-2 shadow-[0_18px_45px_rgba(36,49,40,0.08)]">
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(link.to)
                        ? "bg-[#E5EAE2] text-[#405A47]"
                        : "text-[#5F6A61] hover:bg-[#F1F3EE] hover:text-[#243128]",
                    ].join(" ")}
                  >
                    <span>{link.label}</span>

                    {isActive(link.to) && (
                      <span className="h-2 w-2 rounded-full bg-[#788873]" />
                    )}
                  </Link>
                ))}

                {isAuthenticated && (
                  <>
                    <div className="my-1 h-px bg-[#E1E5DE]" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#9A5D51] transition-colors hover:bg-[#F7ECE9]"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12H3m0 0 4-4m-4 4 4 4m5-13h5a2 2 0 012 2v14a2 2 0 01-2 2h-5"
                        />
                      </svg>

                      Cerrar sesión
                    </button>
                  </>
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