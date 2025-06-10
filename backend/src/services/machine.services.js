import multer from "multer";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
// Crear directorios necesarios
const uploadsDir = path.join(__dirname, "uploads");
export const machinesDir = path.join(uploadsDir, "machines");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(machinesDir)) {
  fs.mkdirSync(machinesDir, { recursive: true });
}

// Configuración de multer para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, machinesDir);
  },
  filename: function (req, file, cb) {
    // Usar el nombre de la máquina del formulario o el nombre original del archivo
    const machineName = req.body.name || file.originalname.replace(".zip", "");
    cb(null, `${machineName}.zip`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      file.originalname.endsWith(".zip")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos ZIP"), false);
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB límite
  },
});

export default upload;

// Manejo de errores de multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "El archivo es demasiado grande (máximo 500MB)" });
    }
    return res
      .status(400)
      .json({ error: "Error al subir archivo: " + error.message });
  }

  if (error.message === "Solo se permiten archivos ZIP") {
    return res.status(400).json({ error: error.message });
  }

  res
    .status(500)
    .json({ error: "Error interno del servidor: " + error.message });
});

// Ensure uploads directories exist
export const ensureDirectoriesExist = () => {
  const directories = [
    path.join(__dirname, "uploads"),
    path.join(__dirname, "uploads", "machines"),
    path.join(__dirname, "machines"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Directorio creado: ${dir}`);
    }
  });
};
