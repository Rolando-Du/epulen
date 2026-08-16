import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// CLOUDINARY

const subirImagenCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",

          // Tu cuenta utiliza Dynamic folders
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

// ELIMINAR IMAGEN DE CLOUDINARY

const eliminarImagenCloudinary = async (
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
      `⚠️ No se pudo eliminar la imagen ${publicId} de Cloudinary:`,
      error.message
    );
  }
};

// ELIMINAR IMAGEN LOCAL ANTIGUA

const eliminarImagenLocal = (imgRuta) => {
  if (
    !imgRuta ||
    !imgRuta.startsWith("/uploads/")
  ) {
    return;
  }

  try {
    const nombreArchivo =
      path.basename(imgRuta);

    const rutaAbsoluta =
      path.join(
        process.cwd(),
        "uploads",
        nombreArchivo
      );

    if (fs.existsSync(rutaAbsoluta)) {
      fs.unlinkSync(rutaAbsoluta);
    }
  } catch (error) {
    console.error(
      "⚠️ No se pudo eliminar imagen local:",
      error.message
    );
  }
};

// 1. OBTENER TODOS LOS PRODUCTOS

export const obtenerProductos = async (
  req,
  res
) => {
  try {
    const productos =
      await Product.find().sort({
        creadoEn: -1,
      });

    return res.json(productos);
  } catch (error) {
    console.error(
      "❌ Error al obtener productos:",
      error
    );

    return res.status(500).json({
      msg: "Error al obtener productos",
    });
  }
};

// 2. OBTENER PRODUCTO POR ID

export const obtenerProductoPorId =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          msg: "ID de producto no válido",
        });
      }

      const producto =
        await Product.findById(id);

      if (!producto) {
        return res.status(404).json({
          msg: "Producto no encontrado",
        });
      }

      return res.json(producto);
    } catch (error) {
      console.error(
        "❌ Error al buscar producto:",
        error
      );

      return res.status(500).json({
        msg: "Error al buscar el producto",
      });
    }
  };

// 3. CREAR PRODUCTO

export const nuevoProducto = async (
  req,
  res
) => {
  const imagenesSubidas = [];

  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio,
      tallas,
      destacado,
    } = req.body;
    // VALIDACIONE

    if (
      !nombre ||
      !descripcion ||
      !categoria ||
      precio === undefined
    ) {
      return res.status(400).json({
        msg: "Faltan datos obligatorios del producto",
      });
    }

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        msg: "Debes subir al menos una imagen",
      });
    }
    // TALLA

    let tallasParseadas = [];

    try {
      tallasParseadas =
        typeof tallas === "string"
          ? JSON.parse(tallas)
          : tallas || [];

      if (
        !Array.isArray(tallasParseadas)
      ) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        msg: "Formato de tallas inválido",
      });
    }
    // SUBIR IMÁGENES A CLOUDINAR

    for (const file of req.files) {
      const resultado =
        await subirImagenCloudinary(
          file
        );

      imagenesSubidas.push({
        url: resultado.secure_url,
        publicId: resultado.public_id,
      });
    }
    // CREAR PRODUCT

    const producto = new Product({
      nombre: nombre.trim(),

      descripcion:
        descripcion.trim(),

      categoria:
        categoria.trim(),

      precio: Number(precio),

      tallas:
        tallasParseadas,

      destacado:
        destacado === "true" ||
        destacado === true,

      // URLs públicas
      imagenes:
        imagenesSubidas.map(
          (imagen) => imagen.url
        ),

      // IDs necesarios para borrar
      imagenesPublicIds:
        imagenesSubidas.map(
          (imagen) =>
            imagen.publicId
        ),
    });

    await producto.save();

    console.log(
      `✅ Producto creado: ${producto.nombre}`
    );

    return res
      .status(201)
      .json(producto);
  } catch (error) {
    console.error(
      "❌ Error en nuevoProducto:",
      error
    );
    // ROLLBACK CLOUDINAR

    /*
    Si algo falló después de haber
    subido imágenes, las eliminamos
    para no dejar archivos huérfanos.
    */

    for (
      const imagen of imagenesSubidas
    ) {
      await eliminarImagenCloudinary(
        imagen.publicId
      );
    }

    return res.status(400).json({
      msg:
        error.message ||
        "Error al crear producto",
    });
  }
};

// 4. ACTUALIZAR PRODUCTO

export const actualizarProducto =
  async (req, res) => {
    const nuevasImagenesSubidas = [];

    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          msg: "ID no válido",
        });
      }

      const producto =
        await Product.findById(id);

      if (!producto) {
        return res.status(404).json({
          msg: "No existe el producto",
        });
      }

      // GUARDAR REFERENCIAS ANTERIORES

      const imagenesAnteriores = [
        ...(producto.imagenes || []),
      ];

      const publicIdsAnteriores = [
        ...(
          producto.imagenesPublicIds ||
          []
        ),
      ];

      // ACTUALIZAR CAMPOS

      if (req.body.nombre) {
        producto.nombre =
          req.body.nombre.trim();
      }

      if (req.body.descripcion) {
        producto.descripcion =
          req.body.descripcion.trim();
      }

      if (req.body.categoria) {
        producto.categoria =
          req.body.categoria.trim();
      }

      if (
        req.body.precio !== undefined
      ) {
        producto.precio =
          Number(req.body.precio);
      }

      if (
        req.body.destacado !==
        undefined
      ) {
        producto.destacado =
          req.body.destacado ===
            "true" ||
          req.body.destacado === true;
      }

      // TALLAS

      if (
        req.body.tallas !== undefined
      ) {
        try {
          const tallasParseadas =
            typeof req.body.tallas ===
            "string"
              ? JSON.parse(
                  req.body.tallas
                )
              : req.body.tallas;

          if (
            !Array.isArray(
              tallasParseadas
            )
          ) {
            throw new Error();
          }

          producto.tallas =
            tallasParseadas;
        } catch {
          return res
            .status(400)
            .json({
              msg: "Formato de tallas inválido",
            });
        }
      }

      // NUEVAS IMÁGENES

      if (
        req.files &&
        req.files.length > 0
      ) {
        /*
        Primero subimos las nuevas.

        NO borramos las anteriores
        hasta saber que MongoDB guardó
        correctamente el producto.
        */

        for (const file of req.files) {
          const resultado =
            await subirImagenCloudinary(
              file
            );

          nuevasImagenesSubidas.push({
            url:
              resultado.secure_url,

            publicId:
              resultado.public_id,
          });
        }

        producto.imagenes =
          nuevasImagenesSubidas.map(
            (imagen) => imagen.url
          );

        producto.imagenesPublicIds =
          nuevasImagenesSubidas.map(
            (imagen) =>
              imagen.publicId
          );
      }

      // GUARDAR EN MONGODB

      await producto.save();

      // LIMPIAR IMÁGENES ANTERIORES

      if (
        nuevasImagenesSubidas.length >
        0
      ) {
        /*
        Imágenes de productos nuevos
        almacenadas en Cloudinary.
        */

        for (
          const publicId of
          publicIdsAnteriores
        ) {
          await eliminarImagenCloudinary(
            publicId
          );
        }

        /*
        Compatibilidad temporal con
        productos antiguos que todavía
        utilizan /uploads/...
        */

        for (
          const imagen of
          imagenesAnteriores
        ) {
          eliminarImagenLocal(imagen);
        }
      }

      console.log(
        `✅ Producto actualizado: ${producto.nombre}`
      );

      return res.json(producto);
    } catch (error) {
      console.error(
        "❌ Error en actualizarProducto:",
        error
      );

      // ROLLBACK

      /*
      Si falló la actualización después
      de subir nuevas imágenes, quitamos
      solamente las nuevas imágenes.
      */

      for (
        const imagen of
        nuevasImagenesSubidas
      ) {
        await eliminarImagenCloudinary(
          imagen.publicId
        );
      }

      return res.status(500).json({
        msg:
          error.message ||
          "Error interno al actualizar",
      });
    }
  };

// 5. ELIMINAR PRODUCTO

export const eliminarProducto =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          msg: "ID no válido",
        });
      }

      const producto =
        await Product.findById(id);

      if (!producto) {
        return res.status(404).json({
          msg: "Producto no encontrado",
        });
      }

      // Guardar referencias
      const imagenes = [
        ...(producto.imagenes || []),
      ];

      const publicIds = [
        ...(
          producto.imagenesPublicIds ||
          []
        ),
      ];

      // ELIMINAR DE MONGODB

      await producto.deleteOne();

      // ELIMINAR DE CLOUDINARY

      for (const publicId of publicIds) {
        await eliminarImagenCloudinary(
          publicId
        );
      }

      // COMPATIBILIDAD PRODUCTOS VIEJOS

      for (const imagen of imagenes) {
        eliminarImagenLocal(imagen);
      }

      console.log(
        `✅ Producto eliminado: ${producto.nombre}`
      );

      return res.json({
        msg: "Eliminado correctamente",
      });
    } catch (error) {
      console.error(
        "❌ Error en eliminarProducto:",
        error
      );

      return res.status(500).json({
        msg: "Error al eliminar",
      });
    }
  };