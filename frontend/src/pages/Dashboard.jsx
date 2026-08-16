import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || "";

  const navigate = useNavigate();

  const estadoInicialProducto = {
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    tallas: [],
    imagenes: [],
    imagenUrlPrevia: null,
    destacado: false,
  };

  const [producto, setProducto] = useState(
    estadoInicialProducto
  );

  const [inputTalle, setInputTalle] =
    useState("");

  const [inputCantidad, setInputCantidad] =
    useState("");

  const [imagenesFiles, setImagenesFiles] =
    useState([]);

  const [productos, setProductos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [
    filtroCategoria,
    setFiltroCategoria,
  ] = useState("Todas");

  const [editando, setEditando] =
    useState(false);

  const [idEditar, setIdEditar] =
    useState(null);

  // ==============================
  // SWEET ALERT
  // ==============================

  const swalEstilo = {
    background: "#FCFBF8",
    color: "#243128",
    confirmButtonColor: "#405A47",
    cancelButtonColor: "#8A948B",
  };

  // ==============================
  // SESIÓN ADMIN
  // ==============================

  const limpiarSesion = () => {
    sessionStorage.removeItem(
      "admin_auth"
    );

    sessionStorage.removeItem(
      "admin_token"
    );

    // Limpieza de claves antiguas
    localStorage.removeItem(
      "admin_auth"
    );

    localStorage.removeItem(
      "admin_token"
    );
  };

  const manejarSesionExpirada = async () => {
    Swal.close();

    limpiarSesion();

    await Swal.fire({
      ...swalEstilo,
      icon: "warning",
      title: "Sesión finalizada",
      text:
        "Tu sesión expiró o ya no es válida. Iniciá sesión nuevamente.",
      confirmButtonText: "Ir al login",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    navigate("/login", {
      replace: true,
    });
  };

  // ==============================
  // CERRAR SESIÓN
  // ==============================

  const cerrarSesion = async () => {
    const resultado = await Swal.fire({
      ...swalEstilo,
      icon: "question",
      title: "¿Cerrar sesión?",
      text:
        "Vas a salir del panel de administración.",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9A5D51",
      cancelButtonColor: "#8A948B",
    });

    if (!resultado.isConfirmed) return;

    limpiarSesion();

    navigate("/login", {
      replace: true,
    });
  };

  // ==============================
  // RESOLVER URL DE IMAGEN
  // ==============================

  const resolverImagen = (src) => {
    if (!src) return "";

    if (
      src.startsWith("http://") ||
      src.startsWith("https://")
    ) {
      return src;
    }

    return `${API_URL}${src}`;
  };

  // ==============================
  // CARGA INICIAL
  // ==============================

  useEffect(() => {
    refrescarLista();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==============================
  // OBTENER PRODUCTOS
  // ==============================

  const refrescarLista = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/productos`
      );

      if (!res.ok) {
        throw new Error(
          "Error al obtener datos"
        );
      }

      const data = await res.json();

      setProductos(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching:",
        err
      );

      setProductos([]);
    }
  };

  // ==============================
  // TOTALES
  // ==============================

  const totalEquipos =
    productos.reduce(
      (acc, p) =>
        acc +
        (
          p.tallas?.reduce(
            (a, t) =>
              a +
              Number(
                t.stock || 0
              ),
            0
          ) || 0
        ),
      0
    );

  const valorTotalInventario =
    productos.reduce(
      (acc, p) =>
        acc +
        Number(
          p.precio || 0
        ) *
          (
            p.tallas?.reduce(
              (a, t) =>
                a +
                Number(
                  t.stock || 0
                ),
              0
            ) || 0
          ),
      0
    );

  // ==============================
  // REPORTE PDF
  // ==============================

  const generarReportePDF = () => {
    try {
      const doc = new jsPDF();

      const fecha =
        new Date().toLocaleDateString(
          "es-AR"
        );

      // Encabezado
      doc.setFillColor(
        64,
        90,
        71
      );

      doc.rect(
        0,
        0,
        210,
        34,
        "F"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(17);

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.text(
        "EPULÉN SEGURIDAD INDUSTRIAL",
        14,
        15
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(
        229,
        234,
        226
      );

      doc.text(
        `Reporte de inventario · ${fecha}`,
        14,
        24
      );

      const tablaDatos = [];

      productos.forEach((p) => {
        const tallas =
          p.tallas &&
          p.tallas.length > 0
            ? p.tallas
            : [
                {
                  talle: "S/N",
                  stock: 0,
                },
              ];

        tallas.forEach((t) => {
          const precio =
            Number(
              p.precio || 0
            );

          const stock =
            Number(
              t.stock || 0
            );

          tablaDatos.push([
            p.nombre ||
              "Sin nombre",

            p.categoria ||
              "S/C",

            t.talle || "-",

            stock,

            `$${precio.toLocaleString(
              "es-AR"
            )}`,

            `$${(
              stock * precio
            ).toLocaleString(
              "es-AR"
            )}`,
          ]);
        });
      });

      autoTable(doc, {
        startY: 42,

        head: [
          [
            "Producto",
            "Categoría",
            "Talle",
            "Stock",
            "Precio unit.",
            "Subtotal",
          ],
        ],

        body: tablaDatos,

        theme: "striped",

        headStyles: {
          fillColor: [
            64,
            90,
            71,
          ],

          textColor: [
            255,
            255,
            255,
          ],

          fontStyle:
            "bold",
        },

        alternateRowStyles: {
          fillColor: [
            247,
            246,
            242,
          ],
        },

        styles: {
          textColor: [
            36,
            49,
            40,
          ],

          lineColor: [
            221,
            225,
            218,
          ],

          lineWidth: 0.15,

          fontSize: 8.5,
        },
      });

      const finalY =
        doc.lastAutoTable
          ?.finalY || 42;

      if (finalY > 270) {
        doc.addPage();
      }

      const resumenY =
        finalY > 270
          ? 20
          : finalY + 12;

      doc.setFontSize(8);

      doc.setTextColor(
        125,
        134,
        126
      );

      doc.text(
        `Stock total: ${totalEquipos} unidades · Valor inventario: $${valorTotalInventario.toLocaleString(
          "es-AR"
        )}`,
        14,
        resumenY
      );

      doc.save(
        `Inventario_Epulen_${fecha.replace(
          /\//g,
          "-"
        )}.pdf`
      );

      Swal.fire({
        ...swalEstilo,
        icon: "success",
        title:
          "Reporte generado",
        text:
          "El inventario se descargó correctamente.",
        timer: 1800,
        showConfirmButton:
          false,
      });
    } catch (error) {
      console.error(
        "Error generando PDF:",
        error
      );

      Swal.fire({
        ...swalEstilo,
        icon: "error",
        title:
          "No se pudo generar el PDF",
        text:
          "Revisá la consola para más detalles.",
      });
    }
  };

  // ==============================
  // AGREGAR TALLE
  // ==============================

  const agregarTalleALista =
    () => {
      if (
        !inputTalle ||
        !inputCantidad
      ) {
        return;
      }

      let valorLimpio =
        inputTalle
          .trim()
          .toUpperCase();

      valorLimpio =
        valorLimpio.replace(
          /^(T-|T)+/,
          ""
        );

      const talleFormateado =
        `T-${valorLimpio}`;

      const existe =
        producto.tallas.find(
          (t) =>
            t.talle ===
            talleFormateado
        );

      if (existe) {
        Swal.fire({
          ...swalEstilo,
          icon: "warning",
          title:
            "Talle duplicado",
          text:
            "Ese talle ya fue agregado al producto.",
        });

        return;
      }

      setProducto({
        ...producto,

        tallas: [
          ...producto.tallas,

          {
            talle:
              talleFormateado,

            stock:
              Number(
                inputCantidad
              ),
          },
        ],
      });

      setInputTalle("");
      setInputCantidad("");
    };

  // ==============================
  // CREAR / ACTUALIZAR PRODUCTO
  // ==============================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const token =
      sessionStorage.getItem(
        "admin_token"
      );

    if (!token) {
      await manejarSesionExpirada();
      return;
    }

    if (
      producto.tallas.length ===
      0
    ) {
      Swal.fire({
        ...swalEstilo,
        icon: "error",
        title:
          "Faltan talles",
        text:
          "Agregá al menos un talle con stock.",
      });

      return;
    }

    Swal.fire({
      ...swalEstilo,

      title: editando
        ? "Actualizando producto..."
        : "Creando producto...",

      didOpen: () =>
        Swal.showLoading(),

      allowOutsideClick:
        false,

      showConfirmButton:
        false,
    });

    const formData =
      new FormData();

    formData.append(
      "nombre",
      producto.nombre.trim()
    );

    formData.append(
      "descripcion",
      producto.descripcion.trim()
    );

    formData.append(
      "categoria",
      producto.categoria.trim()
    );

    formData.append(
      "precio",
      Number(
        producto.precio
      )
    );

    formData.append(
      "destacado",
      producto.destacado
    );

    formData.append(
      "tallas",
      JSON.stringify(
        producto.tallas
      )
    );

    if (
      imagenesFiles.length >
      0
    ) {
      imagenesFiles.forEach(
        (file) =>
          formData.append(
            "imagenes",
            file
          )
      );
    }

    const url = editando
      ? `${API_URL}/api/productos/${idEditar}`
      : `${API_URL}/api/productos`;

    try {
      const res = await fetch(
        url,
        {
          method: editando
            ? "PUT"
            : "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

      if (
        res.status === 401 ||
        res.status === 403
      ) {
        await manejarSesionExpirada();
        return;
      }

      if (!res.ok) {
        let mensaje =
          "No se pudo guardar el producto.";

        try {
          const data =
            await res.json();

          if (
            data?.msg ||
            data?.message
          ) {
            mensaje =
              data.msg ||
              data.message;
          }
        } catch {
          // Sin cuerpo JSON
        }

        throw new Error(
          mensaje
        );
      }

      Swal.fire({
        ...swalEstilo,

        icon: "success",

        title: editando
          ? "Producto actualizado"
          : "Producto creado",

        timer: 1800,

        showConfirmButton:
          false,
      });

      cancelarEdicion();

      await refrescarLista();
    } catch (error) {
      console.error(
        "Error guardando producto:",
        error
      );

      Swal.fire({
        ...swalEstilo,

        icon: "error",

        title:
          "Error de servidor",

        text:
          error.message ||
          "No se pudo guardar el producto.",
      });
    }
  };

  // ==============================
  // ELIMINAR PRODUCTO
  // ==============================

  const eliminarProd = async (
    id
  ) => {
    const token =
      sessionStorage.getItem(
        "admin_token"
      );

    if (!token) {
      await manejarSesionExpirada();
      return;
    }

    const resultado =
      await Swal.fire({
        ...swalEstilo,

        title:
          "¿Eliminar producto?",

        text:
          "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton:
          true,

        confirmButtonColor:
          "#9A5D51",

        cancelButtonColor:
          "#8A948B",

        confirmButtonText:
          "Sí, eliminar",

        cancelButtonText:
          "Cancelar",
      });

    if (
      !resultado.isConfirmed
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/productos/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        res.status === 401 ||
        res.status === 403
      ) {
        await manejarSesionExpirada();
        return;
      }

      if (!res.ok) {
        let mensaje =
          "No se pudo eliminar el producto.";

        try {
          const data =
            await res.json();

          if (
            data?.msg ||
            data?.message
          ) {
            mensaje =
              data.msg ||
              data.message;
          }
        } catch {
          // Sin cuerpo JSON
        }

        throw new Error(
          mensaje
        );
      }

      Swal.fire({
        ...swalEstilo,

        title:
          "Producto eliminado",

        icon: "success",

        timer: 1500,

        showConfirmButton:
          false,
      });

      await refrescarLista();
    } catch (error) {
      console.error(
        "Error al eliminar:",
        error
      );

      Swal.fire({
        ...swalEstilo,

        icon: "error",

        title:
          "Error al eliminar",

        text:
          error.message ||
          "No se pudo eliminar el producto.",
      });
    }
  };

  // ==============================
  // PREPARAR EDICIÓN
  // ==============================

  const prepararEdicion = (
    p
  ) => {
    setEditando(true);

    setIdEditar(p._id);

    setProducto({
      nombre:
        p.nombre,

      descripcion:
        p.descripcion,

      categoria:
        p.categoria,

      precio:
        p.precio,

      destacado:
        p.destacado ||
        false,

      tallas:
        p.tallas
          ? [...p.tallas]
          : [],

      imagenes:
        p.imagenes ||
        [],

      imagenUrlPrevia:
        p.imagenUrl,
    });

    setImagenesFiles([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==============================
  // CANCELAR EDICIÓN
  // ==============================

  const cancelarEdicion =
    () => {
      setEditando(false);

      setIdEditar(null);

      setProducto(
        estadoInicialProducto
      );

      setImagenesFiles([]);

      setInputTalle("");

      setInputCantidad("");
    };

  // ==============================
  // CATEGORÍAS
  // ==============================

  const categoriasUnicas = [
    "Todas",

    ...new Set(
      productos
        .map(
          (p) =>
            p.categoria
        )
        .filter(Boolean)
    ),
  ];

  // ==============================
  // FILTRADO
  // ==============================

  const productosFiltrados =
    productos.filter((p) => {
      const coincideBusqueda =
        (
          p.nombre || ""
        )
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideCategoria =
        filtroCategoria ===
          "Todas" ||
        p.categoria ===
          filtroCategoria;

      return (
        coincideBusqueda &&
        coincideCategoria
      );
    });

  // ==============================
  // ESTILOS
  // ==============================

  const inputClass =
    "w-full px-4 py-3.5 bg-[#F8F7F3] border border-[#D7DDD4] rounded-xl text-[#243128] placeholder:text-[#9BA39B] outline-none transition-all focus:border-[#788873] focus:ring-4 focus:ring-[#788873]/10";

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="min-h-screen bg-[#F4F2EC] py-8 sm:py-10 px-4 sm:px-6 text-[#243128]">
      <div className="max-w-7xl mx-auto">

        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10 pb-8 border-b border-[#D8DDD4]">
          <div>
            <p className="text-[#788873] text-xs font-medium uppercase tracking-[0.2em] mb-2">
              Administración
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#243128]">
              Epulén Seguridad
              Industrial
            </h1>

            <p className="text-[#707A71] text-sm mt-2">
              Gestión de catálogo,
              stock e inventario.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">

            {/* CERRAR SESIÓN */}

            <button
              type="button"
              onClick={cerrarSesion}
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

              <span className="text-sm font-medium">
                Cerrar sesión
              </span>
            </button>

            {/* REPORTE PDF */}

            <button
              type="button"
              onClick={
                generarReportePDF
              }
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

              <span className="text-sm font-medium">
                Reporte PDF
              </span>
            </button>

            {/* VALOR INVENTARIO */}

            <div className="min-w-37.5 bg-[#FCFBF8] border border-[#D8DDD4] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#899189]">
                Valor inventario
              </p>

              <p className="text-lg font-semibold text-[#405A47] mt-0.5">
                $
                {valorTotalInventario.toLocaleString(
                  "es-AR"
                )}
              </p>
            </div>

            {/* STOCK TOTAL */}

            <div className="min-w-32.5 bg-[#FCFBF8] border border-[#D8DDD4] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#899189]">
                Stock total
              </p>

              <p className="text-lg font-semibold text-[#243128] mt-0.5">
                {totalEquipos}

                <span className="text-xs font-normal text-[#8B948C] ml-1">
                  uds.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* CONTENIDO */}
        {/* ============================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-8">

          {/* ============================== */}
          {/* FORMULARIO */}
          {/* ============================== */}

          <section
            className={[
              "bg-[#FCFBF8] p-5 sm:p-7 lg:p-8 rounded-[28px] border transition-all shadow-[0_18px_50px_rgba(36,49,40,0.05)]",

              editando
                ? "border-[#9AA996]"
                : "border-[#D8DDD4]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-xs text-[#788873] font-medium mb-1">
                  {editando
                    ? "Edición"
                    : "Nuevo producto"}
                </p>

                <h2 className="text-2xl font-semibold text-[#243128]">
                  {editando
                    ? "Actualizar información"
                    : "Cargar al catálogo"}
                </h2>
              </div>

              {editando && (
                <button
                  type="button"
                  onClick={
                    cancelarEdicion
                  }
                  className="px-3.5 py-2 rounded-full bg-[#F0F1ED] hover:bg-[#E6E9E3] text-[#687269] text-xs font-medium transition-colors"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >


              {/* PREVIEW */}


              <div className="bg-[#F7F6F2] rounded-3xl min-h-52.5 p-5 border border-[#E0E3DD] flex items-center justify-center">
                {imagenesFiles.length >
                0 ? (
                  <img
                    src={URL.createObjectURL(
                      imagenesFiles[0]
                    )}
                    className="h-44 max-w-full object-contain rounded-xl"
                    alt="Vista previa"
                  />
                ) : producto.imagenUrlPrevia ? (
                  <img
                    src={resolverImagen(
                      producto.imagenUrlPrevia
                    )}
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

                    <span className="text-sm">
                      Sin imagen
                      seleccionada
                    </span>
                  </div>
                )}
              </div>


              {/* NOMBRE */}


              <div>
                <label className="block text-sm font-medium text-[#526054] mb-2">
                  Nombre del producto
                </label>

                <input
                  type="text"
                  placeholder="Ej. Botín de seguridad"
                  className={
                    inputClass
                  }
                  value={
                    producto.nombre
                  }
                  onChange={(e) =>
                    setProducto({
                      ...producto,
                      nombre:
                        e.target
                          .value,
                    })
                  }
                  required
                />
              </div>


              {/* PRECIO / CATEGORÍA */}


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#526054] mb-2">
                    Precio
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className={
                      inputClass
                    }
                    value={
                      producto.precio
                    }
                    onChange={(e) =>
                      setProducto({
                        ...producto,
                        precio:
                          e.target
                            .value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#526054] mb-2">
                    Categoría
                  </label>

                  <input
                    type="text"
                    placeholder="Ej. Calzado"
                    className={
                      inputClass
                    }
                    value={
                      producto.categoria
                    }
                    onChange={(e) =>
                      setProducto({
                        ...producto,
                        categoria:
                          e.target
                            .value,
                      })
                    }
                    required
                  />
                </div>
              </div>


              {/* TALLES */}


              <div className="bg-[#F3F5F0] p-4 sm:p-5 rounded-2xl border border-[#DCE1D8]">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#405A47]">
                    Talles y stock
                  </h3>

                  <p className="text-xs text-[#7D867E] mt-1">
                    Agregá cada talle
                    con su cantidad
                    disponible.
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_100px_auto] gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="45 o XL"
                    className="min-w-0 px-3 py-2.5 bg-white border border-[#D5DBD2] rounded-lg text-[#243128] text-sm outline-none focus:border-[#788873]"
                    value={
                      inputTalle
                    }
                    onChange={(e) =>
                      setInputTalle(
                        e.target
                          .value
                      )
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Cant."
                    className="min-w-0 px-3 py-2.5 bg-white border border-[#D5DBD2] rounded-lg text-[#243128] text-sm outline-none focus:border-[#788873]"
                    value={
                      inputCantidad
                    }
                    onChange={(e) =>
                      setInputCantidad(
                        e.target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={
                      agregarTalleALista
                    }
                    className="w-11 h-11 bg-[#405A47] hover:bg-[#334A3A] text-white rounded-lg font-medium transition-colors"
                    aria-label="Agregar talle"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {producto.tallas
                    .length === 0 ? (
                    <span className="text-xs text-[#8B948C]">
                      Todavía no
                      agregaste talles.
                    </span>
                  ) : (
                    producto.tallas.map(
                      (t, i) => (
                        <span
                          key={`${t.talle}-${i}`}
                          className="bg-white text-[#526054] text-xs px-3 py-2 rounded-full border border-[#D7DDD4] flex items-center gap-2"
                        >
                          <strong className="font-medium">
                            {
                              t.talle
                            }
                          </strong>

                          <span className="text-[#8B948C]">
                            {
                              t.stock
                            }{" "}
                            uds.
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setProducto(
                                {
                                  ...producto,

                                  tallas:
                                    producto.tallas.filter(
                                      (
                                        item
                                      ) =>
                                        item.talle !==
                                        t.talle
                                    ),
                                }
                              )
                            }
                            className="ml-1 w-5 h-5 rounded-full bg-[#F2E5E2] text-[#9A5D51] hover:bg-[#ECD8D3] flex items-center justify-center"
                            aria-label={`Quitar talle ${t.talle}`}
                          >
                            ×
                          </button>
                        </span>
                      )
                    )
                  )}
                </div>
              </div>


              {/* DESCRIPCIÓN */}


              <div>
                <label className="block text-sm font-medium text-[#526054] mb-2">
                  Descripción
                </label>

                <textarea
                  placeholder="Descripción del producto..."
                  className={`${inputClass} min-h-30 resize-y`}
                  value={
                    producto.descripcion
                  }
                  onChange={(e) =>
                    setProducto({
                      ...producto,

                      descripcion:
                        e.target
                          .value,
                    })
                  }
                  required
                />
              </div>


              {/* DESTACADO */}


              <label className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#DCE1D8] bg-[#FAF9F5] cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-[#405A47]">
                    Producto destacado
                  </p>

                  <p className="text-xs text-[#828B83] mt-1">
                    Se mostrará en la
                    selección principal
                    de la home.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(
                    producto.destacado
                  )}
                  onChange={(e) =>
                    setProducto({
                      ...producto,

                      destacado:
                        e.target
                          .checked,
                    })
                  }
                  className="w-5 h-5 accent-[#405A47]"
                />
              </label>


              {/* IMÁGENES / GUARDAR */}


              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-3 pt-1">
                <div className="relative bg-[#F7F6F2] p-4 rounded-xl text-center border border-[#D6DCD3] cursor-pointer hover:bg-[#F0F2ED] transition-colors">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setImagenesFiles(
                        Array.from(
                          e.target
                            .files
                        )
                      )
                    }
                    accept="image/*"
                  />

                  <span className="text-sm font-medium text-[#59665B]">
                    {imagenesFiles.length >
                    0
                      ? `${
                          imagenesFiles.length
                        } ${
                          imagenesFiles.length ===
                          1
                            ? "imagen seleccionada"
                            : "imágenes seleccionadas"
                        }`
                      : "Seleccionar imágenes"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="py-4 px-5 rounded-xl font-medium text-white bg-[#405A47] hover:bg-[#334A3A] transition-all shadow-[0_10px_24px_rgba(64,90,71,0.13)]"
                >
                  {editando
                    ? "Guardar cambios"
                    : "Crear producto"}
                </button>
              </div>
            </form>
          </section>

          {/* ============================== */}
          {/* LISTADO */}
          {/* ============================== */}

          <section className="bg-[#FCFBF8] p-5 sm:p-7 lg:p-8 rounded-[28px] border border-[#D8DDD4] flex flex-col xl:max-h-212.5 shadow-[0_18px_50px_rgba(36,49,40,0.05)]">
            <div className="mb-6">
              <p className="text-xs text-[#788873] font-medium mb-1">
                Inventario
              </p>

              <h2 className="text-2xl font-semibold text-[#243128]">
                Productos cargados
              </h2>
            </div>

            {/* BUSCADOR / FILTRO */}

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
                  value={
                    busqueda
                  }
                  onChange={(e) =>
                    setBusqueda(
                      e.target.value
                    )
                  }
                />
              </div>

              <select
                className="bg-[#F8F7F3] border border-[#D7DDD4] rounded-xl px-4 py-3 text-sm text-[#526054] outline-none cursor-pointer focus:border-[#788873]"
                value={
                  filtroCategoria
                }
                onChange={(e) =>
                  setFiltroCategoria(
                    e.target.value
                  )
                }
              >
                {categoriasUnicas.map(
                  (c) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PRODUCTOS */}

            <div className="overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {productosFiltrados.length ===
              0 ? (
                <div className="text-center py-14 border border-dashed border-[#D1D7CE] rounded-2xl bg-[#FAF9F5]">
                  <p className="text-sm font-medium text-[#687269]">
                    No hay productos
                  </p>

                  <p className="text-xs text-[#919991] mt-1">
                    Probá con otra
                    búsqueda o
                    categoría.
                  </p>
                </div>
              ) : (
                productosFiltrados.map(
                  (p) => (
                    <article
                      key={
                        p._id
                      }
                      className={[
                        "bg-[#FAF9F5] border p-4 rounded-2xl flex gap-4 items-center transition-all",

                        p.destacado
                          ? "border-[#AAB7A6] shadow-[0_8px_24px_rgba(64,90,71,0.06)]"
                          : "border-[#E0E3DD]",
                      ].join(
                        " "
                      )}
                    >
                      {/* IMAGEN */}

                      <div className="w-16 h-16 shrink-0 bg-white border border-[#E2E5DF] rounded-xl flex items-center justify-center overflow-hidden">
                        {p.imagenUrl ? (
                          <img
                            src={resolverImagen(
                              p.imagenUrl
                            )}
                            className="w-full h-full object-contain p-1"
                            alt={
                              p.nombre
                            }
                          />
                        ) : (
                          <span className="text-[10px] text-[#A1A8A1]">
                            Sin imagen
                          </span>
                        )}
                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 className="text-sm font-semibold text-[#2F3D33] truncate">
                            {
                              p.nombre
                            }
                          </h3>

                          {p.destacado && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#E7ECE4] text-[#5B705D] text-[10px] font-medium">
                              Destacado
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#828B83] mt-1">
                          {p.categoria ||
                            "Sin categoría"}{" "}
                          · $
                          {Number(
                            p.precio ||
                              0
                          ).toLocaleString(
                            "es-AR"
                          )}
                        </p>

                        <div className="flex gap-4 mt-3">
                          <button
                            type="button"
                            onClick={() =>
                              prepararEdicion(
                                p
                              )
                            }
                            className="text-xs font-medium text-[#526D57] hover:text-[#314B37] transition-colors"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarProd(
                                p._id
                              )
                            }
                            className="text-xs font-medium text-[#9A5D51] hover:text-[#7F493F] transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;