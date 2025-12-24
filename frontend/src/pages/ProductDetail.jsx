import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexImagen, setIndexImagen] = useState(0);

  // Estados para la Lupa
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const WHATSAPP_NUMBER = "+542944682812";

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/productos/${id}`);
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
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomPos({ x, y });
    setZoomStyle({
      display: "block",
      backgroundImage: `url(http://localhost:5000${producto.imagenes[indexImagen]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "1000%",
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
        <div className="w-12 h-12 border-4 border-[#24A35A]/20 border-t-[#24A35A] rounded-full animate-spin"></div>
        <span className="text-white font-black uppercase text-[10px] tracking-[0.4em]">
          Cargando Especificaciones...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-2 text-slate-500 hover:text-[#24A35A] transition-all uppercase text-[10px] font-black tracking-[0.3em] group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Volver al Catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          <div className="space-y-6">
            <div
              className="relative aspect-square bg-slate-950 rounded-[40px] border border-slate-800 flex items-center justify-center overflow-hidden cursor-crosshair group/zoom"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ display: "none" })}
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#24A35A]/5 to-transparent pointer-events-none" />

              {producto.imagenes?.length > 0 && (
                <img
                  src={`http://localhost:5000${producto.imagenes[indexImagen]}`}
                  alt={producto.nombre}
                  className="w-full h-full object-contain p-6 transition-transform duration-500"
                />
              )}

              {/* LUPA FLOTANTE */}
              <div
                className="absolute pointer-events-none border-2 border-[#24A35A] rounded-full shadow-[0_0_50px_rgba(0,0,0,0.9)] z-50 bg-slate-900"
                style={{
                  ...zoomStyle,
                  width: "150px",
                  height: "150px",
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  position: "absolute",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-4 px-2">
              {producto.imagenes?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndexImagen(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    indexImagen === i
                      ? "border-[#24A35A] scale-105"
                      : "border-slate-800 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`http://localhost:5000${img}`}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="flex flex-col py-2">
            <div className="mb-8">
              <span className="text-[#24A35A] font-black uppercase tracking-[0.5em] text-[10px] bg-[#24A35A]/10 px-4 py-2 rounded-lg border border-[#24A35A]/20">
                {producto.categoria}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase mt-6 leading-none tracking-tighter italic">
                {producto.nombre}
              </h1>
            </div>

            <div className="bg-slate-900/30 border-l-4 border-[#E67E22] p-8 rounded-r-3xl mb-10">
              <p className="text-slate-300 leading-relaxed text-lg italic">
                "{producto.descripcion}"
              </p>
            </div>

            {/* GRID DE TALLES */}
            <div className="mb-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                Inventario por Talle{" "}
                <div className="h-px flex-1 bg-slate-800"></div>
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {producto.tallas?.map((t, index) => (
                  <div
                    key={index}
                    className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 transition-colors hover:border-slate-600"
                  >
                    <div className="text-[9px] text-slate-500 font-bold uppercase">
                      Talle
                    </div>
                    <div className="text-2xl font-black text-white">
                      {t.talle}
                    </div>
                    <div
                      className={`text-[9px] font-black mt-2 py-1 rounded-md uppercase ${
                        t.stock > 0
                          ? "text-[#24A35A] bg-[#24A35A]/5"
                          : "text-red-500 bg-red-500/5"
                      }`}
                    >
                      {t.stock} Uds.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACCIONES FINALES */}
            <div className="mt-auto pt-8 border-t border-slate-800/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-5xl font-black text-white tracking-tighter">
                    ${Number(producto.precio).toLocaleString("es-AR")}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                    Precio Neto Unitario
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#E67E22]">
                    {totalStock}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    Unidades Totales
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={descargarFichaPDF}
                  className="bg-[#24A35A] hover:bg-[#1e8549] text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-[#24A35A]/10 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 active:scale-95"
                >
                  Descargar Ficha Técnica PDF
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Consulta Técnica: ${producto.nombre}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-slate-700 text-slate-300 hover:border-[#24A35A] hover:text-[#24A35A] font-black py-6 rounded-2xl transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 active:scale-95"
                >
                  Consultar con Asesor
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
