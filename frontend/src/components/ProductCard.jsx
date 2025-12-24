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
    : `http://localhost:5000${imagen}`;

  return (
    /* h-full permite que la card estire al alto de la fila si usas grid en el padre */
    <div className="group relative flex flex-col h-full bg-slate-900/40 border border-slate-800 rounded-4xl overflow-hidden hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Badge de Stock */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 ${
            stockTotal > 0
              ? "bg-green-500 text-black shadow-green-500/20"
              : "bg-red-600 text-white shadow-red-600/20"
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

      {/* Contenedor de Imagen - Aspecto fijo */}
      <div className="aspect-square bg-slate-950/50 p-6 flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-tr from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <img
          src={urlImagenPrincipal}
          alt={nombre}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/400?text=Sin+Imagen")
          }
        />
      </div>

      {/* Cuerpo de la Card - flex-grow para empujar el footer hacia abajo */}
      <div className="p-6 flex flex-col grow text-left">
        <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
          {categoria}
        </span>

        {/* Título con altura fija (2 líneas máximo) */}
        <h3 className="text-xl font-black text-white uppercase italic leading-tight mb-2 group-hover:text-orange-500 transition-colors line-clamp-2 h-12">
          {nombre}
        </h3>

        {/* Descripción con altura fija (2 líneas máximo) */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-5 font-medium h-8">
          {descripcion}
        </p>

        {/* Sección de Talles - Altura mínima para que no salten las cards */}
        <div className="mb-6 min-h-17.5">
          <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest mb-2">
            Talles Disponibles
          </p>
          <div className="flex flex-wrap gap-2">
            {tallas?.slice(0, 8).map(
              (
                t,
                i 
              ) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center min-w-10 h-11 rounded-xl border transition-all duration-300 ${
                    t.stock > 0
                      ? "bg-slate-800/50 border-slate-700 text-white"
                      : "bg-slate-900/20 border-slate-800 text-slate-600 opacity-50"
                  }`}
                >
                  <span className="text-[11px] font-black italic">
                    T{t.talle}
                  </span>
                  <span
                    className={`text-[8px] font-bold ${
                      t.stock > 0 ? "text-orange-500" : "text-slate-700"
                    }`}
                  >
                    {t.stock}u
                  </span>
                </div>
              )
            )}
            {tallas?.length > 4 && (
              <span className="text-[10px] text-slate-600 self-center">
                ...
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-baseline justify-between border-t border-slate-800 pt-4">
            <span className="text-2xl font-black text-white tracking-tighter">
              ${Number(precio).toLocaleString("es-CL")}
            </span>
            <span className="text-slate-500 text-[10px] font-bold uppercase">
              Neto
            </span>
          </div>

          <Link
            to={`/producto/${id}`}
            className="group/btn relative w-full overflow-hidden text-center bg-orange-600 text-white font-black py-4 rounded-2xl transition-all duration-300 uppercase text-[11px] tracking-[0.2em] hover:shadow-[0_15px_30px_rgba(234,88,12,0.3)] hover:-translate-y-1"
          >
            <span className="relative z-10 italic">Ver Especificaciones</span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
