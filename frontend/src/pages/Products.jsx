import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Todos");

  const [
    activeSubcategory,
    setActiveSubcategory,
  ] = useState("Todas");

  const [loading, setLoading] =
    useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || "";

  // CATEGORIES

  const categories = useMemo(
    () => [
      "Todos",
      "Indumentaria",
      "Calzado",
      "Guantes",
      "Alturas",
      "Protección",
      "Señalización",
      "Extintores",
      "Montaña",
    ],
    []
  );

  // PROTECTION SUBCATEGORIES

  const protectionSubcategories =
    useMemo(
      () => [
        "Todas",
        "Protección visual",
        "Protección craneal",
        "Protección auditiva",
        "Protección respiratoria",
      ],
      []
    );

  // FETCH PRODUCTS

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!API_URL) {
          throw new Error(
            "Falta VITE_API_URL"
          );
        }

        const response = await fetch(
          `${API_URL}/api/productos`
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener productos"
          );
        }

        const result =
          await response.json();

        const arr = Array.isArray(
          result
        )
          ? result
          : [];

        const sortedProducts = [...arr].sort(
          (a, b) => {
            const da = new Date(
              a.creadoEn ||
                a.createdAt ||
                a.updatedAt ||
                0
            ).getTime();

            const db = new Date(
              b.creadoEn ||
                b.createdAt ||
                b.updatedAt ||
                0
            ).getTime();

            return db - da;
          }
        );

        setProducts(sortedProducts);
      } catch (error) {
        console.error(
          "Error cargando el catálogo:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // CHANGE CATEGORY

  const changeCategory = (
    category
  ) => {
    setActiveCategory(category);
    setActiveSubcategory("Todas");
  };

  // FILTER PRODUCTS

  const filteredProducts =
    useMemo(() => {
      let filtered = [...products];

      // CATEGORY FILTER

      if (
        activeCategory !== "Todos"
      ) {
        const searchedCategory =
          activeCategory.toLowerCase();

        filtered = filtered.filter(
          (product) =>
            (
              product.categoria || ""
            ).toLowerCase() ===
            searchedCategory
        );
      }

      // SUBCATEGORY FILTER

      if (
        activeCategory ===
          "Protección" &&
        activeSubcategory !== "Todas"
      ) {
        const searchedSubcategory =
          activeSubcategory.toLowerCase();

        filtered = filtered.filter(
          (product) =>
            (
              product.subcategoria || ""
            ).toLowerCase() ===
            searchedSubcategory
        );
      }

      // SEARCH

      const q = search
        .trim()
        .toLowerCase();

      if (q) {
        filtered = filtered.filter(
          (product) => {
            const name = (
              product.nombre || ""
            ).toLowerCase();

            const description = (
              product.descripcion || ""
            ).toLowerCase();

            const category = (
              product.categoria || ""
            ).toLowerCase();

            const subcategory = (
              product.subcategoria || ""
            ).toLowerCase();

            return (
              name.includes(q) ||
              description.includes(q) ||
              category.includes(q) ||
              subcategory.includes(q)
            );
          }
        );
      }

      return filtered;
    }, [
      products,
      activeCategory,
      activeSubcategory,
      search,
    ]);

  const container =
    "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#243128]">
      <div
        className={`${container} pt-24 sm:pt-28 pb-20`}
      >
        {/* HEADER */}

        <header className="max-w-3xl mb-12">
          <p className="text-[#788873] font-medium text-xs uppercase tracking-[0.22em] mb-3">
            Equipamiento y protección
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] text-[#243128]">
            Nuestro catálogo
          </h1>

          <p className="mt-5 text-[#687168] leading-relaxed max-w-2xl">
            Encontrá indumentaria,
            calzado y elementos de
            seguridad para distintas
            necesidades de trabajo.
          </p>
        </header>

        {/* CONTROLS */}

        <div className="sticky top-16 sm:top-20 z-30 bg-[#F4F2EC]/95 backdrop-blur-xl py-5 border-y border-[#D8DDD4] mb-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col xl:flex-row gap-5 justify-between xl:items-center">
              {/* SEARCH */}

              <div className="relative w-full xl:w-105">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#899189]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-[#FCFBF8]
                    border
                    border-[#D6DBD2]
                    rounded-xl
                    py-3.5
                    pl-12
                    pr-5
                    text-sm
                    text-[#243128]
                    placeholder:text-[#9BA39B]
                    outline-none
                    transition-all
                    focus:border-[#788873]
                    focus:ring-4
                    focus:ring-[#788873]/10
                  "
                />
              </div>

              {/* CATEGORIES */}

              <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                {categories.map(
                  (category) => {
                    const isActive =
                      activeCategory ===
                      category;

                    return (
                      <button
                        key={category}
                        onClick={() =>
                          changeCategory(
                            category
                          )
                        }
                        className={[
                          "px-4 py-2.5",
                          "rounded-full",
                          "text-xs font-medium",
                          "transition-all duration-200",
                          "whitespace-nowrap",
                          "border",
                          isActive
                            ? "bg-[#405A47] border-[#405A47] text-white"
                            : "bg-[#FCFBF8] border-[#D8DDD4] text-[#677068] hover:border-[#9FAC9B] hover:text-[#243128]",
                        ].join(" ")}
                      >
                        {category}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* PROTECTION SUBCATEGORIES */}

            {activeCategory ===
              "Protección" && (
              <div className="pt-4 border-t border-[#D8DDD4]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#788078] whitespace-nowrap">
                    Tipo de protección
                  </span>

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {protectionSubcategories.map(
                      (subcategory) => {
                        const isActive =
                          activeSubcategory ===
                          subcategory;

                        return (
                          <button
                            key={
                              subcategory
                            }
                            onClick={() =>
                              setActiveSubcategory(
                                subcategory
                              )
                            }
                            className={[
                              "px-4 py-2",
                              "rounded-xl",
                              "text-xs",
                              "font-medium",
                              "whitespace-nowrap",
                              "border",
                              "transition-all duration-200",
                              isActive
                                ? "bg-[#9A6750] border-[#9A6750] text-white"
                                : "bg-[#FAF8F4] border-[#DDD5CE] text-[#755E53] hover:bg-white hover:border-[#BFA99D]",
                            ].join(
                              " "
                            )}
                          >
                            {subcategory ===
                            "Todas"
                              ? "Toda protección"
                              : subcategory}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT LIST */}

        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <div className="w-9 h-9 border-[3px] border-[#CDD4C8] border-t-[#405A47] rounded-full animate-spin" />

            <p className="text-[#808980] text-xs tracking-[0.15em] uppercase">
              Cargando catálogo...
            </p>
          </div>
        ) : (
          <>
            {/* COUNTER */}

            <div className="flex items-center justify-between gap-4 mb-7">
              <div>
                <p className="text-[#788078] text-sm">
                  <span className="font-semibold text-[#405A47]">
                    {
                      filteredProducts.length
                    }
                  </span>{" "}
                  {filteredProducts.length ===
                  1
                    ? "producto encontrado"
                    : "productos encontrados"}
                </p>

                {activeCategory ===
                  "Protección" &&
                  activeSubcategory !==
                    "Todas" && (
                    <p className="text-xs text-[#9A6750] mt-1">
                      {
                        activeSubcategory
                      }
                    </p>
                  )}
              </div>

              {!API_URL && (
                <span className="text-xs text-[#A15D50]">
                  Falta VITE_API_URL
                </span>
              )}
            </div>

            {filteredProducts.length >
            0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      nombre={
                        product.nombre
                      }
                      categoria={
                        product.categoria
                      }
                      subcategoria={
                        product.subcategoria
                      }
                      precio={
                        product.precio
                      }
                      imagen={
                        product.imagenUrl ||
                        (product.imagenes &&
                          product
                            .imagenes[0])
                      }
                      descripcion={
                        product.descripcion
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#FAF9F5] border border-dashed border-[#CCD3C8] rounded-3xl">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#E8EBE4] flex items-center justify-center text-[#788873]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    />
                  </svg>
                </div>

                <h3 className="font-semibold text-[#344039]">
                  No encontramos
                  productos
                </h3>

                <p className="text-[#7B847C] text-sm mt-2">
                  Probá con otra búsqueda
                  o seleccioná otra
                  categoría.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory(
                      "Todos"
                    );
                    setActiveSubcategory(
                      "Todas"
                    );
                  }}
                  className="mt-5 text-sm font-medium text-[#405A47] hover:text-[#243128]"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;