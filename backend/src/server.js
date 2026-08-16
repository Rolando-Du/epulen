import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";

import conectarDB from "./config/db.js";

// Rutas
import productRoutes from "./routes/productRoutes.js";

// BASE DE DATOS

conectarDB();

// APP

const app = express();

/*
Render trabaja detrás de un proxy.
*/
app.set("trust proxy", 1);

// SEGURIDAD

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// CORS

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://epulen.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      Permitir requests sin Origin:
      Postman,
      Thunder Client,
      Render health checks,
      etc.
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

// BODY PARSERS

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

// RUTAS API

app.use(
  "/api/productos",
  productRoutes
);

// LOGIN ADMIN

app.post("/api/login", (req, res) => {
  const { password } = req.body;

  // Validar que llegue contraseña
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Contraseña requerida",
    });
  }

  // Validar configuración JWT
  if (!process.env.JWT_SECRET) {
    console.error(
      "❌ JWT_SECRET no está configurado"
    );

    return res.status(500).json({
      success: false,
      message:
        "Error de configuración del servidor",
    });
  }

  // Validar contraseña administrador
  if (
    password !==
    process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Contraseña incorrecta",
    });
  }

  // Generar token JWT
  const token = jwt.sign(
    {
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  return res.status(200).json({
    success: true,
    message: "Autenticación exitosa",
    token,
  });
});

// HEALTH CHECK

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

// 404 API

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Ruta API no encontrada",
  });
});

// ERROR HANDLER

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

// SERVER

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");

  console.log(
    "EPULÉN SEGURIDAD INDUSTRIAL"
  );

  console.log(
    `Servidor operativo en puerto ${PORT}`
  );

  console.log(
    `Entorno: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );

  console.log("");
});