import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [
        3,
        "El nombre debe tener al menos 3 caracteres",
      ],
    },

    description: {
      type: String,
      required: [
        true,
        "La descripción es obligatoria",
      ],
      trim: true,
    },

    category: {
      type: String,
      required: [
        true,
        "La categoría es obligatoria",
      ],
      trim: true,
    },

    subcategory: {
      type: String,
      trim: true,
      default: "",
      enum: [
        "",
        "Protección visual",
        "Protección craneal",
        "Protección auditiva",
        "Protección respiratoria",
      ],
    },

    price: {
      type: Number,
      required: [
        true,
        "El precio es obligatorio",
      ],
      min: [
        0,
        "El precio no puede ser negativo",
      ],
      set: (value) => Math.round(value),
    },

    featured: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [String],
      required: [
        true,
        "Al menos una imagen es obligatoria",
      ],
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length > 0
          );
        },
        message:
          "Debes subir al menos una imagen",
      },
    },

    imagePublicIds: {
      type: [String],
      default: [],
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

productSchema
  .virtual("imageUrl")
  .get(function () {
    if (
      this.images &&
      this.images.length > 0
    ) {
      return this.images[0];
    }

    return "";
  });

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;