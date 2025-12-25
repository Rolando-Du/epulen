import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  // URL dinámica de la API
  const API_URL = import.meta.env.VITE_API_URL;

  const categorias = [
    "Todos",
    "Indumentaria",
    "Calzado",
    "Guantes",
    "Alturas",
    "Protección",
    "Señalización",
    "Extinción",
    "Herramientas",
  ];

  // 1. OBTENER PRODUCTOS
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // CORRECCIÓN: Uso de API_URL
        const respuesta = await fetch(`${API_URL}/api/productos`);
        const resultado = await respuesta.json();

        // Ordenar por fecha (más recientes primero)
        const ordenados = resultado.sort(
          (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)
        );

        setProductos(ordenados);
        setProductosFiltrados(ordenados);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, [API_URL]);

  // 2. LÓGICA DE FILTRADO
  useEffect(() => {
    let temporal = productos;

    // Filtro por Categoría
    if (categoriaActiva !== "Todos") {
      temporal = temporal.filter(
        (p) => p.categoria?.toLowerCase() === categoriaActiva.toLowerCase()
      );
    }

    // Filtro por Búsqueda
    if (busqueda.trim() !== "") {
      const query = busqueda.toLowerCase();
      temporal = temporal.filter((p) => {
        const nombre = p.nombre ? p.nombre.toLowerCase() : "";
        const descripcion = p.descripcion ? p.descripcion.toLowerCase() : "";
        return nombre.includes(query) || descripcion.includes(query);
      });
    }

    setProductosFiltrados(temporal);
  }, [busqueda, categoriaActiva, productos]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <header className="mb-12">
          <p className="text-[#24A35A] font-black text-[10px] uppercase tracking-[0.4em] mb-2">
            Inventario Total
          </p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
            Catálogo <span className="text-[#E67E22]">Completo</span>
          </h1>
        </header>

        {/* CONTROLES */}
        <div className="sticky top-24 z-30 bg-[#020617]/90 backdrop-blur-md py-6 border-b border-slate-900 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            {/* Buscador */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Buscar por nombre de equipo..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#24A35A] transition-all font-bold text-sm text-white"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2">
                🔍
              </span>
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    categoriaActiva === cat
                      ? "bg-[#24A35A] border-[#24A35A] text-white shadow-lg"
                      : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTADO */}
        {cargando ? (
          <div className="text-center py-40 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#24A35A]/20 border-t-[#24A35A] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
              Sincronizando Almacén...
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
              {productosFiltrados.length} Equipos encontrados
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosFiltrados.map((prod) => (
                <ProductCard
                  key={prod._id}
                  id={prod._id}
                  nombre={prod.nombre}
                  categoria={prod.categoria}
                  precio={prod.precio}
                  // CORRECCIÓN: Pasamos solo la ruta relativa, ProductCard añade el API_URL
                  imagen={prod.imagenUrl || (prod.imagenes && prod.imagenes[0])}
                  tallas={prod.tallas}
                />
              ))}
            </div>

            {/* Empty State */}
            {productosFiltrados.length === 0 && (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-[40px]">
                <p className="text-slate-600 font-black uppercase tracking-widest text-xs">
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
