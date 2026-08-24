import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter = (
  _req,
  file,
  callback
) => {
  if (
    allowedTypes.includes(file.mimetype)
  ) {
    return callback(null, true);
  }

  return callback(
    new Error(
      "Formato no soportado. Solo se permiten imágenes JPG, PNG y WEBP."
    ),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default upload;