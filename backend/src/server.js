import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://epulen.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          "Origin not allowed by CORS"
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

app.use(
  "/api/products",
  productRoutes
);

app.post(
  "/api/login",
  (req, res) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Contraseña requerida",
      });
    }

    if (
      !process.env.JWT_SECRET ||
      !process.env.ADMIN_PASSWORD
    ) {
      console.error(
        "JWT_SECRET o ADMIN_PASSWORD no están configurados"
      );

      return res.status(500).json({
        success: false,
        message:
          "Error de configuración del servidor",
      });
    }

    if (
      password !==
      process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

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
  }
);

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
    environment:
      process.env.NODE_ENV ||
      "development",
  });
});

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Ruta API no encontrada",
  });
});

app.use(
  (error, req, res, _next) => {
    console.error(
      "Server error:",
      error
    );

    if (
      error.message ===
      "Origin not allowed by CORS"
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
  }
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log(
    "EPULÉN SEGURIDAD INDUSTRIAL"
  );
  console.log(
    `Server running on port ${PORT}`
  );
  console.log(
    `Environment: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );
  console.log("");
});