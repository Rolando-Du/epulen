import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

const PROTECTION_SUBCATEGORIES = [
  "Protección visual",
  "Protección craneal",
  "Protección auditiva",
  "Protección respiratoria",
];

const normalizeCategory = (category = "") => {
  return category.trim();
};

const normalizeSubcategory = (
  category,
  subcategory = ""
) => {
  if (category !== "Protección") {
    return "";
  }

  const value = subcategory.trim();

  if (!value) {
    return "";
  }

  if (
    !PROTECTION_SUBCATEGORIES.includes(value)
  ) {
    throw new Error(
      "La subcategoría de Protección no es válida"
    );
  }

  return value;
};

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          asset_folder: "epulen/productos",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(file.buffer);
  });
};

const deleteImageFromCloudinary = async (
  publicId
) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        invalidate: true,
      }
    );
  } catch (error) {
    console.error(
      `No se pudo eliminar la imagen ${publicId} de Cloudinary:`,
      error.message
    );
  }
};

export const getProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.json(products);
  } catch (error) {
    console.error(
      "Error al obtener productos:",
      error
    );

    return res.status(500).json({
      message: "Error al obtener productos",
    });
  }
};

export const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "ID de producto no válido",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message:
          "Producto no encontrado",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error(
      "Error al buscar producto:",
      error
    );

    return res.status(500).json({
      message:
        "Error al buscar el producto",
    });
  }
};

export const createProduct = async (
  req,
  res
) => {
  const uploadedImages = [];

  try {
    const {
      name,
      description,
      category,
      subcategory,
      price,
      featured,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        message:
          "Faltan datos obligatorios del producto",
      });
    }

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        message:
          "Debes subir al menos una imagen",
      });
    }

    const normalizedCategory =
      normalizeCategory(category);

    const normalizedSubcategory =
      normalizeSubcategory(
        normalizedCategory,
        subcategory
      );

    for (const file of req.files) {
      const result =
        await uploadImageToCloudinary(
          file
        );

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      category: normalizedCategory,
      subcategory: normalizedSubcategory,
      price: Number(price),
      featured:
        featured === "true" ||
        featured === true,
      images: uploadedImages.map(
        (image) => image.url
      ),
      imagePublicIds:
        uploadedImages.map(
          (image) => image.publicId
        ),
    });

    await product.save();

    console.log(
      `Producto creado: ${product.name}`
    );

    return res
      .status(201)
      .json(product);
  } catch (error) {
    console.error(
      "Error al crear producto:",
      error
    );

    for (const image of uploadedImages) {
      await deleteImageFromCloudinary(
        image.publicId
      );
    }

    return res.status(400).json({
      message:
        error.message ||
        "Error al crear producto",
    });
  }
};

export const updateProduct = async (
  req,
  res
) => {
  const newUploadedImages = [];

  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "ID no válido",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message:
          "No existe el producto",
      });
    }

    const previousPublicIds = [
      ...(product.imagePublicIds || []),
    ];

    if (req.body.name) {
      product.name =
        req.body.name.trim();
    }

    if (req.body.description) {
      product.description =
        req.body.description.trim();
    }

    let finalCategory =
      product.category;

    if (req.body.category) {
      finalCategory =
        normalizeCategory(
          req.body.category
        );

      product.category =
        finalCategory;
    }

    if (
      finalCategory !== "Protección"
    ) {
      product.subcategory = "";
    } else if (
      req.body.subcategory !==
      undefined
    ) {
      product.subcategory =
        normalizeSubcategory(
          finalCategory,
          req.body.subcategory
        );
    }

    if (
      req.body.price !== undefined
    ) {
      product.price = Number(
        req.body.price
      );
    }

    if (
      req.body.featured !== undefined
    ) {
      product.featured =
        req.body.featured === "true" ||
        req.body.featured === true;
    }

    if (
      req.files &&
      req.files.length > 0
    ) {
      for (const file of req.files) {
        const result =
          await uploadImageToCloudinary(
            file
          );

        newUploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }

      product.images =
        newUploadedImages.map(
          (image) => image.url
        );

      product.imagePublicIds =
        newUploadedImages.map(
          (image) => image.publicId
        );
    }

    await product.save();

    if (
      newUploadedImages.length > 0
    ) {
      for (
        const publicId of
        previousPublicIds
      ) {
        await deleteImageFromCloudinary(
          publicId
        );
      }
    }

    console.log(
      `Producto actualizado: ${product.name}`
    );

    return res.json(product);
  } catch (error) {
    console.error(
      "Error al actualizar producto:",
      error
    );

    for (
      const image of
      newUploadedImages
    ) {
      await deleteImageFromCloudinary(
        image.publicId
      );
    }

    return res.status(500).json({
      message:
        error.message ||
        "Error interno al actualizar",
    });
  }
};

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "ID no válido",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message:
          "Producto no encontrado",
      });
    }

    const publicIds = [
      ...(product.imagePublicIds || []),
    ];

    await product.deleteOne();

    for (const publicId of publicIds) {
      await deleteImageFromCloudinary(
        publicId
      );
    }

    console.log(
      `Producto eliminado: ${product.name}`
    );

    return res.json({
      message:
        "Eliminado correctamente",
    });
  } catch (error) {
    console.error(
      "Error al eliminar producto:",
      error
    );

    return res.status(500).json({
      message:
        "Error al eliminar",
    });
  }
};