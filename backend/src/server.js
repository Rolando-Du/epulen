import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";

import conectarDB from "./config/db.js";
import { verificarMailer } from "./config/mailer.js";

// Rutas
import contactRoutes from "./routes/contact.js";
import productRoutes from "./routes/productRoutes.js";

// ==============================
// BASE DE DATOS
// ==============================

conectarDB();

// ==============================
// APP
// ==============================

const app = express();

/*
Render trabaja detrás de un proxy.

Esto es importante especialmente para
express-rate-limit del formulario de contacto,
para poder identificar correctamente la IP.
*/
app.set("trust proxy", 1);

// ==============================
// SEGURIDAD
// ==============================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ==============================
// CORS
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://epulen.vercel.app",

  // Si en producción configuramos FRONTEND_URL,
  // también se agrega automáticamente.
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      Permitir requests sin origin:
      Postman, Thunder Client,
      Render health checks, etc.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `⚠️ CORS bloqueó el origen: ${origin}`
      );

      return callback(
        new Error(
          "Origen no permitido por CORS"
        )
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// ==============================
// BODY PARSERS
// ==============================

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  })
);

// ==============================
// UPLOADS
// ==============================

const uploadsPath = path.join(
  process.cwd(),
  "uploads"
);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ==============================
// RUTAS API
// ==============================

app.use(
  "/api/contacto",
  contactRoutes
);

app.use(
  "/api/productos",
  productRoutes
);

// ==============================
// LOGIN ADMIN
// ==============================

app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Contraseña requerida",
    });
  }

  if (
    password ===
    process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Contraseña incorrecta",
  });
});

// ==============================
// HEALTH CHECK
// ==============================

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

// ==============================
// 404 API
// ==============================

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Ruta API no encontrada",
  });
});

// ==============================
// ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error(
    "❌ Error del servidor:",
    err
  );

  if (
    err.message ===
    "Origen no permitido por CORS"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "El origen de la solicitud no está permitido.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      "Error interno del servidor",
  });
});

// ==============================
// SERVER
// ==============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log("");
  console.log(
    "🌿 EPULÉN SEGURIDAD INDUSTRIAL"
  );

  console.log(
    `🚀 Servidor operativo en puerto ${PORT}`
  );

  console.log(
    `🖼️ Carpeta de imágenes: ${uploadsPath}`
  );

  console.log(
    `🌐 Entorno: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );

  console.log("");

  // VERIFICAR SERVIDOR DE EMAIL

  await verificarMailer();

  console.log("");
});