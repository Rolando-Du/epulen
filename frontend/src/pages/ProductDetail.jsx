import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexImagen, setIndexImagen] = useState(0);

  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const API_URL = import.meta.env.VITE_API_URL || "";
  const WHATSAPP_NUMBER = "+542944682812";

  const resolverImagen = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${API_URL}${src}`;
  };

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);

        if (!res.ok) {
          setProducto(null);
          return;
        }

        const data = await res.json();
        setProducto(data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        setProducto(null);
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

    const imagenActual = resolverImagen(producto.imagenes[indexImagen]);

    setZoomPos({ x, y });
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${imagenActual})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "500%",
    });
  };

  const totalStock =
    producto?.tallas?.reduce((acc, t) => acc + Number(t.stock || 0), 0) || 0;

  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(producto?.precio || 0));

  const descargarFichaPDF = () => {
    const doc = new jsPDF();

    const precioPDF = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(producto.precio || 0));

    doc.setFillColor(64, 90, 71);
    doc.rect(0, 0, 210, 42, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("EPULÉN SEGURIDAD INDUSTRIAL", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(228, 233, 225);
    doc.text("Ficha técnica de producto", 14, 26);

    doc.setDrawColor(154, 103, 80);
    doc.setLineWidth(1.2);
    doc.line(14, 34, 62, 34);

    doc.setTextColor(36, 49, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);

    const nombreProducto = doc.splitTextToSize(
      String(producto.nombre || "Producto"),
      180
    );
    doc.text(nombreProducto, 14, 58);

    const offsetNombre = Array.isArray(nombreProducto)
      ? nombreProducto.length * 9
      : 9;

    let y = 58 + offsetNombre + 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(87, 101, 89);

    doc.text(`Categoría: ${producto.categoria || "Sin categoría"}`, 14, y);
    y += 8;

    doc.text(`Precio de referencia: ${precioPDF}`, 14, y);
    y += 8;

    doc.text(`Stock general: ${totalStock} unidades`, 14, y);
    y += 16;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(36, 49, 40);
    doc.text("Descripción", 14, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 84, 77);

    const splitDesc = doc.splitTextToSize(
      producto.descripcion || "Sin descripción disponible.",
      180
    );
    doc.text(splitDesc, 14, y);

    doc.setDrawColor(218, 223, 215);
    doc.line(14, 278, 196, 278);

    doc.setFontSize(8);
    doc.setTextColor(130, 138, 130);
    doc.text(
      "Epulén Seguridad Industrial · Equipamiento y protección para el trabajo",
      14,
      286
    );

    doc.save(`Ficha_Epulen_${producto.nombre}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#CDD4C8] border-t-[#405A47] rounded-full animate-spin" />

        <span className="text-[#737D74] text-xs tracking-[0.16em] uppercase font-medium">
          Cargando producto...
        </span>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center px-5">
        <div className="max-w-md w-full bg-[#FCFBF8] border border-[#D8DDD4] rounded-3xl p-10 text-center shadow-[0_20px_60px_rgba(36,49,40,0.08)]">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#E7EBE4] flex items-center justify-center text-[#405A47] mb-5">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M20 20 4 4m16 0L4 20"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-[#243128]">
            Producto no encontrado
          </h1>

          <p className="text-[#778078] text-sm mt-3">
            El producto puede haber sido eliminado o la dirección ya no es
            válida.
          </p>

          <button
            onClick={() => navigate("/productos")}
            className="mt-7 px-6 py-3 rounded-full bg-[#405A47] hover:bg-[#334A3A] text-white text-sm font-medium transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const imagenes = producto.imagenes || [];

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#243128]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6F796F] hover:text-[#405A47] transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          <div className="space-y-5">
            <div
              className="relative aspect-square bg-[#FCFBF8] rounded-4xl border border-[#D9DED5] flex items-center justify-center overflow-hidden cursor-crosshair group/zoom shadow-[0_20px_60px_rgba(36,49,40,0.07)]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ display: "none" })}
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#EEF1EA]/50 to-transparent pointer-events-none" />

              {imagenes.length > 0 ? (
                <img
                  src={resolverImagen(imagenes[indexImagen])}
                  alt={producto.nombre}
                  className="relative z-10 max-w-[84%] max-h-[84%] object-contain transition-opacity duration-300 group-hover/zoom:opacity-0"
                />
              ) : (
                <div className="text-center text-[#949C94]">
                  <svg
                    className="w-12 h-12 mx-auto mb-3"
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
                  <span className="text-sm">Sin imagen disponible</span>
                </div>
              )}

              {imagenes.length > 0 && (
                <div
                  className="absolute pointer-events-none border border-[#788873] rounded-full shadow-[0_20px_50px_rgba(36,49,40,0.22)] z-50 bg-[#FCFBF8] overflow-hidden"
                  style={{
                    ...zoomStyle,
                    width: "210px",
                    height: "210px",
                    left: `${zoomPos.x}%`,
                    top: `${zoomPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}

              {imagenes.length > 0 && (
                <div className="absolute bottom-5 left-5 z-20 px-3 py-2 bg-white/80 backdrop-blur-md rounded-full text-[11px] text-[#718071] border border-white">
                  Pasá el cursor para ampliar
                </div>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagenes.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setIndexImagen(i)}
                    className={[
                      "relative shrink-0 w-20 h-20 sm:w-24 sm:h-24",
                      "rounded-2xl overflow-hidden border p-2",
                      "bg-[#FCFBF8] transition-all duration-200",
                      indexImagen === i
                        ? "border-[#405A47] shadow-[0_8px_24px_rgba(64,90,71,0.12)]"
                        : "border-[#D8DDD4] opacity-65 hover:opacity-100 hover:border-[#A8B3A5]",
                    ].join(" ")}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img
                      src={resolverImagen(img)}
                      className="w-full h-full object-contain"
                      alt={`${producto.nombre} ${i + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-7">
              <span className="inline-flex items-center px-3.5 py-2 rounded-full bg-[#E5EAE2] text-[#526553] text-xs font-medium mb-5">
                {producto.categoria}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#243128] leading-[1.02] tracking-[-0.045em]">
                {producto.nombre}
              </h1>
            </div>

            <div className="bg-[#FAF9F5] border border-[#DCE1D8] p-6 sm:p-7 rounded-3xl mb-10">
              <p className="text-[#616B63] leading-relaxed text-base sm:text-lg">
                {producto.descripcion}
              </p>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-4 mb-5">
                <h3 className="text-xs font-semibold text-[#667168] uppercase tracking-[0.16em] whitespace-nowrap">
                  Disponibilidad por talle
                </h3>
                <div className="h-px w-full bg-[#D8DDD4]" />
              </div>

              {producto.tallas?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {producto.tallas.map((t, index) => (
                    <div
                      key={`${t.talle}-${index}`}
                      className="bg-[#FCFBF8] border border-[#D8DDD4] rounded-2xl p-4 transition-all hover:border-[#A9B4A6]"
                    >
                      <div className="text-xs text-[#899189] mb-1">Talle</div>

                      <div className="text-2xl font-semibold text-[#2F3D33]">
                        {t.talle}
                      </div>

                      <div
                        className={[
                          "mt-3 py-1.5 px-2 rounded-lg text-xs text-center font-medium",
                          Number(t.stock) > 0
                            ? "text-[#4E6854] bg-[#E8EEE6]"
                            : "text-[#965C52] bg-[#F3E6E2]",
                        ].join(" ")}
                      >
                        {Number(t.stock) > 0
                          ? `${t.stock} unidades`
                          : "Sin stock"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FAF9F5] border border-dashed border-[#CBD2C8] rounded-2xl p-5 text-sm text-[#7B847C]">
                  No hay información de talles disponible.
                </div>
              )}
            </div>

            <div className="mt-auto bg-[#FCFBF8] border border-[#D8DDD4] p-6 sm:p-8 rounded-[28px] shadow-[0_18px_50px_rgba(36,49,40,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
                <div>
                  <div className="text-xs text-[#7C857D] mb-2">
                    Precio de referencia
                  </div>

                  <div className="text-4xl sm:text-5xl font-semibold text-[#243128] tracking-[-0.04em]">
                    {precioFormateado}
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-2xl font-semibold text-[#788873] leading-none">
                    {totalStock}
                  </div>

                  <div className="text-xs text-[#8C958D] mt-1">
                    unidades en stock
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={descargarFichaPDF}
                  className="border border-[#C9D0C6] bg-[#F7F6F2] hover:bg-[#ECEFE9] text-[#3D4A40] font-medium py-4 px-5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
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
                      d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Descargar ficha
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hola, quisiera solicitar una cotización por ${producto.nombre} (ID: ${
                      producto._id || producto.id || id
                    }).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#405A47] hover:bg-[#334A3A] text-white font-medium py-4 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(64,90,71,0.14)] active:scale-[0.99]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  Solicitar cotización
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