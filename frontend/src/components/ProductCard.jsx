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
  const API_URL = import.meta.env.VITE_API_URL || "";

  const stockTotal =
    tallas?.reduce(
      (acc, t) => acc + Number(t.stock || 0),
      0
    ) || 0;

  const urlImagenPrincipal = (() => {
    if (!imagen) return "";
    if (
      imagen.startsWith("http://") ||
      imagen.startsWith("https://")
    ) {
      return imagen;
    }

    return `${API_URL}${imagen}`;
  })();

  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(precio || 0));

  const normalizarTalle = (talle) => {
    if (!talle) return "-";

    const valor = String(talle).trim().toUpperCase();

    if (valor.startsWith("T-")) {
      return valor;
    }

    return `T-${valor.replace(/^T/, "").replace(/^-/, "")}`;
  };

  return (
    <article className="group relative flex h-full min-h-140 flex-col overflow-hidden rounded-[28px] border border-[#D9DED5] bg-[#FCFBF8] transition-all duration-300 hover:-translate-y-1 hover:border-[#B7C1B4] hover:shadow-[0_22px_55px_rgba(36,49,40,0.09)]">
      {/* STOCK */}
      <div className="absolute right-4 top-4 z-20">
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md",
            stockTotal > 0
              ? "border-[#CED8CB] bg-[#F2F6F0]/95 text-[#526D57]"
              : "border-[#E4D2CE] bg-[#F8EFEC]/95 text-[#965C52]",
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              stockTotal > 0
                ? "bg-[#788873]"
                : "bg-[#A96B5F]",
            ].join(" ")}
          />

          {stockTotal > 0
            ? `${stockTotal} en stock`
            : "Sin stock"}
        </span>
      </div>

      {/* IMAGEN */}
      <div className="relative flex h-64 shrink-0 items-center justify-center overflow-hidden bg-[#F5F4EF] p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#E9EDE6]/60 via-transparent to-[#EFE8E1]/30" />

        {urlImagenPrincipal ? (
          <img
            src={urlImagenPrincipal}
            alt={nombre}
            className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback =
                e.currentTarget.parentElement?.querySelector(
                  "[data-image-fallback]"
                );
              fallback?.classList.remove("hidden");
            }}
          />
        ) : null}

        <div
          data-image-fallback
          className={
            urlImagenPrincipal
              ? "hidden text-center text-[#9AA29A]"
              : "text-center text-[#9AA29A]"
          }
        >
          <svg
            className="mx-auto mb-3 h-10 w-10"
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

          <span className="text-xs">Sin imagen</span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex grow flex-col p-5 sm:p-6">
        <div className="mb-3">
          <span className="inline-flex rounded-full bg-[#E8ECE5] px-3 py-1.5 text-[11px] font-medium text-[#5B705D]">
            {categoria || "Sin categoría"}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-14 text-xl font-semibold leading-tight tracking-[-0.02em] text-[#29372E] transition-colors group-hover:text-[#405A47]">
          {nombre}
        </h3>

        {descripcion ? (
          <p className="mt-2 line-clamp-2 min-h-10.5 text-sm leading-relaxed text-[#788078]">
            {descripcion}
          </p>
        ) : (
          <div className="mt-2 min-h-10.5" />
        )}

        {/* TALLES */}
        <div className="mt-5">
          <div className="mb-2.5 flex items-center gap-3">
            <p className="text-[11px] font-medium text-[#7B857D]">
              Talles disponibles
            </p>

            <div className="h-px grow bg-[#E0E4DD]" />
          </div>

          <div className="flex min-h-10 flex-wrap gap-2">
            {tallas?.length > 0 ? (
              tallas.slice(0, 4).map((t, i) => (
                <div
                  key={`${t.talle}-${i}`}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs",
                    Number(t.stock) > 0
                      ? "border-[#D5DCD2] bg-[#F5F6F2] text-[#4F5F52]"
                      : "border-[#E2E3DF] bg-[#F6F5F2] text-[#A0A6A0] opacity-60",
                  ].join(" ")}
                >
                  <span className="font-medium">
                    {normalizarTalle(t.talle)}
                  </span>

                  <span className="text-[10px] text-[#919991]">
                    {Number(t.stock || 0)}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-[#9AA29A]">
                Sin información de talles
              </span>
            )}

            {tallas?.length > 4 && (
              <span className="inline-flex items-center rounded-lg border border-[#D5DCD2] bg-[#F5F6F2] px-2.5 py-1.5 text-xs text-[#687269]">
                +{tallas.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto border-t border-[#E0E4DD] pt-5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <span className="mb-1 block text-[11px] text-[#8B948C]">
                Precio de referencia
              </span>

              <span className="text-2xl font-semibold tracking-[-0.03em] text-[#243128]">
                {precioFormateado}
              </span>
            </div>
          </div>

          <Link
            to={`/producto/${id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#405A47] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#334A3A] hover:shadow-[0_10px_24px_rgba(64,90,71,0.14)] active:scale-[0.99]"
          >
            Ver producto
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;