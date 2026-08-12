import express from "express";
import { rateLimit } from "express-rate-limit";

import {
  nuevoMensaje,
} from "../controllers/contactController.js";

const router = express.Router();

// RATE LIMIT

const contactoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    msg: "Realizaste demasiadas consultas. Intentá nuevamente en unos minutos.",
  },
});

// POST /api/contacto

router.post(
  "/",
  contactoLimiter,
  nuevoMensaje
);

export default router;