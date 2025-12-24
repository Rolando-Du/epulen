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
    const { nombre, descripcion, categoria, precio, tallas } = req.body;

    // Verificamos que se hayan subido archivos (req.files)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "Debes subir al menos una imagen" });
    }

    let tallasParseadas = [];
    try {
      tallasParseadas = tallas ? JSON.parse(tallas) : [];
    } catch (e) {
      return res.status(400).json({ msg: "Formato de tallas inválido" });
    }

    // Mapeamos el array de archivos a un array de rutas
    const imagenes = req.files.map((file) => `/uploads/${file.filename}`);

    const producto = new Product({
      nombre,
      descripcion,
      categoria,
      precio,
      tallas: tallasParseadas,
      imagenes, // Guardamos el array de rutas
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    // Si hay error, borramos todos los archivos subidos
    if (req.files) {
      req.files.forEach((file) => {
        const ruta = path.join(process.cwd(), "uploads", file.filename);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      });
    }
    res.status(400).json({ msg: error.message || "Error al crear" });
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

    if (req.body.nombre) producto.nombre = req.body.nombre;
    if (req.body.descripcion) producto.descripcion = req.body.descripcion;
    if (req.body.categoria) producto.categoria = req.body.categoria;
    if (req.body.precio) producto.precio = req.body.precio;

    if (req.body.tallas) {
      try {
        producto.tallas = JSON.parse(req.body.tallas);
      } catch (e) {
        return res.status(400).json({ msg: "Formato de tallas inválido" });
      }
    }

    // Si se suben nuevas imágenes
    if (req.files && req.files.length > 0) {
      // 1. Borramos las imágenes anteriores del servidor
      producto.imagenes.forEach((imgRuta) => {
        const rutaAbsoluta = path.join(
          process.cwd(),
          imgRuta.replace(/^\//, "")
        );
        if (fs.existsSync(rutaAbsoluta)) fs.unlinkSync(rutaAbsoluta);
      });

      // 2. Reemplazamos con las nuevas rutas
      producto.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    }

    await producto.save();
    res.json(producto);
  } catch (error) {
    console.error("Error detallado:", error);
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

    // Borramos todas las imágenes del array del servidor
    if (producto.imagenes && producto.imagenes.length > 0) {
      producto.imagenes.forEach((imgRuta) => {
        const ruta = path.join(process.cwd(), imgRuta.replace(/^\//, ""));
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      });
    }

    await producto.deleteOne();
    res.json({ msg: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar" });
  }
};
