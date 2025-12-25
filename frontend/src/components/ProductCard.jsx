import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  id,
  nombre,
  categoria,
  descripcion,
  imagen,
  tallas,
  precio,
}) => {
  const stockTotal = tallas?.reduce((acc, t) => acc + Number(t.stock), 0) || 0;
  const urlImagenPrincipal = imagen?.startsWith("http")
    ? imagen
    : `${import.meta.env.VITE_API_URL}${imagen}`;

  return (
    /* Aumentamos a h-[660px] para que nombres de 2 líneas respiren bien */
    <div className="group relative flex flex-col h-165 bg-slate-900/40 border border-slate-800 rounded-4xl overflow-hidden hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Badge de Stock */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 ${
            stockTotal > 0 ? "bg-green-500 text-black" : "bg-red-600 text-white"
          }`}
        >
          {stockTotal > 0 && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
          )}
          {stockTotal > 0 ? `STOCK: ${stockTotal} UDS` : "SIN STOCK"}
        </span>
      </div>

      {/* Imagen con "Aire" (Padding) para evitar que toquen los bordes */}
      <div className="h-64 bg-slate-950/50 p-12 flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-tr from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <img
          src={urlImagenPrincipal}
          alt={nombre}
          className="max-w-full max-h-full w-auto h-auto object-contain transition-all duration-700 scale-90 group-hover:scale-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/400?text=Sin+Imagen")
          }
        />
      </div>

      {/* Cuerpo de la Card */}
      <div className="p-6 flex flex-col grow text-left">
        <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
          {categoria}
        </span>

        {/* h-16 permite 2 líneas de texto grandes sin empujar el resto */}
        <h3 className="text-xl font-black text-white uppercase italic leading-[1.15] mb-3 group-hover:text-orange-500 transition-colors line-clamp-2 h-16 overflow-hidden tracking-tighter">
          {nombre}
        </h3>

        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mb-4 font-medium h-10 opacity-80">
          {descripcion}
        </p>

        {/* Talles */}
        <div className="mb-4">
          <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-2 flex items-center gap-2">
            Talles Disponibles <span className="h-px grow bg-slate-800"></span>
          </p>
          <div className="flex flex-wrap gap-2 h-12">
            {tallas?.slice(0, 4).map((t, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center min-w-12 h-11 rounded-xl border transition-all duration-300 ${
                  t.stock > 0
                    ? "bg-slate-800/50 border-slate-700 text-white"
                    : "bg-slate-900/20 border-slate-800 text-slate-600 opacity-40"
                }`}
              >
                <span className="text-[10px] font-black italic">
                  T{t.talle}
                </span>
                <span
                  className={`text-[7px] font-bold ${
                    t.stock > 0 ? "text-orange-500" : "text-slate-700"
                  }`}
                >
                  {t.stock}u
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER - Aquí corregimos el error del botón y el desborde */}
        <div className="mt-auto pt-5 border-t border-slate-800/60">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="block text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">
                Precio Unitario
              </span>
              <span className="text-3xl font-black text-white tracking-tighter italic leading-none">
                ${Number(precio).toLocaleString("es-AR")}
              </span>
            </div>
            <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest border border-slate-800 px-2 py-1 rounded-md">
              NETO
            </span>
          </div>

          {/* BOTÓN CORREGIDO: overflow-hidden y ancho exacto */}
          <Link
            to={`/producto/${id}`}
            className="group/btn relative w-full flex items-center justify-center bg-orange-600 text-white font-black py-4 rounded-2xl transition-all duration-300 uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-orange-900/20 overflow-hidden hover:-translate-y-1 active:scale-95"
          >
            <span className="relative z-10 italic">Ver Especificaciones</span>

            {/* El efecto de brillo (Shimmer) ahora está contenido dentro del botón */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div
                className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
