import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexImagen, setIndexImagen] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  // Estados para la Lupa
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const WHATSAPP_NUMBER = "+542944682812";

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProducto(data);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProducto();
  }, [id, API_URL]);

  const handleMouseMove = (e) => {
    if (!producto?.imagenes?.length) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomPos({ x, y });
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${API_URL}${producto.imagenes[indexImagen]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "600%", // Zoom equilibrado para ver texturas
    });
  };

  const totalStock =
    producto?.tallas?.reduce((acc, t) => acc + Number(t.stock), 0) || 0;

  const descargarFichaPDF = () => {
    const doc = new jsPDF();
    const precioFormateado = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(producto.precio);

    // Estilo PDF (Mantenido)
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 40, "F");
    doc.setFontSize(18);
    doc.setTextColor(36, 163, 90);
    doc.setFont("helvetica", "bold");
    doc.text("EPULEN SEGURIDAD INDUSTRIAL", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("FICHA TÉCNICA DE PRODUCTO CERTIFICADO", 14, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text(producto.nombre.toUpperCase(), 14, 60);
    doc.setDrawColor(230, 126, 34);
    doc.line(14, 65, 60, 65);
    doc.setFontSize(12);
    doc.text(`Categoría: ${producto.categoria}`, 14, 80);
    doc.text(`Precio Ref: ${precioFormateado} (Neto)`, 14, 90);
    doc.setFont("helvetica", "bold");
    doc.text("Descripción Técnica:", 14, 110);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(producto.descripcion, 180);
    doc.text(splitDesc, 14, 120);
    doc.save(`Ficha_Epulen_${producto.nombre}.pdf`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <span className="text-white font-black uppercase text-[10px] tracking-[0.4em]">
          Sincronizando Detalles...
        </span>
      </div>
    );

  if (!producto)
    return (
      <div className="text-white text-center mt-20 font-black">
        PRODUCTO NO ENCONTRADO
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-all uppercase text-[10px] font-black tracking-[0.3em] group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          VOLVER AL CATÁLOGO
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 items-start">
          {/* SECCIÓN IMÁGENES */}
          <div className="space-y-6">
            {/* Contenedor Principal: Ahora con fondo sólido y padding para evitar cortes */}
            <div
              className="relative aspect-square bg-slate-950/80 rounded-[40px] border border-slate-800 flex items-center justify-center overflow-hidden cursor-crosshair group/zoom shadow-2xl"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ display: "none" })}
            >
              <div className="absolute inset-0 bg-linear-to-tr from-orange-500/5 to-transparent pointer-events-none" />

              {producto.imagenes?.length > 0 && (
                <img
                  src={`${API_URL}${producto.imagenes[indexImagen]}`}
                  alt={producto.nombre}
                  className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-700 group-hover:opacity-0"
                />
              )}

              {/* LUPA MEJORADA */}
              <div
                className="absolute pointer-events-none border-2 border-orange-500 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.9)] z-50 bg-slate-900 overflow-hidden"
                style={{
                  ...zoomStyle,
                  width: "220px",
                  height: "220px",
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>

            {/* Carrusel de Miniaturas */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {producto.imagenes?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndexImagen(i)}
                  className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-2 bg-slate-950 ${
                    indexImagen === i
                      ? "border-orange-500 scale-105"
                      : "border-slate-800 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`${API_URL}${img}`}
                    className="w-full h-full object-contain"
                    alt="preview"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN TEXTOS */}
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <span className="inline-block text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 mb-6">
                {producto.categoria}
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tighter italic drop-shadow-lg">
                {producto.nombre}
              </h1>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border-l-4 border-orange-500 p-8 rounded-r-3xl mb-10 shadow-xl">
              <p className="text-slate-300 leading-relaxed text-lg font-medium italic">
                "{producto.descripcion}"
              </p>
            </div>

            {/* TABLA DE STOCK POR TALLE */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
                  {" "}
                  DISPONIBILIDAD TÉCNICA{" "}
                </h3>
                <div className="h-px w-full bg-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {producto.tallas?.map((t, index) => (
                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 group hover:border-orange-500/50 transition-all"
                  >
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                      Talle
                    </div>
                    <div className="text-3xl font-black text-white italic">
                      {" "}
                      {t.talle}{" "}
                    </div>
                    <div
                      className={`text-[10px] font-black mt-3 py-1.5 rounded-lg uppercase text-center ${
                        t.stock > 0
                          ? "text-green-400 bg-green-400/10"
                          : "text-red-500 bg-red-500/10"
                      }`}
                    >
                      {t.stock > 0 ? `${t.stock} Unidades` : "Sin Stock"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOQUE DE PRECIO Y ACCIONES */}
            <div className="mt-auto bg-slate-900/20 border border-slate-800 p-8 rounded-4xl">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2">
                    Inversión Neta
                  </div>
                  <div className="text-6xl font-black text-white tracking-tighter italic">
                    ${Number(producto.precio).toLocaleString("es-AR")}
                  </div>
                </div>
                <div className="text-right pb-2">
                  <div className="text-3xl font-black text-orange-500 leading-none">
                    {totalStock}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                    Stock General
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={descargarFichaPDF}
                  className="bg-white text-black hover:bg-orange-500 hover:text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3 shadow-xl active:scale-95"
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
                      strokeWidth="3"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Descargar Ficha
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hola! Solicito cotización técnica para: ${producto.nombre} (ID: ${producto.id})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20 active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  Cotizar Ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
