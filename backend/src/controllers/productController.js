import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// 1. OBTENER TODOS LOS PRODUCTOS
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find().sort({ creadoEn: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos" });
  }
};

// 2. OBTENER UN SOLO PRODUCTO POR ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de producto no válido" });
    }
    const producto = await Product.findById(id);
    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar el producto" });
  }
};

// 3. CREAR UN PRODUCTO
export const nuevoProducto = async (req, res) => {
  try {
    // console.log(" Datos recibidos:", req.body);

    const { nombre, descripcion, categoria, precio, tallas, destacado } =
      req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "Debes subir al menos una imagen" });
    }

    let tallasParseadas = [];
    try {
      tallasParseadas =
        typeof tallas === "string" ? JSON.parse(tallas) : tallas;
    } catch (e) {
      return res.status(400).json({ msg: "Formato de tallas inválido" });
    }

    const imagenesRutas = req.files.map((file) => `/uploads/${file.filename}`);

    const producto = new Product({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria: categoria.trim(),
      precio: Number(precio),
      tallas: tallasParseadas,
      imagenes: imagenesRutas,
      // imagenUrl se genera automáticamente por el Virtual en el modelo
      destacado: destacado === "true" || destacado === true,
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    console.error("❌ Error en nuevoProducto:", error);

    // Limpieza de archivos si falla la grabación en DB
    if (req.files) {
      req.files.forEach((file) => {
        const ruta = path.join(process.cwd(), "uploads", file.filename);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      });
    }
    res.status(400).json({ msg: error.message || "Error al crear producto" });
  }
};

// 4. ACTUALIZAR PRODUCTO
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "ID no válido" });

    const producto = await Product.findById(id);
    if (!producto)
      return res.status(404).json({ msg: "No existe el producto" });

    // Actualización de campos
    if (req.body.nombre) producto.nombre = req.body.nombre.trim();
    if (req.body.descripcion)
      producto.descripcion = req.body.descripcion.trim();
    if (req.body.categoria) producto.categoria = req.body.categoria.trim();
    if (req.body.precio) producto.precio = Number(req.body.precio);

    if (req.body.destacado !== undefined) {
      producto.destacado =
        req.body.destacado === "true" || req.body.destacado === true;
    }

    if (req.body.tallas) {
      try {
        producto.tallas =
          typeof req.body.tallas === "string"
            ? JSON.parse(req.body.tallas)
            : req.body.tallas;
      } catch (e) {
        return res.status(400).json({ msg: "Formato de tallas inválido" });
      }
    }

    // Si hay nuevas imágenes
    if (req.files && req.files.length > 0) {
      // Borrar archivos físicos anteriores
      producto.imagenes.forEach((imgRuta) => {
        const nombreArchivo = path.basename(imgRuta);
        const rutaAbsoluta = path.join(process.cwd(), "uploads", nombreArchivo);
        if (fs.existsSync(rutaAbsoluta)) fs.unlinkSync(rutaAbsoluta);
      });

      const nuevasImagenes = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
      producto.imagenes = nuevasImagenes;
    }

    await producto.save();
    res.json(producto);
  } catch (error) {
    console.error("❌ Error en actualizarProducto:", error);
    res.status(500).json({ msg: "Error interno al actualizar" });
  }
};

// 5. ELIMINAR PRODUCTO
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "ID no válido" });

    const producto = await Product.findById(id);
    if (!producto) return res.status(404).json({ msg: "No encontrado" });

    // Borrar archivos físicos
    if (producto.imagenes && producto.imagenes.length > 0) {
      producto.imagenes.forEach((imgRuta) => {
        const nombreArchivo = path.basename(imgRuta);
        const ruta = path.join(process.cwd(), "uploads", nombreArchivo);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      });
    }

    await producto.deleteOne();
    res.json({ msg: "Eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en eliminarProducto:", error);
    res.status(500).json({ msg: "Error al eliminar" });
  }
};
