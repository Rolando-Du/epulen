import multer from "multer";
import path from "path";
import fs from "fs";

// CARPETA DE UPLOADS

const uploadDir = path.join(
  process.cwd(),
  "uploads"
);

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// STORAGE

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      `${uniqueSuffix}${extension}`
    );
  },
});

// FILTRO DE ARCHIVOS

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Formato no soportado. Solo se permiten imágenes JPG, PNG y WEBP."
    ),
    false
  );
};

// CONFIGURACIÓN MULTER

const upload = multer({
  storage,
  fileFilter,

  limits: {
    // Máximo 5 MB por imagen
    fileSize: 5 * 1024 * 1024,

    // Máximo 5 imágenes
    files: 5,
  },
});

export default upload;