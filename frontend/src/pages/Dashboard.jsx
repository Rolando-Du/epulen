import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Dashboard = () => {
  const LIMITE_STOCK_BAJO = 5;
  const API_URL = import.meta.env.VITE_API_URL;

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

  const [producto, setProducto] = useState(estadoInicialProducto);
  const [inputTalle, setInputTalle] = useState("");
  const [inputCantidad, setInputCantidad] = useState("");
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  useEffect(() => {
    refrescarLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refrescarLista = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      if (!res.ok) throw new Error("Error al obtener datos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setProductos([]);
    }
  };

  const totalEquipos = productos.reduce(
    (acc, p) => acc + (p.tallas?.reduce((a, t) => a + Number(t.stock), 0) || 0),
    0
  );
  const valorTotalInventario = productos.reduce(
    (acc, p) =>
      acc +
      Number(p.precio || 0) *
        (p.tallas?.reduce((a, t) => a + Number(t.stock), 0) || 0),
    0
  );

  const agregarTalleALista = () => {
    if (!inputTalle || !inputCantidad) return;
    const existe = producto.tallas.find((t) => t.talle === inputTalle);
    if (existe) {
      Swal.fire({
        icon: "warning",
        title: "Talle Duplicado",
        text: "Este talle ya está en la lista.",
        background: "#0f172a",
        color: "#f8fafc",
      });
      return;
    }
    setProducto({
      ...producto,
      tallas: [
        ...producto.tallas,
        { talle: inputTalle.toUpperCase(), stock: Number(inputCantidad) },
      ],
    });
    setInputTalle("");
    setInputCantidad("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (producto.tallas.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Faltan talles",
        text: "Agrega al menos un talle y su stock",
      });
      return;
    }

    Swal.fire({
      title: "Procesando...",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      background: "#0f172a",
      color: "#fff",
    });

    const formData = new FormData();
    formData.append("nombre", producto.nombre.trim());
    formData.append("descripcion", producto.descripcion.trim());
    formData.append("categoria", producto.categoria.trim());
    formData.append("precio", Number(producto.precio));
    formData.append("destacado", producto.destacado);
    formData.append("tallas", JSON.stringify(producto.tallas));

    if (imagenesFiles.length > 0) {
      imagenesFiles.forEach((file) => formData.append("imagenes", file));
    }

    const url = editando
      ? `${API_URL}/api/productos/${idEditar}`
      : `${API_URL}/api/productos`;

    try {
      const res = await fetch(url, {
        method: editando ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: editando ? "Actualizado" : "Creado",
          text: `El producto se ha ${
            editando ? "actualizado" : "guardado"
          } con éxito`,
          timer: 2000,
          showConfirmButton: false,
          background: "#0f172a",
          color: "#fff",
        });
        cancelarEdicion();
        refrescarLista();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo completar la operación",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de servidor",
        text: "Verifica la conexión con la API",
      });
    }
  };

  const eliminarProd = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#334155",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
    });

    if (resultado.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire({
            title: "Eliminado",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#0f172a",
            color: "#fff",
          });
          refrescarLista();
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el producto",
        });
      }
    }
  };

  const quitarTalleDeLista = (talleNombre) => {
    setProducto({
      ...producto,
      tallas: producto.tallas.filter((t) => t.talle !== talleNombre),
    });
  };

  const prepararEdicion = (p) => {
    setEditando(true);
    setIdEditar(p._id);
    setProducto({
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      destacado: p.destacado || false,
      tallas: p.tallas ? [...p.tallas] : [],
      imagenUrlPrevia: p.imagenUrl,
    });
    setImagenesFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setProducto(estadoInicialProducto);
    setImagenesFiles([]);
    setInputTalle("");
    setInputCantidad("");
  };

  const categoriasUnicas = [
    "Todas",
    ...new Set(productos.map((p) => p.categoria)),
  ];
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (filtroCategoria === "Todas" || p.categoria === filtroCategoria)
  );

  return (
    <div className="min-h-screen bg-[#020617] py-8 px-4 text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              SEGURIDAD<span className="text-orange-600">PRO</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
              Panel de Control
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right px-4 border-r border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Valor Inventario
              </p>
              <p className="text-xl font-black text-orange-500">
                ${valorTotalInventario.toLocaleString("es-CL")}
              </p>
            </div>
            <div className="text-right px-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Stock Total
              </p>
              <p className="text-xl font-black text-white">
                {totalEquipos}{" "}
                <span className="text-[10px] text-slate-600">UDS</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORMULARIO */}
          <div
            className={`bg-slate-900/50 p-8 rounded-[2.5rem] border-2 transition-all ${
              editando ? "border-blue-500" : "border-slate-800"
            }`}
          >
            <h2 className="text-xl font-black text-white uppercase mb-6 flex justify-between">
              {editando ? "✏️ Editando Producto" : "📦 Nuevo Ingreso"}
              {editando && (
                <button
                  onClick={cancelarEdicion}
                  className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#020617] rounded-3xl p-4 border border-slate-800 flex flex-col items-center">
                {imagenesFiles.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imagenesFiles[0])}
                    className="h-40 object-contain rounded-xl"
                    alt="Preview"
                  />
                ) : producto.imagenUrlPrevia ? (
                  <img
                    src={`${API_URL}${producto.imagenUrlPrevia}`}
                    className="h-40 object-contain rounded-xl"
                    alt="Actual"
                  />
                ) : (
                  <div className="h-40 flex items-center text-slate-700 font-bold uppercase text-[10px]">
                    Sin Imagen
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl text-white outline-none focus:border-orange-500"
                value={producto.nombre}
                onChange={(e) =>
                  setProducto({ ...producto, nombre: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio"
                  className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl text-white outline-none focus:border-orange-500"
                  value={producto.precio}
                  onChange={(e) =>
                    setProducto({ ...producto, precio: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl text-white outline-none focus:border-orange-500"
                  value={producto.categoria}
                  onChange={(e) =>
                    setProducto({ ...producto, categoria: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#020617] border border-slate-800 rounded-2xl">
                <input
                  type="checkbox"
                  id="destacado"
                  checked={producto.destacado}
                  onChange={(e) =>
                    setProducto({ ...producto, destacado: e.target.checked })
                  }
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="destacado"
                  className="text-xs font-bold text-slate-400 uppercase cursor-pointer"
                >
                  Producto Destacado ⭐
                </label>
              </div>

              <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Talle"
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-center"
                    value={inputTalle}
                    onChange={(e) => setInputTalle(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Cant"
                    className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-center"
                    value={inputCantidad}
                    onChange={(e) => setInputCantidad(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={agregarTalleALista}
                    className="bg-orange-600 px-4 rounded-lg font-bold cursor-pointer hover:bg-orange-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas.map((t, i) => (
                    <span
                      key={i}
                      className="bg-slate-800 text-[10px] px-2 py-1 rounded-md border border-slate-700"
                    >
                      {t.talle} ({t.stock})
                      <button
                        type="button"
                        onClick={() => quitarTalleDeLista(t.talle)}
                        className="ml-2 text-red-500 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Descripción..."
                className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl h-24 text-white outline-none focus:border-orange-500"
                value={producto.descripcion}
                onChange={(e) =>
                  setProducto({ ...producto, descripcion: e.target.value })
                }
                required
              />

              <div className="flex gap-4">
                <div className="flex-1 relative bg-slate-800 p-4 rounded-2xl text-center border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setImagenesFiles(Array.from(e.target.files))
                    }
                    accept="image/*"
                  />
                  <span className="text-[10px] font-bold">
                    {imagenesFiles.length > 0
                      ? `${imagenesFiles.length} Archivos`
                      : "📸 Fotos"}
                  </span>
                </div>
                <button
                  type="submit"
                  className={`flex-[1.5] py-4 rounded-2xl font-black uppercase text-white cursor-pointer hover:opacity-90 transition-opacity ${
                    editando ? "bg-blue-600" : "bg-orange-600"
                  }`}
                >
                  {editando ? "Actualizar" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>

          {/* LISTADO */}
          <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col max-h-212.5">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Buscar..."
                className="flex-1 p-3 bg-[#020617] border border-slate-800 rounded-xl text-white outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 text-xs font-bold text-orange-500 cursor-pointer"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                {categoriasUnicas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {productosFiltrados.map((p) => (
                <div
                  key={p._id}
                  className={`bg-[#020617] border p-4 rounded-2xl flex gap-4 items-center ${
                    p.destacado ? "border-orange-500/50" : "border-slate-800"
                  }`}
                >
                  <img
                    src={`${API_URL}${p.imagenUrl}`}
                    className="w-16 h-16 object-contain bg-slate-900 rounded-lg"
                    alt={p.nombre}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/50")
                    }
                  />
                  <div className="flex-1">
                    <h3 className="text-xs font-black uppercase text-white">
                      {p.nombre} {p.destacado && "⭐"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {p.categoria} - ${Number(p.precio).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => prepararEdicion(p)}
                        className="text-[9px] font-bold text-blue-400 uppercase cursor-pointer hover:text-blue-300 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProd(p._id)}
                        className="text-[9px] font-bold text-red-500 uppercase cursor-pointer hover:text-red-400 transition-colors"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
