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
        const respuesta = await fetch(`${API_URL}/api/productos`);
        const resultado = await respuesta.json();

        const destacados = resultado.filter(
          (p) =>
            p.destacado === true ||
            p.destacado === "true" ||
            p.destacado === 1
        );

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
      return;
    }

    const filtrados = productosDestacados.filter(
      (p) => p.categoria?.toLowerCase() === cat.toLowerCase()
    );

    setProductosFiltrados(filtrados);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#243128] overflow-x-hidden">
      <Hero />

      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="max-w-3xl mb-12">
          <p className="text-[#788873] font-semibold text-xs uppercase tracking-[0.22em] mb-3">
            Nuestro catálogo
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-[#243128]">
            Productos seleccionados para trabajar con{" "}
            <span className="text-[#9A6750]">seguridad</span>
          </h2>

          <p className="mt-5 max-w-2xl text-[#687168] leading-relaxed">
            Equipamiento e indumentaria pensados para acompañar el trabajo
            diario con protección, comodidad y confianza.
          </p>
        </div>

        {/* CATEGORÍAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categorias.map((cat) => {
            const activa = categoriaActiva === cat;

            return (
              <button
                key={cat}
                onClick={() => filtrarPorCategoria(cat)}
                className={[
                  "min-h-17.5 px-5 py-4 rounded-2xl border text-sm font-medium",
                  "transition-all duration-300",
                  activa
                    ? "bg-[#405A47] border-[#405A47] text-white shadow-[0_10px_30px_rgba(64,90,71,0.16)]"
                    : "bg-[#FCFBF8] border-[#D9DDD5] text-[#59645B] hover:border-[#AAB5A7] hover:bg-white hover:text-[#243128]",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* CATÁLOGO */}
      <main
        id="catalogo"
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-28"
      >
        <div className="border-t border-[#D8DDD4] pt-14">
          {cargando ? (
            <div className="text-center py-28">
              <div className="inline-block h-9 w-9 rounded-full border-[3px] border-[#CDD4C8] border-t-[#405A47] animate-spin" />

              <p className="mt-4 text-[#788078] text-xs tracking-[0.16em] uppercase font-medium">
                Cargando productos...
              </p>
            </div>
          ) : (
            <>
              {productosFiltrados.length === 0 ? (
                <div className="text-center py-20 bg-[#FAF9F5] border border-dashed border-[#CCD3C8] rounded-3xl">
                  <p className="text-[#788078] text-sm">
                    No hay productos destacados en "{categoriaActiva}".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
                  {productosFiltrados
                    .slice(0, visibleCount)
                    .map((prod) => (
                      <ProductCard
                        key={prod._id}
                        id={prod._id}
                        nombre={prod.nombre}
                        categoria={prod.categoria}
                        precio={prod.precio}
                        imagen={
                          prod.imagenUrl ||
                          (prod.imagenes && prod.imagenes[0])
                        }
                        tallas={prod.tallas}
                      />
                    ))}
                </div>
              )}

              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => navigate("/productos")}
                  className="
                    px-8 py-4
                    bg-[#243128]
                    hover:bg-[#405A47]
                    text-white
                    rounded-full
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    shadow-[0_10px_30px_rgba(36,49,40,0.12)]
                  "
                >
                  Ver catálogo completo
                  <span className="ml-2">→</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* CONTACTO */}
        <div className="mt-32 lg:mt-40">
          <ContactForm />
        </div>
      </main>
    </div>
  );
};

export default Home;