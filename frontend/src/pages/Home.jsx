import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../layouts/Hero";
import ProductCard from "../components/ProductCard";
import ContactForm from "../components/ContactForm";

const CATEGORIES = [
  "Todos",
  "Indumentaria",
  "Calzado",
  "Guantes",
  "Alturas",
  "Protección",
  "Señalización",
  "Extintores",
  "Montaña",
];

const PROTECTION_SUBCATEGORIES = [
  "Todas",
  "Protección visual",
  "Protección craneal",
  "Protección auditiva",
  "Protección respiratoria",
];

const VISIBLE_COUNT = 6;

const Home = () => {
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSubcategory, setActiveSubcategory] = useState("Todas");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!API_URL) {
          throw new Error("Falta VITE_API_URL");
        }

        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener productos"
          );
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : [];

        const featured = products.filter(
          (product) => product.featured === true
        );

        setFeaturedProducts(featured);
        setFilteredProducts(featured);
      } catch (error) {
        console.error(
          "Error loading products:",
          error
        );

        setFeaturedProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const filterByCategory = (category) => {
    setActiveCategory(category);
    setActiveSubcategory("Todas");

    if (category === "Todos") {
      setFilteredProducts(
        featuredProducts
      );

      return;
    }

    const searchedCategory =
      category.toLowerCase();

    const filtered =
      featuredProducts.filter(
        (product) =>
          (
            product.category || ""
          ).toLowerCase() ===
          searchedCategory
      );

    setFilteredProducts(filtered);
  };

  const filterBySubcategory = (
    subcategory
  ) => {
    setActiveSubcategory(subcategory);

    const protectionProducts =
      featuredProducts.filter(
        (product) =>
          (
            product.category || ""
          ).toLowerCase() ===
          "protección"
      );

    if (subcategory === "Todas") {
      setFilteredProducts(
        protectionProducts
      );

      return;
    }

    const searchedSubcategory =
      subcategory.toLowerCase();

    const filtered =
      protectionProducts.filter(
        (product) =>
          (
            product.subcategory || ""
          ).toLowerCase() ===
          searchedSubcategory
      );

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#243128] overflow-x-hidden">
      <Hero />

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="max-w-3xl mb-12">
          <p className="text-[#788873] font-semibold text-xs uppercase tracking-[0.22em] mb-3">
            Nuestro catálogo
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-[#243128]">
            Productos seleccionados para trabajar con{" "}
            <span className="text-[#9A6750]">
              seguridad
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[#687168] leading-relaxed">
            Equipamiento e indumentaria pensados para
            acompañar el trabajo diario con protección,
            comodidad y confianza.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((category) => {
            const isActive =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  filterByCategory(category)
                }
                className={[
                  "min-h-17.5 px-5 py-4 rounded-2xl border text-sm font-medium",
                  "transition-all duration-300",
                  isActive
                    ? "bg-[#405A47] border-[#405A47] text-white shadow-[0_10px_30px_rgba(64,90,71,0.16)]"
                    : "bg-[#FCFBF8] border-[#D9DDD5] text-[#59645B] hover:border-[#AAB5A7] hover:bg-white hover:text-[#243128]",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>

        {activeCategory === "Protección" && (
          <div className="mt-5 pt-5 border-t border-[#D8DDD4]">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#788078]">
              Tipo de protección
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {PROTECTION_SUBCATEGORIES.map(
                (subcategory) => {
                  const isActive =
                    activeSubcategory ===
                    subcategory;

                  return (
                    <button
                      key={subcategory}
                      type="button"
                      onClick={() =>
                        filterBySubcategory(
                          subcategory
                        )
                      }
                      className={[
                        "px-4 py-2.5 rounded-xl",
                        "text-xs font-medium",
                        "whitespace-nowrap",
                        "border",
                        "transition-all duration-200",
                        isActive
                          ? "bg-[#9A6750] border-[#9A6750] text-white"
                          : "bg-[#FAF8F4] border-[#DDD5CE] text-[#755E53] hover:bg-white hover:border-[#BFA99D]",
                      ].join(" ")}
                    >
                      {subcategory === "Todas"
                        ? "Toda protección"
                        : subcategory}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </section>

      <main
        id="catalogo"
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pb-28"
      >
        <div className="border-t border-[#D8DDD4] pt-14">
          {loading ? (
            <div className="text-center py-28">
              <div className="inline-block h-9 w-9 rounded-full border-[3px] border-[#CDD4C8] border-t-[#405A47] animate-spin" />

              <p className="mt-4 text-[#788078] text-xs tracking-[0.16em] uppercase font-medium">
                Cargando productos...
              </p>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#FAF9F5] border border-dashed border-[#CCD3C8] rounded-3xl">
                  <p className="text-[#788078] text-sm">
                    No hay productos destacados en{" "}
                    {activeCategory === "Protección" &&
                    activeSubcategory !== "Todas"
                      ? `"${activeSubcategory}".`
                      : `"${activeCategory}".`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
                  {filteredProducts
                    .slice(0, VISIBLE_COUNT)
                    .map((product) => (
                      <ProductCard
                        key={product.id || product._id}
                        id={product.id || product._id}
                        name={product.name}
                        category={product.category}
                        subcategory={
                          product.subcategory
                        }
                        price={product.price}
                        image={
                          product.imageUrl ||
                          (Array.isArray(
                            product.images
                          )
                            ? product.images[0]
                            : "")
                        }
                        description={
                          product.description
                        }
                      />
                    ))}
                </div>
              )}

              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
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
                  <span className="ml-2">
                    →
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-32 lg:mt-40">
          <ContactForm />
        </div>
      </main>
    </div>
  );
};

export default Home;