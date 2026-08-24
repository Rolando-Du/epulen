import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CATEGORIES = [
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
  "Protección visual",
  "Protección craneal",
  "Protección auditiva",
  "Protección respiratoria",
];

const initialProductState = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  previousImageUrl: null,
  featured: false,
};

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const navigate = useNavigate();

  const [formProduct, setFormProduct] = useState(initialProductState);
  const [imageFiles, setImageFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const swalStyle = {
    background: "#FCFBF8",
    color: "#243128",
    confirmButtonColor: "#405A47",
    cancelButtonColor: "#8A948B",
  };

  const inputClass =
    "w-full px-4 py-3.5 bg-[#F8F7F3] border border-[#D7DDD4] rounded-xl text-[#243128] placeholder:text-[#9BA39B] outline-none transition-all focus:border-[#788873] focus:ring-4 focus:ring-[#788873]/10";

  const mapApiProduct = (item) => ({
    id: item.id || item._id,
    name: item.name || "",
    description: item.description || "",
    category: item.category || "",
    subcategory: item.subcategory || "",
    price: item.price ?? "",
    featured: Boolean(item.featured),
    imageUrl:
      item.imageUrl ||
      (Array.isArray(item.images) ? item.images[0] : null) ||
      null,
    images: Array.isArray(item.images) ? item.images : [],
  });

  // ADMIN SESSION

  const clearSession = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
  };

  const handleExpiredSession = async () => {
    Swal.close();
    clearSession();

    await Swal.fire({
      ...swalStyle,
      icon: "warning",
      title: "Sesión finalizada",
      text: "Tu sesión expiró o ya no es válida. Iniciá sesión nuevamente.",
      confirmButtonText: "Ir al login",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    navigate("/login", { replace: true });
  };

  const logout = async () => {
    const result = await Swal.fire({
      ...swalStyle,
      icon: "question",
      title: "¿Cerrar sesión?",
      text: "Vas a salir del panel de administración.",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9A5D51",
      cancelButtonColor: "#8A948B",
    });

    if (!result.isConfirmed) return;

    clearSession();
    navigate("/login", { replace: true });
  };

  // IMAGES

  const resolveImage = (src) => {
    if (!src) return "";

    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    return `${API_URL}${src}`;
  };

  // PRODUCTS

  const refreshProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Error al obtener datos");
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : [];

      setProducts(items.map(mapApiProduct));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalProducts = products.length;
  const totalFeatured = products.filter((product) => product.featured).length;

  // CATALOG PDF REPORT

  const generateCatalogPDF = () => {
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString("es-AR");

      doc.setFillColor(64, 90, 71);
      doc.rect(0, 0, 210, 34, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.setTextColor(255, 255, 255);
      doc.text("EPULÉN SEGURIDAD INDUSTRIAL", 14, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(229, 234, 226);
      doc.text(`Reporte de catálogo · ${date}`, 14, 24);

      const tableData = products.map((product) => [
        product.name || "Sin nombre",
        product.category || "S/C",
        product.subcategory || "-",
        `$${Number(product.price || 0).toLocaleString("es-AR")}`,
        product.featured ? "Sí" : "No",
      ]);

      autoTable(doc, {
        startY: 42,
        head: [
          ["Producto", "Categoría", "Subcategoría", "Precio", "Destacado"],
        ],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [64, 90, 71],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [247, 246, 242],
        },
        styles: {
          textColor: [36, 49, 40],
          lineColor: [221, 225, 218],
          lineWidth: 0.15,
          fontSize: 8.5,
        },
      });

      const finalY = doc.lastAutoTable?.finalY || 42;

      if (finalY > 270) {
        doc.addPage();
      }

      const summaryY = finalY > 270 ? 20 : finalY + 12;

      doc.setFontSize(8);
      doc.setTextColor(125, 134, 126);
      doc.text(
        `Productos cargados: ${totalProducts} · Destacados: ${totalFeatured}`,
        14,
        summaryY,
      );

      doc.save(`Catalogo_Epulen_${date.replace(/\//g, "-")}.pdf`);

      Swal.fire({
        ...swalStyle,
        icon: "success",
        title: "Reporte generado",
        text: "El catálogo se descargó correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);

      Swal.fire({
        ...swalStyle,
        icon: "error",
        title: "No se pudo generar el PDF",
        text: "Revisá la consola para más detalles.",
      });
    }
  };

  // CREATE / UPDATE PRODUCT

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      await handleExpiredSession();
      return;
    }

    if (formProduct.category === "Protección" && !formProduct.subcategory) {
      await Swal.fire({
        ...swalStyle,
        icon: "warning",
        title: "Falta la subcategoría",
        text: "Seleccioná el tipo de protección del producto.",
      });

      return;
    }

    if (!isEditing && imageFiles.length === 0) {
      await Swal.fire({
        ...swalStyle,
        icon: "warning",
        title: "Falta una imagen",
        text: "Seleccioná al menos una imagen para crear el producto.",
      });

      return;
    }

    Swal.fire({
      ...swalStyle,
      title: isEditing ? "Actualizando producto..." : "Creando producto...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const formData = new FormData();

    // Backend field names remain in Spanish for API compatibility.
    formData.append("name", formProduct.name.trim());
    formData.append("description", formProduct.description.trim());
    formData.append("category", formProduct.category.trim());
    formData.append(
      "subcategory",
      formProduct.category === "Protección"
        ? formProduct.subcategory.trim()
        : "",
    );
    formData.append("price", Number(formProduct.price));
    formData.append("featured", formProduct.featured);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const url = isEditing
      ? `${API_URL}/api/products/${editingId}`
      : `${API_URL}/api/products`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        await handleExpiredSession();
        return;
      }

      if (!response.ok) {
        let message = "No se pudo guardar el producto.";

        try {
          const data = await response.json();
          message = data?.msg || data?.message || message;
        } catch {
          // Response has no JSON body.
        }

        throw new Error(message);
      }

      await Swal.fire({
        ...swalStyle,
        icon: "success",
        title: isEditing ? "Producto actualizado" : "Producto creado",
        timer: 1800,
        showConfirmButton: false,
      });

      cancelEditing();
      await refreshProducts();
    } catch (error) {
      console.error("Error saving product:", error);

      await Swal.fire({
        ...swalStyle,
        icon: "error",
        title: "Error de servidor",
        text: error.message || "No se pudo guardar el producto.",
      });
    }
  };

  // DELETE PRODUCT

  const deleteProduct = async (id) => {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      await handleExpiredSession();
      return;
    }

    const result = await Swal.fire({
      ...swalStyle,
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9A5D51",
      cancelButtonColor: "#8A948B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        await handleExpiredSession();
        return;
      }

      if (!response.ok) {
        let message = "No se pudo eliminar el producto.";

        try {
          const data = await response.json();
          message = data?.msg || data?.message || message;
        } catch {
          // Response has no JSON body.
        }

        throw new Error(message);
      }

      await Swal.fire({
        ...swalStyle,
        title: "Producto eliminado",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);

      await Swal.fire({
        ...swalStyle,
        icon: "error",
        title: "Error al eliminar",
        text: error.message || "No se pudo eliminar el producto.",
      });
    }
  };

  // EDITING

  const startEditing = (product) => {
    setIsEditing(true);
    setEditingId(product.id);

    setFormProduct({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price ?? "",
      featured: Boolean(product.featured),
      previousImageUrl: product.imageUrl || product.images?.[0] || null,
    });

    setImageFiles([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormProduct(initialProductState);
    setImageFiles([]);
  };

  // FILTERING

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.subcategory.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "Todas" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F4F2EC] py-8 sm:py-10 px-4 sm:px-6 text-[#243128]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10 pb-8 border-b border-[#D8DDD4]">
          <div>
            <p className="text-[#788873] text-xs font-medium uppercase tracking-[0.2em] mb-2">
              Administración
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#243128]">
              Epulén Seguridad Industrial
            </h1>

            <p className="text-[#707A71] text-sm mt-2">
              Gestión de productos del catálogo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            <button
              type="button"
              onClick={logout}
              className="bg-[#F7ECE9] hover:bg-[#F1E0DC] text-[#9A5D51] px-4 py-3 rounded-xl transition-colors border border-[#E6CCC6] flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>

              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>

            <button
              type="button"
              onClick={generateCatalogPDF}
              className="bg-[#FCFBF8] hover:bg-white text-[#405A47] px-4 py-3 rounded-xl transition-colors border border-[#D4DAD1] flex items-center gap-2 shadow-[0_8px_24px_rgba(36,49,40,0.04)]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 10v6m0 0-3-3m3 3 3-3M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                />
              </svg>

              <span className="text-sm font-medium">Reporte catálogo</span>
            </button>

            <div className="min-w-32.5 bg-[#FCFBF8] border border-[#D8DDD4] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#899189]">Productos</p>

              <p className="text-lg font-semibold text-[#243128] mt-0.5">
                {totalProducts}
              </p>
            </div>

            <div className="min-w-32.5 bg-[#FCFBF8] border border-[#D8DDD4] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#899189]">Destacados</p>

              <p className="text-lg font-semibold text-[#405A47] mt-0.5">
                {totalFeatured}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-8">
          {/* PRODUCT FORM */}

          <section
            className={[
              "bg-[#FCFBF8] p-5 sm:p-7 lg:p-8 rounded-[28px] border transition-all shadow-[0_18px_50px_rgba(36,49,40,0.05)]",
              isEditing ? "border-[#9AA996]" : "border-[#D8DDD4]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-xs text-[#788873] font-medium mb-1">
                  {isEditing ? "Edición" : "Nuevo producto"}
                </p>

                <h2 className="text-2xl font-semibold text-[#243128]">
                  {isEditing ? "Actualizar información" : "Cargar al catálogo"}
                </h2>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-3.5 py-2 rounded-full bg-[#F0F1ED] hover:bg-[#E6E9E3] text-[#687269] text-xs font-medium transition-colors"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* PREVIEW */}

              <div className="bg-[#F7F6F2] rounded-3xl min-h-52.5 p-5 border border-[#E0E3DD] flex items-center justify-center">
                {imageFiles.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imageFiles[0])}
                    className="h-44 max-w-full object-contain rounded-xl"
                    alt="Vista previa"
                  />
                ) : formProduct.previousImageUrl ? (
                  <img
                    src={resolveImage(formProduct.previousImageUrl)}
                    className="h-44 max-w-full object-contain rounded-xl"
                    alt="Imagen actual"
                  />
                ) : (
                  <div className="text-center text-[#9AA29A]">
                    <svg
                      className="w-10 h-10 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 16.5V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H7.5M3 16.5l4.5-4.5 3 3 4-5 6.5 8"
                      />
                    </svg>

                    <span className="text-sm">Sin imagen seleccionada</span>
                  </div>
                )}
              </div>

              {/* NAME */}

              <div>
                <label className="block text-sm font-medium text-[#526054] mb-2">
                  Nombre del producto
                </label>

                <input
                  type="text"
                  placeholder="Ej. Anteojo de seguridad"
                  className={inputClass}
                  value={formProduct.name}
                  onChange={(event) =>
                    setFormProduct({
                      ...formProduct,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* PRICE / CATEGORY */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#526054] mb-2">
                    Precio
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className={inputClass}
                    value={formProduct.price}
                    onChange={(event) =>
                      setFormProduct({
                        ...formProduct,
                        price: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#526054] mb-2">
                    Categoría
                  </label>

                  <select
                    className={inputClass}
                    value={formProduct.category}
                    onChange={(event) => {
                      const category = event.target.value;

                      setFormProduct({
                        ...formProduct,
                        category,
                        subcategory:
                          category === "Protección"
                            ? formProduct.subcategory
                            : "",
                      });
                    }}
                    required
                  >
                    <option value="">Seleccionar categoría</option>

                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PROTECTION SUBCATEGORY */}

              {formProduct.category === "Protección" && (
                <div className="bg-[#F3F5F0] p-4 sm:p-5 rounded-2xl border border-[#DCE1D8]">
                  <label className="block text-sm font-medium text-[#526054] mb-2">
                    Tipo de protección
                  </label>

                  <select
                    className={inputClass}
                    value={formProduct.subcategory}
                    onChange={(event) =>
                      setFormProduct({
                        ...formProduct,
                        subcategory: event.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Seleccionar subcategoría</option>

                    {PROTECTION_SUBCATEGORIES.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-[#7D867E] mt-2">
                    Este campo solo se utiliza para productos de Protección.
                  </p>
                </div>
              )}

              {/* DESCRIPTION */}

              <div>
                <label className="block text-sm font-medium text-[#526054] mb-2">
                  Descripción
                </label>

                <textarea
                  placeholder="Descripción del producto..."
                  className={`${inputClass} min-h-30 resize-y`}
                  value={formProduct.description}
                  onChange={(event) =>
                    setFormProduct({
                      ...formProduct,
                      description: event.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* FEATURED */}

              <label className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#DCE1D8] bg-[#FAF9F5] cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-[#405A47]">
                    Producto destacado
                  </p>

                  <p className="text-xs text-[#828B83] mt-1">
                    Se mostrará en la selección principal de la home.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(formProduct.featured)}
                  onChange={(event) =>
                    setFormProduct({
                      ...formProduct,
                      featured: event.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#405A47]"
                />
              </label>

              {/* IMAGES / SAVE */}

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-3 pt-1">
                <div className="relative bg-[#F7F6F2] p-4 rounded-xl text-center border border-[#D6DCD3] cursor-pointer hover:bg-[#F0F2ED] transition-colors">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(event) =>
                      setImageFiles(Array.from(event.target.files))
                    }
                    accept="image/jpeg,image/png,image/webp"
                  />

                  <span className="text-sm font-medium text-[#59665B]">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} ${
                          imageFiles.length === 1
                            ? "imagen seleccionada"
                            : "imágenes seleccionadas"
                        }`
                      : isEditing
                        ? "Cambiar imágenes"
                        : "Seleccionar imágenes"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="py-4 px-5 rounded-xl font-medium text-white bg-[#405A47] hover:bg-[#334A3A] transition-all shadow-[0_10px_24px_rgba(64,90,71,0.13)]"
                >
                  {isEditing ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </section>

          {/* PRODUCT LIST */}

          <section className="bg-[#FCFBF8] p-5 sm:p-7 lg:p-8 rounded-[28px] border border-[#D8DDD4] flex flex-col xl:max-h-212.5 shadow-[0_18px_50px_rgba(36,49,40,0.05)]">
            <div className="mb-6">
              <p className="text-xs text-[#788873] font-medium mb-1">
                Catálogo
              </p>

              <h2 className="text-2xl font-semibold text-[#243128]">
                Productos cargados
              </h2>
            </div>

            {/* SEARCH / FILTER */}

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_170px] gap-3 mb-6">
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B948C]"
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
                  placeholder="Buscar producto..."
                  className="w-full py-3 pl-10 pr-4 bg-[#F8F7F3] border border-[#D7DDD4] rounded-xl text-sm text-[#243128] outline-none focus:border-[#788873] focus:ring-4 focus:ring-[#788873]/10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                className="bg-[#F8F7F3] border border-[#D7DDD4] rounded-xl px-4 py-3 text-sm text-[#526054] outline-none cursor-pointer focus:border-[#788873]"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="Todas">Todas</option>

                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* PRODUCTS */}

            <div className="overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-[#D1D7CE] rounded-2xl bg-[#FAF9F5]">
                  <p className="text-sm font-medium text-[#687269]">
                    No hay productos
                  </p>

                  <p className="text-xs text-[#919991] mt-1">
                    Probá con otra búsqueda o categoría.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className={[
                      "bg-[#FAF9F5] border p-4 rounded-2xl flex gap-4 items-center transition-all",
                      product.featured
                        ? "border-[#AAB7A6] shadow-[0_8px_24px_rgba(64,90,71,0.06)]"
                        : "border-[#E0E3DD]",
                    ].join(" ")}
                  >
                    <div className="w-16 h-16 shrink-0 bg-white border border-[#E2E5DF] rounded-xl flex items-center justify-center overflow-hidden">
                      {product.imageUrl || product.images?.[0] ? (
                        <img
                          src={resolveImage(
                            product.imageUrl || product.images[0],
                          )}
                          className="w-full h-full object-contain p-1"
                          alt={product.name}
                        />
                      ) : (
                        <span className="text-[10px] text-[#A1A8A1]">
                          Sin imagen
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <h3 className="text-sm font-semibold text-[#2F3D33] truncate">
                          {product.name}
                        </h3>

                        {product.featured && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#E7ECE4] text-[#5B705D] text-[10px] font-medium">
                            Destacado
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#828B83] mt-1">
                        {product.category || "Sin categoría"}
                        {product.subcategory ? ` · ${product.subcategory}` : ""}
                        {" · $"}
                        {Number(product.price || 0).toLocaleString("es-AR")}
                      </p>

                      <div className="flex gap-4 mt-3">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="text-xs font-medium text-[#526D57] hover:text-[#314B37] transition-colors"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="text-xs font-medium text-[#9A5D51] hover:text-[#7F493F] transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
