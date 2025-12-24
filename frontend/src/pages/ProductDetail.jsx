import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexImagen, setIndexImagen] = useState(0);

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

  const totalStock =
    producto?.tallas?.reduce((acc, t) => acc + Number(t.stock), 0) || 0;

  const descargarFichaPDF = () => {
    const doc = new jsPDF();

    // CORRECCIÓN: Ahora 'precioFormateado' se usa debajo
    const precioFormateado = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(producto.precio);

    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12);
    doc.text("FICHA TÉCNICA DE SEGURIDAD", 14, 20);

    doc.setDrawColor(200);
    doc.line(14, 25, 196, 25);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Producto: ${producto.nombre}`, 14, 40);

    doc.setFontSize(12);
    doc.text(`Categoría: ${producto.categoria}`, 14, 50);

    // USO DE LA VARIABLE: Esto elimina el error del linter
    doc.text(`Precio: ${precioFormateado} (Neto)`, 14, 60);

    doc.text(`Descripción:`, 14, 75);
    const splitDesc = doc.splitTextToSize(producto.descripcion, 180);
    doc.text(splitDesc, 14, 82);

    doc.text(`Disponibilidad por Talla:`, 14, 110);
    let yPos = 117;
    producto.tallas.forEach((t) => {
      doc.text(`- Talle ${t.talle}: ${t.stock} unidades`, 20, yPos);
      yPos += 7;
    });

    doc.save(`Ficha_${producto.nombre}.pdf`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black uppercase text-xs">
        Sincronizando...
      </div>
    );

  if (!producto)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Producto no encontrado.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors uppercase text-xs font-black tracking-widest"
        >
          ← Volver al Catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          {/* SECCIÓN IZQUIERDA: GALERÍA */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 flex items-center justify-center relative overflow-hidden group h-125">
              <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {/* Validación para evitar errores si producto.imagenes no existe */}
              {producto.imagenes && producto.imagenes.length > 0 && (
                <img
                  src={`http://localhost:5000${producto.imagenes[indexImagen]}`}
                  alt={producto.nombre}
                  className="max-h-full object-contain transition-all duration-500 group-hover:scale-105"
                />
              )}
            </div>

            {/* Selector de Miniaturas */}
            <div className="grid grid-cols-4 gap-4">
              {producto.imagenes?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndexImagen(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    indexImagen === i
                      ? "border-orange-600 scale-95 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                      : "border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`http://localhost:5000${img}`}
                    className="w-full h-full object-cover"
                    alt={`Vista ${i + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN DERECHA: INFORMACIÓN */}
          <div className="flex flex-col">
            <span className="text-orange-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
              Equipo de Protección Certificado
            </span>
            <h1 className="text-5xl font-black text-white uppercase mb-6 leading-none italic tracking-tighter">
              {producto.nombre}
            </h1>

            <div className="bg-[#020617] border-l-4 border-orange-600 p-6 rounded-r-2xl mb-8">
              <p className="text-slate-400 leading-relaxed text-sm italic">
                {producto.descripcion}
              </p>
            </div>

            {/* SECCIÓN DE TALLAS */}
            <div className="mb-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                Configuración de Tallas y Stock
              </h3>
              <div className="flex flex-wrap gap-3">
                {producto.tallas?.map((t, index) => (
                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-w-20 text-center shadow-inner"
                  >
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">
                      Talle
                    </div>
                    <div className="text-xl font-black text-white">
                      {t.talle}
                    </div>
                    <div
                      className={`text-[9px] font-bold mt-1 uppercase ${
                        t.stock > 5 ? "text-green-500" : "text-orange-500"
                      }`}
                    >
                      {t.stock} Uds
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between py-6 border-y border-slate-800/50">
                <div>
                  <div className="text-4xl font-black text-white tracking-tighter">
                    ${Number(producto.precio).toLocaleString("es-CL")}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                    Precio Neto
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-orange-600">
                    {totalStock}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                    Total Bodega
                  </div>
                </div>
              </div>

              <button
                onClick={descargarFichaPDF}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95"
              >
                Generar Ficha Técnica PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
