import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const LIMITE_STOCK_BAJO = 5;

  const estadoInicialProducto = {
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    tallas: [],
    imagenes: [], // Cambiado a array para coincidir con el modelo
  };

  const [producto, setProducto] = useState(estadoInicialProducto);
  const [inputTalle, setInputTalle] = useState("");
  const [inputCantidad, setInputCantidad] = useState("");
  // Estado para manejar múltiples archivos seleccionados
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  // --- LÓGICA DE DATOS ---

  const obtenerDatosDeAPI = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/productos");
      if (!res.ok) throw new Error("Error al obtener datos");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    refrescarLista();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refrescarLista = async () => {
    const data = await obtenerDatosDeAPI();
    setProductos(data);
  };

  // --- CÁLCULOS ---

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

  // --- MANEJO DE TALLES ---

  const agregarTalleALista = () => {
    if (!inputTalle || !inputCantidad) return;
    const existe = producto.tallas.find((t) => t.talle === inputTalle);
    if (existe) {
      alert("Este talle ya está en la lista.");
      return;
    }
    setProducto({
      ...producto,
      tallas: [
        ...producto.tallas,
        { talle: inputTalle, stock: Number(inputCantidad) },
      ],
    });
    setInputTalle("");
    setInputCantidad("");
  };

  const quitarTalleDeLista = (talleNombre) => {
    setProducto({
      ...producto,
      tallas: producto.tallas.filter((t) => t.talle !== talleNombre),
    });
  };

  // --- ACCIONES FORMULARIO ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (producto.tallas.length === 0) {
      setMensaje("⚠️ Agrega al menos un talle");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("descripcion", producto.descripcion);
    formData.append("categoria", producto.categoria);
    formData.append("precio", producto.precio);
    formData.append("tallas", JSON.stringify(producto.tallas));

    // INTEGRACIÓN CON BACKEND: Enviamos el array de archivos como 'imagenes'
    if (imagenesFiles.length > 0) {
      imagenesFiles.forEach((file) => {
        formData.append("imagenes", file);
      });
    }

    const url = editando
      ? `http://localhost:5000/api/productos/${idEditar}`
      : "http://localhost:5000/api/productos";

    try {
      const res = await fetch(url, {
        method: editando ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        setMensaje(editando ? "✅ Actualizado" : "✅ Registrado");
        cancelarEdicion();
        refrescarLista();
        setTimeout(() => setMensaje(""), 3000);
      } else {
        const err = await res.json();
        setMensaje(`❌ Error: ${err.msg || "No se pudo guardar"}`);
      }
    } catch {
      setMensaje("❌ Error de conexión");
    }
  };

  const prepararEdicion = (p) => {
    setEditando(true);
    setIdEditar(p._id);
    setProducto({
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      tallas: p.tallas ? [...p.tallas] : [],
      // Usamos el virtual imagenUrl para la previsualización
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

  const eliminarProd = async (id) => {
    if (window.confirm("¿Deseas eliminar este producto permanentemente?")) {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refrescarLista();
        setMensaje("🗑️ Producto eliminado");
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/login");
  };

  // --- FILTROS ---
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
              Panel de Control de Inventario
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
            <button
              onClick={handleLogout}
              className="bg-red-600/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
            >
              SALIR
            </button>
          </div>
        </div>

        {mensaje && (
          <div className="fixed top-5 right-5 z-50 bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl">
            {mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORMULARIO */}
          <div
            className={`bg-slate-900/50 p-8 rounded-[2.5rem] border-2 transition-all ${
              editando ? "border-blue-500" : "border-slate-800"
            }`}
          >
            {/* VISTA PREVIA */}
            <div className="bg-[#020617] rounded-3xl p-6 border border-slate-800 mb-8">
              <div className="flex items-center justify-center h-56 bg-slate-900/50 rounded-2xl mb-6 overflow-hidden border border-slate-800">
                {imagenesFiles.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imagenesFiles[0])}
                    className="h-full object-contain"
                    alt="Preview"
                  />
                ) : producto.imagenUrlPrevia ? (
                  <img
                    src={`http://localhost:5000${producto.imagenUrlPrevia}`}
                    className="h-full object-contain"
                    alt="Current"
                  />
                ) : (
                  <span className="text-slate-800 font-black text-2xl uppercase opacity-20">
                    Esperando Imagen
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase mb-2">
                  Talles y Stock:
                </p>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas.length === 0 && (
                    <span className="text-slate-600 text-xs italic">
                      Agrega talles abajo...
                    </span>
                  )}
                  {producto.tallas.map((t, i) => (
                    <div
                      key={i}
                      className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg flex gap-2 items-center"
                    >
                      <span className="text-xs font-black text-white">
                        {t.talle}
                      </span>
                      <span className="text-[10px] text-orange-500 font-bold">
                        {t.stock}u
                      </span>
                      <button
                        type="button"
                        onClick={() => quitarTalleDeLista(t.talle)}
                        className="text-red-500 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del Producto"
                className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl outline-none focus:border-orange-500 font-bold"
                value={producto.nombre}
                onChange={(e) =>
                  setProducto({ ...producto, nombre: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio $"
                  className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl outline-none focus:border-orange-500 font-bold"
                  value={producto.precio}
                  onChange={(e) =>
                    setProducto({ ...producto, precio: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl outline-none focus:border-orange-500 font-bold"
                  value={producto.categoria}
                  onChange={(e) =>
                    setProducto({ ...producto, categoria: e.target.value })
                  }
                  required
                />
              </div>

              {/* GESTIÓN DE TALLES */}
              <div className="bg-orange-600/5 p-4 rounded-3xl border border-orange-600/20 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-orange-500 uppercase ml-1">
                    Talle
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[#020617] border border-slate-800 rounded-xl text-center font-black"
                    value={inputTalle}
                    onChange={(e) => setInputTalle(e.target.value)}
                    placeholder="L, XL, 42..."
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-orange-500 uppercase ml-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-[#020617] border border-slate-800 rounded-xl text-center font-black"
                    value={inputCantidad}
                    onChange={(e) => setInputCantidad(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={agregarTalleALista}
                  className="bg-orange-600 h-12 px-6 rounded-xl font-black text-white hover:scale-105 transition-all"
                >
                  +
                </button>
              </div>

              <textarea
                placeholder="Descripción del producto..."
                className="w-full p-4 bg-[#020617] border border-slate-800 rounded-2xl h-24 outline-none focus:border-orange-500"
                value={producto.descripcion}
                onChange={(e) =>
                  setProducto({ ...producto, descripcion: e.target.value })
                }
                required
              />

              <div className="flex gap-4">
                <div className="flex-1 relative bg-slate-800 rounded-2xl p-4 text-center border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple // Permite seleccionar varias fotos
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setImagenesFiles(Array.from(e.target.files))
                    }
                    accept="image/*"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    {imagenesFiles.length > 0
                      ? `✅ ${imagenesFiles.length} fotos`
                      : "📸 Subir Fotos (Max 5)"}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`flex-[1.5] py-4 rounded-2xl font-black uppercase text-white shadow-lg transition-all ${
                    editando ? "bg-blue-600" : "bg-orange-600"
                  }`}
                >
                  {editando ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>

          {/* LISTADO */}
          <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col h-212.5">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="🔍 Buscar producto..."
                className="flex-1 p-3 bg-[#020617] border border-slate-800 rounded-xl text-sm outline-none focus:border-orange-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select
                className="bg-[#020617] border border-slate-800 rounded-xl px-4 text-xs font-bold text-orange-500"
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
              {productosFiltrados.map((p) => {
                const stockTotalProd =
                  p.tallas?.reduce((a, t) => a + Number(t.stock), 0) || 0;
                return (
                  <div
                    key={p._id}
                    className="bg-[#020617] border border-slate-800 p-4 rounded-2xl hover:border-orange-600/30 transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={`http://localhost:5000${p.imagenUrl}`}
                        className="w-20 h-20 object-contain bg-slate-900 rounded-xl border border-slate-800"
                        alt={p.nombre}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-xs uppercase text-white group-hover:text-orange-500 transition-colors">
                              {p.nombre}
                            </h3>
                            <p className="text-[9px] text-slate-500 font-bold">
                              {p.categoria}
                            </p>
                          </div>
                          <span className="text-orange-500 font-black text-sm">
                            ${Number(p.precio).toLocaleString("es-CL")}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tallas?.map((t, idx) => (
                            <span
                              key={idx}
                              className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                                t.stock < LIMITE_STOCK_BAJO
                                  ? "border-red-600/50 text-red-500 bg-red-500/5"
                                  : "border-slate-800 text-slate-400"
                              }`}
                            >
                              {t.talle}: {t.stock}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/50">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              stockTotalProd < LIMITE_STOCK_BAJO
                                ? "bg-red-600 text-white"
                                : "bg-green-600/10 text-green-500"
                            }`}
                          >
                            {stockTotalProd < LIMITE_STOCK_BAJO
                              ? "STOCK CRÍTICO"
                              : `TOTAL: ${stockTotalProd} UDS`}
                          </span>
                          <div className="flex gap-4">
                            <button
                              onClick={() => prepararEdicion(p)}
                              className="text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarProd(p._id)}
                              className="text-slate-500 hover:text-red-500 text-[10px] font-black uppercase"
                            >
                              Borrar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
