import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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
// AÑADIDO: Importante para procesar datos de formularios correctamente
app.use(express.urlencoded({ extended: true }));

// CARPETA PÚBLICA DE IMÁGENES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// RUTA LOGIN
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res
      .status(200)
      .json({ success: true, message: "Autenticación exitosa" });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Contraseña incorrecta" });
  }
});

// Rutas
app.use("/api/contacto", contactRoutes);
app.use("/api/productos", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor protegido y corriendo en puerto ${PORT}`);
});
