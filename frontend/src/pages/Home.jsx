import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../layouts/Hero";
import ProductCard from "../components/ProductCard";
import ContactForm from "../components/ContactForm";

const Home = () => {
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  // Variable de entorno para la API
  const API_URL = import.meta.env.VITE_API_URL;

  const visibleCount = 6;

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

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // CORRECCIÓN: Uso de API_URL
        const respuesta = await fetch(`${API_URL}/api/productos`);
        const resultado = await respuesta.json();

        const destacados = resultado.filter((p) => {
          return (
            p.destacado === true || p.destacado === "true" || p.destacado === 1
          );
        });

        setProductosDestacados(destacados);
        setProductosFiltrados(destacados);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, [API_URL]);

  const filtrarPorCategoria = (cat) => {
    setCategoriaActiva(cat);
    if (cat === "Todos") {
      setProductosFiltrados(productosDestacados);
    } else {
      const filtrados = productosDestacados.filter(
        (p) => p.categoria?.toLowerCase() === cat.toLowerCase()
      );
      setProductosFiltrados(filtrados);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Hero />

      {/* SECCIÓN CATEGORÍAS */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#24A35A] font-black text-[10px] uppercase tracking-[0.4em] mb-2">
              Especialidades
            </p>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              Productos <span className="text-[#E67E22]">Destacados</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categorias
            .filter((c) => c !== "Todos")
            .map((cat) => (
              <button
                key={cat}
                onClick={() => filtrarPorCategoria(cat)}
                className={`group relative p-6 rounded-[19px] border transition-all duration-500 overflow-hidden ${
                  categoriaActiva === cat
                    ? "bg-[#24A35A] border-[#24A35A] shadow-xl shadow-[#24A35A]/20"
                    : "bg-slate-900/50 border-slate-800 hover:border-[#24A35A]/50"
                }`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-widest relative z-10 ${
                    categoriaActiva === cat
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {cat}
                </span>
                <div className="absolute -bottom-2 -right-2 text-white/5 font-black text-4xl italic group-hover:scale-110 transition-transform">
                  {cat.substring(0, 3)}
                </div>
              </button>
            ))}
        </div>
      </section>

      {/* SECCIÓN CATÁLOGO */}
      <main
        id="catalogo"
        className="max-w-7xl mx-auto py-10 pb-20 px-6 border-t border-slate-900"
      >
        {cargando ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-[#24A35A] border-r-2 mb-4"></div>
            <p className="text-slate-500 font-black tracking-[0.3em] text-[10px] uppercase">
              Sincronizando...
            </p>
          </div>
        ) : (
          <div className="pt-10">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">
                  No hay productos destacados en "{categoriaActiva}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {productosFiltrados.slice(0, visibleCount).map((prod) => (
                  <ProductCard
                    key={prod._id}
                    id={prod._id}
                    nombre={prod.nombre}
                    categoria={prod.categoria}
                    precio={prod.precio}
                    // CORRECCIÓN: Pasamos solo la ruta, ProductCard se encarga del resto
                    imagen={
                      prod.imagenUrl || (prod.imagenes && prod.imagenes[0])
                    }
                    tallas={prod.tallas}
                  />
                ))}
              </div>
            )}

            <div className="mt-24 text-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900"></div>
              </div>
              <button
                onClick={() => navigate("/productos")}
                className="relative z-10 px-10 py-4 bg-[#020617] border border-[#24A35A] hover:bg-[#24A35A] rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all active:scale-95 shadow-lg shadow-[#24A35A]/10"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          </div>
        )}

        <div className="mt-48 relative">
          <ContactForm />
        </div>
      </main>
    </div>
  );
};

export default Home;
