import jwt from "jsonwebtoken";

// ==============================
// AUTENTICACIÓN ADMIN
// ==============================

const authAdmin = (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization;

    // Validar que exista el header
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message:
          "No autorizado. Token requerido.",
      });
    }

    // Debe venir como:
    // Authorization: Bearer TOKEN
    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Formato de token inválido.",
      });
    }

    const token =
      authorization
        .split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Token no proporcionado.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET no está configurado"
      );

      return res.status(500).json({
        success: false,
        message:
          "Error de configuración del servidor.",
      });
    }

    // Verificar firma y expiración
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Confirmar que sea admin
    if (
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Acceso denegado.",
      });
    }

    // Guardamos los datos del token
    // por si los necesitamos después
    req.admin = decoded;

    next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "La sesión expiró. Iniciá sesión nuevamente.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Token inválido.",
      });
    }

    console.error(
      "❌ Error validando JWT:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "No autorizado.",
    });
  }
};

export default authAdmin;