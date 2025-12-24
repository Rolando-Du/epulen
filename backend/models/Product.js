import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
      set: (v) => Math.round(v),
    },
    // CAMBIO: Ahora es un array para soportar múltiples fotos estilo Mercado Libre
    imagenes: [
      {
        type: String,
        required: [true, "Al menos una imagen es obligatoria"],
      },
    ],
    tallas: [
      {
        talle: { type: String, required: true },
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],
    stockTotal: {
      type: Number,
      default: 0,
    },
    creadoEn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware para calcular stock total automáticamente
productSchema.pre("save", function () {
  if (this.tallas && this.tallas.length > 0) {
    this.stockTotal = this.tallas.reduce(
      (acc, t) => acc + (Number(t.stock) || 0),
      0
    );
  } else {
    this.stockTotal = 0;
  }
});

// Virtual para el stock (compatibilidad frontend)
productSchema.virtual("stock").get(function () {
  return this.stockTotal;
});

// VIRTUAL ESTRATÉGICO:
// Esto hace que si pides "imagenUrl", el modelo te devuelva la primera imagen del array.
// Así el catálogo y el dashboard seguirán mostrando la foto principal sin errores.
productSchema.virtual("imagenUrl").get(function () {
  return this.imagenes && this.imagenes.length > 0 ? this.imagenes[0] : "";
});

const Product = mongoose.model("Product", productSchema);
export default Product;
