import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";
import authAdmin from "../middleware/auth.js";

const router = express.Router();

const uploadImages = (req, res, next) => {
  upload.array("images", 5)(
    req,
    res,
    (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message:
            "Error al procesar las imágenes",
          error: error.message,
        });
      }

      next();
    }
  );
};

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authAdmin,
  uploadImages,
  createProduct
);

router.put(
  "/:id",
  authAdmin,
  uploadImages,
  updateProduct
);

router.delete(
  "/:id",
  authAdmin,
  deleteProduct
);

export default router;