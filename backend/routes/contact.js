import express from 'express';
import { nuevoMensaje } from '../controllers/contactController.js';

const router = express.Router();

// Ruta para recibir mensajes del formulario de contacto
router.post('/', nuevoMensaje);

export default router;