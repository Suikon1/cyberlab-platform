import machines from "../models/machine.js";
import path from "path";
import fs from "fs";

// Función para obtener el tamaño del archivo en formato legible
//usado en upload y download endpoints
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  } catch (error) {
    return "Unknown";
  }
}

// api/machines/upload endpoint controller
export const uploadMachine = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const { name, description, difficulty, tags } = req.body;

    if (!name || !description || !difficulty) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Procesar tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    // Obtener tamaño del archivo subido
    const fileSize = getFileSize(req.file.path);

    // Crear nueva máquina
    const newMachine = {
      id: Math.max(...machines.map((m) => m.id)) + 1,
      name: name,
      difficulty: difficulty,
      description: description,
      size: fileSize,
      tags: tagsArray,
      completed: false,
      starred: false,
      writeups: [],
    };

    // Agregar a la lista de máquinas
    machines.push(newMachine);

    console.log(`✅ Nueva máquina agregada: ${name} (${fileSize})`);

    res.json({
      message: "Máquina subida exitosamente",
      machine: newMachine,
    });
  } catch (error) {
    console.error("Error al subir máquina:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
};

export const updateMachine = (req, res) => {
  const { id } = req.params;
  const { description, difficulty, tags } = req.body;

  const machineIndex = machines.findIndex((m) => m.id === parseInt(id));
  if (machineIndex !== -1) {
    machines[machineIndex].description = description;
    machines[machineIndex].difficulty = difficulty;
    machines[machineIndex].tags =
      typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;

    res.json({
      message: "Máquina actualizada exitosamente",
      machine: machines[machineIndex],
    });
  } else {
    res.status(404).json({ error: "Máquina no encontrada" });
  }
};

export const deleteMachine = (req, res) => {
  const { id } = req.params;
  const machineIndex = machines.findIndex((m) => m.id === parseInt(id));

  if (machineIndex !== -1) {
    const machine = machines[machineIndex];

    // Eliminar archivo físico si existe
    const filePath = path.join(machinesDir, `${machine.name}.zip`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Archivo eliminado: ${machine.name}.zip`);
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
      }
    }

    // Eliminar de la lista
    machines.splice(machineIndex, 1);

    res.json({
      message: "Máquina eliminada exitosamente",
    });
  } else {
    res.status(404).json({ error: "Máquina no encontrada" });
  }
};

export const checkMachine = (req, res) => {
  const machineName = req.params.name;
  const sanitizedName = machineName.replace(/[^a-zA-Z0-9\-_]/g, "");

  const possiblePaths = [
    path.join(__dirname, "uploads", "machines", `${sanitizedName}.zip`),
    path.join(
      __dirname,
      "docker-machines",
      sanitizedName,
      `${sanitizedName}.zip`
    ),
    path.join(__dirname, "machines", `${sanitizedName}.zip`),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      const stats = fs.statSync(possiblePath);
      return res.json({
        available: true,
        size: stats.size,
        sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        path: possiblePath,
      });
    }
  }

  res.json({
    available: false,
    message: "Archivo no encontrado",
  });
};

export const machineWriteUp = (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;

  const machine = machines.find((m) => m.id === parseInt(id));
  if (machine) {
    const writeup = {
      id: Date.now(),
      title,
      url,
      description,
      addedBy: "admin",
      createdAt: new Date().toISOString(),
    };

    machine.writeups.push(writeup);

    res.json({
      message: "Writeup agregado exitosamente",
      writeup,
    });
  } else {
    res.status(404).json({ error: "Máquina no encontrada" });
  }
};

export const downloadMachine = async (req, res) => {
  const machineName = req.params.name;

  try {
    // Sanitize machine name to prevent path traversal
    const sanitizedName = machineName.replace(/[^a-zA-Z0-9\-_]/g, "");

    // Check multiple possible locations for the file
    const possiblePaths = [
      path.join(__dirname, "uploads", "machines", `${sanitizedName}.zip`),
      path.join(
        __dirname,
        "docker-machines",
        sanitizedName,
        `${sanitizedName}.zip`
      ),
      path.join(__dirname, "machines", `${sanitizedName}.zip`),
    ];

    let filePath = null;
    let stats = null;

    // Find the file in any of the possible locations
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        filePath = possiblePath;
        stats = fs.statSync(possiblePath);
        break;
      }
    }

    if (!filePath || !stats) {
      console.log(`❌ Archivo no encontrado: ${machineName}.zip`);
      console.log(`Buscado en: ${possiblePaths.join(", ")}`);
      return res.status(404).json({
        error: "Máquina no encontrada",
        message: `El archivo ${machineName}.zip no está disponible para descarga`,
      });
    }

    // Log the download attempt
    console.log(
      `📥 Iniciando descarga: ${machineName}.zip (${(
        stats.size /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );
    console.log(`📂 Archivo ubicado en: ${filePath}`);

    // Set appropriate headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedName}.zip"`
    );
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "no-cache");

    // Create read stream and handle errors
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (error) => {
      console.error(`❌ Error leyendo archivo ${machineName}.zip:`, error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Error interno del servidor",
          message: "No se pudo leer el archivo de la máquina",
        });
      }
    });

    fileStream.on("end", () => {
      console.log(`✅ Descarga completada: ${machineName}.zip`);
    });

    // Pipe the file to response
    fileStream.pipe(res);
  } catch (error) {
    console.error(`❌ Error en descarga de ${machineName}:`, error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: "No se pudo procesar la descarga",
    });
  }
};
