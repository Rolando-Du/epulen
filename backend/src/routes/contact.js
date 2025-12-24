import express from "express";
import { nuevoMensaje } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", nuevoMensaje);

export default router;
