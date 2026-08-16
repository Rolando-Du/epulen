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

// RUTAS PÚBLICAS

router.get(
  "/",
  obtenerProductos
);

router.get(
  "/:id",
  obtenerProductoPorId
);

// CREAR PRODUCTO

router.post(
  "/",
  (req, res, next) => {
    upload.array(
      "imagenes",
      5
    )(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Error al subir imágenes",
            error:
              err.message,
          });
      }

      next();
    });
  },
  nuevoProducto
);

// ACTUALIZAR PRODUCTO

router.put(
  "/:id",
  (req, res, next) => {
    upload.array(
      "imagenes",
      5
    )(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Error al actualizar imágenes",
            error:
              err.message,
          });
      }

      next();
    });
  },
  actualizarProducto
);

// ELIMINAR PRODUCTO

router.delete(
  "/:id",
  eliminarProducto
);

export default router;