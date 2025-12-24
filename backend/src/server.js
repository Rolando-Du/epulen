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

// --- CONFIGURACIÓN DE MIDDLEWARES ---

// Configuración de CORS optimizada para Vercel
app.use(cors({
  origin: "*", // Permite peticiones desde cualquier origen (ideal para pruebas con Vercel)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE CARPETA ESTÁTICA ---
const uploadsPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

// --- RUTAS API ---
app.use("/api/contacto", contactRoutes);
app.use("/api/productos", productRoutes);

// RUTA LOGIN
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  
  // Verificación de seguridad básica
  if (!password) {
    return res.status(400).json({ success: false, message: "Contraseña requerida" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ 
      success: true, 
      message: "Autenticación exitosa" 
    });
  }
  
  return res.status(401).json({ 
    success: false, 
    message: "Contraseña incorrecta" 
  });
});

// Ruta de salud (Health Check) para Render
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor operativo en puerto ${PORT}`);
  console.log(`🖼️ Carpeta de imágenes: ${uploadsPath}`);
});