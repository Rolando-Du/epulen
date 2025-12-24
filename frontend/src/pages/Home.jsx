import React, { useEffect, useState } from "react";
import Hero from "../layouts/Hero";
import ProductCard from "../components/ProductCard";
import ContactForm from "../components/ContactForm";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  const categorias = [
    "Todos",
    "Ropa",
    "Calzado",
    "Guantes",
    "Alturas",
    "Protección",
    "Señalización",
    "Extinción",
    "Herramientas",
    "Otros",
  ];

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:5000/api/productos");
        const resultado = await respuesta.json();
        setProductos(resultado);
        setProductosFiltrados(resultado);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProductos();
  }, []);

  const filtrarPorCategoria = (cat) => {
    setCategoriaActiva(cat);
    if (cat === "Todos") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(
        (p) => p.categoria.toLowerCase() === cat.toLowerCase()
      );
      setProductosFiltrados(filtrados);
    }
    // Opcional: Desplazar suavemente hacia arriba del catálogo al filtrar
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Hero />

      <main id="catalogo" className="max-w-7xl mx-auto py-20 px-6">
        {/* BARRA DE FILTROS - ACTUALIZADA A GRID Y STICKY */}
        <div className="mb-10  top-0 z-40 bg-[#020617]/80 backdrop-blur-md py-4">
          <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6 opacity-80">
            Filtrar por Especialidad Técnica
          </p>

          {/* Grid: 2 columnas en móvil, Flex en escritorio */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-3">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => filtrarPorCategoria(cat)}
                className={`w-full lg:w-auto px-4 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 border flex items-center justify-center text-center ${
                  categoriaActiva === cat
                    ? "bg-orange-600 border-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.3)] scale-105"
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:border-orange-500/50 hover:text-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTADO DINÁMICO */}
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Equipos: <span className="text-orange-600">{categoriaActiva}</span>
          </h2>
          <div className="h-px flex-1 bg-linear-to-r from-slate-800 to-transparent"></div>
        </div>

        {cargando ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 mb-4"></div>
            <p className="text-slate-500 font-black tracking-[0.3em] text-[10px] uppercase">
              Sincronizando con Servidor...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((prod) => (
                <div
                  key={prod._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <ProductCard
                    id={prod._id}
                    nombre={prod.nombre}
                    categoria={prod.categoria}
                    descripcion={prod.descripcion}
                    precio={prod.precio}
                    imagen={`http://localhost:5000${prod.imagenUrl}`}
                    tallas={prod.tallas}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-900 rounded-[3rem]">
                <p className="text-slate-600 uppercase font-black tracking-widest text-xs">
                  Sin stock disponible en esta categoría
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN DE CONTACTO */}
        <div className="mt-48 relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-slate-900 font-black text-8xl opacity-20 select-none tracking-tighter hidden md:block">
            CONTACTO
          </div>
          <ContactForm />
        </div>
      </main>
    </div>
  );
};

export default Home;
