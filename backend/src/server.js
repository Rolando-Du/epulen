import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import conectarDB from "./config/db.js";

// Importación de Rutas
import contactRoutes from "./routes/contact.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
conectarDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE CARPETA ESTÁTICA ---
// Usamos process.cwd() para asegurar que busque en la raíz del proyecto
const uploadsPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Servir la carpeta física 'uploads' en la ruta virtual '/uploads'
app.use("/uploads", express.static(uploadsPath));

// Rutas API
app.use("/api/contacto", contactRoutes);
app.use("/api/productos", productRoutes);

// RUTA LOGIN
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res
      .status(200)
      .json({ success: true, message: "Autenticación exitosa" });
  }
  return res
    .status(401)
    .json({ success: false, message: "Contraseña incorrecta" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`🖼️ Carpeta de imágenes: ${uploadsPath}`);
});
