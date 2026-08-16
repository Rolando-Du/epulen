import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [
        3,
        "El nombre debe tener al menos 3 caracteres",
      ],
    },

    descripcion: {
      type: String,
      required: [
        true,
        "La descripción es obligatoria",
      ],
    },

    categoria: {
      type: String,
      required: [
        true,
        "La categoría es obligatoria",
      ],
      trim: true,
    },

    precio: {
      type: Number,
      required: [
        true,
        "El precio es obligatorio",
      ],
      min: [
        0,
        "El precio no puede ser negativo",
      ],
      set: (v) => Math.round(v),
    },

    destacado: {
      type: Boolean,
      default: false,
    },

  
    // IMÁGENES
  

    /*
    Guarda las URLs públicas.

    Productos antiguos:
    /uploads/archivo.webp

    Productos nuevos:
    https://res.cloudinary.com/...
    */
    imagenes: {
      type: [String],

      required: [
        true,
        "Al menos una imagen es obligatoria",
      ],

      validate: {
        validator: function (v) {
          return (
            Array.isArray(v) &&
            v.length > 0
          );
        },

        message:
          "Debes subir al menos una imagen",
      },
    },

    /*
    IDs internos de Cloudinary.

    Se utilizan para eliminar imágenes
    cuando se actualiza o elimina un producto.

    Los productos antiguos simplemente
    tendrán este array vacío.
    */
    imagenesPublicIds: {
      type: [String],
      default: [],
    },

  
    // TALLAS
  

    tallas: [
      {
        talle: {
          type: String,
          required: true,
        },

        stock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
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
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },

    timestamps: true,
  }
);

// MIDDLEWARES

productSchema.pre(
  "save",
  async function () {
    if (
      this.tallas &&
      this.tallas.length > 0
    ) {
      this.stockTotal =
        this.tallas.reduce(
          (acc, t) =>
            acc +
            (Number(t.stock) || 0),
          0
        );
    } else {
      this.stockTotal = 0;
    }
  }
);

// VIRTUALS

// Stock total
productSchema
  .virtual("stock")
  .get(function () {
    return this.stockTotal;
  });

// Primera imagen del producto
productSchema
  .virtual("imagenUrl")
  .get(function () {
    if (
      this.imagenes &&
      this.imagenes.length > 0
    ) {
      return this.imagenes[0];
    }

    return "";
  });

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;