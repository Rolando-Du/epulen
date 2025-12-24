import express from "express";
import {
  obtenerProductos,
  obtenerProductoPorId,
  nuevoProducto,
  eliminarProducto,
  actualizarProducto,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 1. Obtener todos los productos (público)
router.get("/", obtenerProductos);

// 2. Obtener un solo producto por ID
router.get("/:id", obtenerProductoPorId);

// 3. Crear producto (Dashboard)
// CAMBIO: 'upload.single' pasa a ser 'upload.array'
// El primer parámetro 'imagenes' es el nombre del campo que usaremos en el FormData del frontend
// El segundo parámetro (5) es el límite máximo de fotos por producto
router.post("/", upload.array("imagenes", 5), nuevoProducto);

// 4. Actualizar producto (Dashboard)
// También actualizamos aquí para poder subir nuevas fotos al editar
router.put("/:id", upload.array("imagenes", 5), actualizarProducto);

// 5. Eliminar producto
router.delete("/:id", eliminarProducto);

export default router;
