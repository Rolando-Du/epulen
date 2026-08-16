import multer from "multer";

// STORAGE EN MEMORIA

const storage = multer.memoryStorage();

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

    // Máximo 5 imágenes por producto
    files: 5,
  },
});

export default upload;