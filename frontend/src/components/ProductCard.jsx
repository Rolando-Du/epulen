import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  id,
  name,
  category,
  subcategory,
  description,
  image,
  price,
}) => {
  const API_URL =
    import.meta.env.VITE_API_URL || "";

  const mainImageUrl = (() => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_URL}${image}`;
  })();

  const formattedPrice =
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#D9DED5] bg-[#FCFBF8] transition-all duration-300 hover:-translate-y-1 hover:border-[#B7C1B4] hover:shadow-[0_22px_55px_rgba(36,49,40,0.09)]">
      {/* IMAGE */}

      <div className="relative flex h-64 shrink-0 items-center justify-center overflow-hidden bg-[#F5F4EF] p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#E9EDE6]/60 via-transparent to-[#EFE8E1]/30" />

        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={name}
            className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";

              const fallback =
                event.currentTarget.parentElement?.querySelector(
                  "[data-image-fallback]"
                );

              fallback?.classList.remove(
                "hidden"
              );
            }}
          />
        ) : null}

        <div
          data-image-fallback
          className={
            mainImageUrl
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

          <span className="text-xs">
            Sin imagen
          </span>
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex grow flex-col p-5 sm:p-6">
        {/* CATEGORY / SUBCATEGORY */}

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-[#E8ECE5] px-3 py-1.5 text-[11px] font-medium text-[#5B705D]">
            {category ||
              "Sin categoría"}
          </span>

          {subcategory && (
            <span className="inline-flex rounded-full border border-[#DED4CC] bg-[#F4ECE7] px-3 py-1.5 text-[11px] font-medium text-[#8B6351]">
              {subcategory}
            </span>
          )}
        </div>

        {/* NAME */}

        <h3 className="line-clamp-2 min-h-14 text-xl font-semibold leading-tight tracking-[-0.02em] text-[#29372E] transition-colors group-hover:text-[#405A47]">
          {name}
        </h3>

        {/* DESCRIPTION */}

        {description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#788078]">
            {description}
          </p>
        ) : (
          <div className="mt-2" />
        )}

        {/* FOOTER */}

        <div className="mt-auto border-t border-[#E0E4DD] pt-5">
          <div className="mb-4">
            <span className="mb-1 block text-[11px] text-[#8B948C]">
              Precio de referencia
            </span>

            <span className="text-2xl font-semibold tracking-[-0.03em] text-[#243128]">
              {formattedPrice}
            </span>
          </div>

          <Link
            to={`/product/${id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#405A47] px-5 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#334A3A] hover:shadow-[0_10px_24px_rgba(64,90,71,0.14)] active:scale-[0.99]"
          >
            Ver producto
            <span aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;