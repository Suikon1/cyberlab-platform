import express from "express";
import cors from "cors";
import machines from "./models/machine.js";
import {
  ensureDirectoriesExist,
  machinesDir,
} from "./services/machine.services.js";
import authRoutes from "./routes/auth/authRoutes.js";
import machinesRoutes from "./routes/machines/machinesRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const router = express();
const PORT = process.env.PORT || 5000;

// Middleware
router.use(cors());
router.use(express.json());
router.use("/uploads", express.static("uploads"));

// RUTAS

router.use("/auth", authRoutes);
router.use("/machines", machinesRoutes);

// Iniciar servidor
router.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(`🔒 Frontend en: http://localhost:3000`);
  console.log(`👤 Admin: usuario=admin, password=password`);
  console.log(`📁 Directorio de uploads: ${machinesDir}`);
  console.log(`💾 Máquinas cargadas: ${machines.length}`);
});

// Call this when starting the server
ensureDirectoriesExist();
