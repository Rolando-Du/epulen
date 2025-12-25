import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const categorias = useMemo(
    () => [
      "Todos",
      "Indumentaria",
      "Calzado",
      "Guantes",
      "Alturas",
      "Protección",
      "Señalización",
      "Extinción",
      "Herramientas",
    ],
    []
  );

  // 1) Obtener productos
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        if (!API_URL) throw new Error("Falta VITE_API_URL");
        const respuesta = await fetch(`${API_URL}/api/productos`);
        if (!respuesta.ok) throw new Error("Error al obtener productos");
        const resultado = await respuesta.json();

        const arr = Array.isArray(resultado) ? resultado : [];

        // Ordenar por fecha (fallbacks por si cambia el nombre del campo)
        const ordenados = [...arr].sort((a, b) => {
          const da = new Date(
            a.creadoEn || a.createdAt || a.updatedAt || 0
          ).getTime();
          const db = new Date(
            b.creadoEn || b.createdAt || b.updatedAt || 0
          ).getTime();
          return db - da;
        });

        setProductos(ordenados);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [API_URL]);

  // 2) Filtrado (derivado, sin estado extra)
  const productosFiltrados = useMemo(() => {
    let temporal = [...productos];

    // Categoría
    if (categoriaActiva !== "Todos") {
      const cat = categoriaActiva.toLowerCase();
      temporal = temporal.filter(
        (p) => (p.categoria || "").toLowerCase() === cat
      );
    }

    // Búsqueda
    const q = busqueda.trim().toLowerCase();
    if (q) {
      temporal = temporal.filter((p) => {
        const nombre = (p.nombre || "").toLowerCase();
        const descripcion = (p.descripcion || "").toLowerCase();
        return nombre.includes(q) || descripcion.includes(q);
      });
    }

    return temporal;
  }, [productos, categoriaActiva, busqueda]);

  const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className={`${container} pt-24 sm:pt-28 pb-16`}>
        {/* HEADER */}
        <header className="mb-10">
          <p className="text-[#24A35A] font-black text-[10px] uppercase tracking-[0.4em] mb-2">
            Inventario Total
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight italic">
            Catálogo <span className="text-[#E67E22]">Completo</span>
          </h1>
        </header>

        {/* CONTROLES */}
        <div className="sticky top-16 sm:top-20 z-30 bg-[#020617]/90 backdrop-blur-md py-4 sm:py-6 border-b border-slate-900 mb-10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-stretch lg:items-center">
            {/* Buscador */}
            <div className="relative w-full lg:w-105">
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 px-5 pr-12 focus:outline-none focus:border-[#24A35A] focus:ring-2 focus:ring-[#24A35A]/15 transition-all font-bold text-sm text-white placeholder:text-slate-600"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                🔍
              </span>
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={[
                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap border",
                    categoriaActiva === cat
                      ? "bg-[#24A35A] border-[#24A35A] text-white shadow-lg shadow-[#24A35A]/10"
                      : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700",
                  ].join(" ")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTADO */}
        {cargando ? (
          <div className="text-center py-28 sm:py-40 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#24A35A]/20 border-t-[#24A35A] rounded-full animate-spin" />
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
              Sincronizando Almacén...
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                {productosFiltrados.length} Equipos encontrados
              </p>

              {(!API_URL || API_URL === "") && (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-300/80">
                  Falta VITE_API_URL
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {productosFiltrados.map((prod) => (
                <ProductCard
                  key={prod._id}
                  id={prod._id}
                  nombre={prod.nombre}
                  categoria={prod.categoria}
                  precio={prod.precio}
                  // ProductCard arma URL final con VITE_API_URL si no es http
                  imagen={prod.imagenUrl || (prod.imagenes && prod.imagenes[0])}
                  tallas={prod.tallas}
                  descripcion={prod.descripcion}
                />
              ))}
            </div>

            {/* Empty State */}
            {productosFiltrados.length === 0 && (
              <div className="text-center py-16 sm:py-20 border border-dashed border-slate-800 rounded-3xl sm:rounded-[40px] mt-10">
                <p className="text-slate-600 font-black uppercase tracking-widest text-[11px]">
                  No hay coincidencias para "{busqueda}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Productos;
