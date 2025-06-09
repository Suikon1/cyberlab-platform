import express from "express";

import upload from "../../services/machine.services.js";
import machines from "../../models/machine.js";
import {
  checkMachine,
  downloadMachine,
  machineWriteUp,
  uploadMachine,
} from "../../controllers/machineController.js";
import { updateMachine } from "../../controllers/machineController.js";
import { deleteMachine } from "../../controllers/machineController.js";
const router = express.Router();

// Obtener máquinas
router.get("/api/machines", (req, res) => {
  res.json(machines);
});

// Subir nueva máquina
router.post(
  "/api/machines/upload",
  upload.single("machineFile"),
  uploadMachine
);

// Actualizar máquina
router.put("/api/machines/:id", updateMachine);

// Eliminar máquina
router.delete("/api/machines/:id", deleteMachine);

// Add a route to check if a machine file exists
router.get("/api/machines/:name/check", checkMachine);

// Agregar writeup
router.post("/api/machines/:id/writeup", machineWriteUp);

//Ruta de downloads de máquinas duplicada, por el vibecoding i guess lol
// Improved download route with better error handling and logging
router.get("/api/machines/:name/download", downloadMachine);

export default router;
