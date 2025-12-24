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

// Rutas Públicas
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

// Rutas de Administración (Dashboard)
router.post(
  "/",
  (req, res, next) => {
    upload.array("imagenes", 5)(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error al subir imágenes", error: err.message });
      }
      next();
    });
  },
  nuevoProducto
);

router.put(
  "/:id",
  (req, res, next) => {
    upload.array("imagenes", 5)(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Error al actualizar imágenes", error: err.message });
      }
      next();
    });
  },
  actualizarProducto
);

router.delete("/:id", eliminarProducto);

export default router;
