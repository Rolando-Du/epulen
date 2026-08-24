import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        success: false,
        message:
          "No autorizado. Token requerido.",
      });
    }

    if (
      !authorizationHeader.startsWith(
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
      authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Token no proporcionado.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET no está configurado"
      );

      return res.status(500).json({
        success: false,
        message:
          "Error de configuración del servidor.",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado.",
      });
    }

    req.admin = payload;

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
        message: "Token inválido.",
      });
    }

    console.error(
      "Error validando JWT:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "No autorizado.",
    });
  }
};

export default authAdmin;