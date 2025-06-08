const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Crear directorios necesarios
const uploadsDir = path.join(__dirname, 'uploads')
const machinesDir = path.join(uploadsDir, 'machines')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
if (!fs.existsSync(machinesDir)) {
  fs.mkdirSync(machinesDir, { recursive: true })
}

// Configuración de multer para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, machinesDir)
  },
  filename: function (req, file, cb) {
    // Usar el nombre de la máquina del formulario o el nombre original del archivo
    const machineName = req.body.name || file.originalname.replace('.zip', '')
    cb(null, `${machineName}.zip`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || 
        file.mimetype === 'application/x-zip-compressed' || 
        file.originalname.endsWith('.zip')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos ZIP'), false)
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB límite
  }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// DATOS EN MEMORIA (sin base de datos) - SIN TAMAÑOS HARDCODEADOS
let machines = [
  {
    id: 1,
    name: 'anonymouspingu',
    difficulty: 'Intermedio',
    description: 'Máquina de pentesting enfocada en técnicas de anonimato y steganografía avanzada',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['Steganography', 'OSINT', 'Network'],
    completed: true,
    starred: true,
    writeups: []
  },
  {
    id: 2,
    name: 'dance-samba',
    difficulty: 'Fácil',
    description: 'Desafío de explotación web con temática brasileña, ideal para principiantes',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['Web', 'SQLi', 'File Upload'],
    completed: true,
    starred: true,
    writeups: []
  },
  {
    id: 3,
    name: 'inclusion',
    difficulty: 'Intermedio',
    description: 'Desafío de inclusión de archivos locales y remotos con escalada de privilegios',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['File Inclusion', 'LFI', 'RFI', 'Linux'],
    completed: true,
    starred: false,
    writeups: []
  },
  {
    id: 4,
    name: 'mirame',
    difficulty: 'Fácil',
    description: 'Máquina introductoria con vulnerabilidades básicas de enumeración',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['Beginner', 'Web', 'Enumeration'],
    completed: true,
    starred: false,
    writeups: []
  },
  {
    id: 5,
    name: 'pinguinazo',
    difficulty: 'Avanzado',
    description: 'Desafío avanzado con múltiples vectores de ataque y técnicas complejas',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['Advanced', 'Multi-vector', 'Exploitation'],
    completed: true,
    starred: true,
    writeups: []
  },
  {
    id: 6,
    name: 'whoiam',
    difficulty: 'Intermedio',
    description: 'Desafío de identificación de usuarios y escalada de privilegios en sistema Linux',
    size: 'Calculando...', // Se calculará dinámicamente
    tags: ['Privilege Escalation', 'Linux', 'Identity'],
    completed: true,
    starred: false,
    writeups: []
  }
]

// Usuario admin simple
const ADMIN_USER = {
  username: 'admin',
  password: 'password'
}

// Función para obtener el tamaño del archivo en formato legible
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    const bytes = stats.size
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  } catch (error) {
    return 'Unknown'
  }
}

// =====================================================
// FUNCIONES PARA TAMAÑOS DINÁMICOS
// =====================================================

// Función para actualizar los tamaños de las máquinas basándose en archivos reales
function updateMachinesSizes() {
  console.log('🔄 Actualizando tamaños de máquinas...');
  
  machines.forEach(machine => {
    // Buscar archivo en múltiples ubicaciones posibles
    const possiblePaths = [
      path.join(machinesDir, `${machine.name}.zip`),
      path.join(machinesDir, `${machine.name}.ova`),
      path.join(machinesDir, `${machine.name}.vmdk`),
      path.join(__dirname, 'docker-machines', machine.name, `${machine.name}.zip`),
      path.join(__dirname, 'machines', `${machine.name}.zip`)
    ];
    
    let found = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const newSize = getFileSize(filePath);
        const oldSize = machine.size;
        machine.size = newSize;
        machine.fileExists = true;
        machine.filePath = filePath;
        
        if (oldSize !== newSize) {
          console.log(`📏 ${machine.name}: ${oldSize} → ${newSize}`);
        }
        found = true;
        break;
      }
    }
    
    if (!found) {
      machine.size = 'No disponible';
      machine.fileExists = false;
      machine.filePath = null;
      console.log(`❌ ${machine.name}: Archivo no encontrado`);
    }
  });
  
  console.log('✅ Tamaños actualizados');
}

// Función para obtener estadísticas de archivos
function getFilesStatistics() {
  const availableMachines = machines.filter(m => m.fileExists).length;
  const totalMachines = machines.length;
  const totalSize = machines
    .filter(m => m.fileExists)
    .reduce((sum, machine) => {
      const filePath = machine.filePath;
      if (filePath && fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return sum + stats.size;
      }
      return sum;
    }, 0);
  
  return {
    availableMachines,
    totalMachines,
    totalSize,
    totalSizeFormatted: getFileSize(totalSize)
  };
}

// =====================================================
// RUTAS PRINCIPALES
// =====================================================

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: '🔒 CyberLab API funcionando correctamente!',
    version: '1.0.0',
    status: 'online'
  })
})

// =====================================================
// RUTAS DE AUTENTICACIÓN
// =====================================================

// Login simple
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    res.json({ 
      token: 'fake-jwt-token',
      user: { 
        id: 1, 
        username: 'admin', 
        role: 'admin' 
      } 
    });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// =====================================================
// RUTAS DE MÁQUINAS
// =====================================================

// Obtener máquinas con tamaños actualizados
app.get('/api/machines', (req, res) => {
  // Actualizar tamaños antes de enviar respuesta
  updateMachinesSizes();
  
  // Enviar solo los datos necesarios para el frontend (sin filePath)
  const machinesForFrontend = machines.map(machine => ({
    id: machine.id,
    name: machine.name,
    difficulty: machine.difficulty,
    description: machine.description,
    size: machine.size,
    tags: machine.tags,
    completed: machine.completed,
    starred: machine.starred,
    writeups: machine.writeups,
    available: machine.fileExists || false
  }));
  
  res.json(machinesForFrontend);
})

// Subir nueva máquina
app.post('/api/machines/upload', upload.single('machineFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió archivo' })
    }

    const { name, description, difficulty, tags } = req.body
    
    if (!name || !description || !difficulty) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    // Procesar tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []

    // Obtener tamaño del archivo subido (REAL)
    const fileSize = getFileSize(req.file.path)

    // Crear nueva máquina
    const newMachine = {
      id: Math.max(...machines.map(m => m.id)) + 1,
      name: name,
      difficulty: difficulty,
      description: description,
      size: fileSize, // Tamaño real del archivo subido
      tags: tagsArray,
      completed: false,
      starred: false,
      writeups: [],
      fileExists: true,
      filePath: req.file.path
    }

    // Agregar a la lista de máquinas
    machines.push(newMachine)

    console.log(`✅ Nueva máquina agregada: ${name} (${fileSize})`)

    res.json({
      message: 'Máquina subida exitosamente',
      machine: {
        id: newMachine.id,
        name: newMachine.name,
        difficulty: newMachine.difficulty,
        description: newMachine.description,
        size: newMachine.size,
        tags: newMachine.tags,
        completed: newMachine.completed,
        starred: newMachine.starred,
        writeups: newMachine.writeups,
        available: newMachine.fileExists
      }
    })

  } catch (error) {
    console.error('Error al subir máquina:', error)
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message })
  }
})

// Actualizar máquina
app.put('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  const { description, difficulty, tags } = req.body;
  
  const machineIndex = machines.findIndex(m => m.id === parseInt(id));
  if (machineIndex !== -1) {
    machines[machineIndex].description = description;
    machines[machineIndex].difficulty = difficulty;
    machines[machineIndex].tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    
    // Actualizar tamaño si cambió el archivo
    updateMachinesSizes();
    
    res.json({ 
      message: 'Máquina actualizada exitosamente',
      machine: {
        id: machines[machineIndex].id,
        name: machines[machineIndex].name,
        difficulty: machines[machineIndex].difficulty,
        description: machines[machineIndex].description,
        size: machines[machineIndex].size,
        tags: machines[machineIndex].tags,
        completed: machines[machineIndex].completed,
        starred: machines[machineIndex].starred,
        writeups: machines[machineIndex].writeups,
        available: machines[machineIndex].fileExists
      }
    });
  } else {
    res.status(404).json({ error: 'Máquina no encontrada' });
  }
});

// Eliminar máquina
app.delete('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  const machineIndex = machines.findIndex(m => m.id === parseInt(id));
  
  if (machineIndex !== -1) {
    const machine = machines[machineIndex];
    
    // Eliminar archivo físico si existe
    const filePath = path.join(machinesDir, `${machine.name}.zip`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Archivo eliminado: ${machine.name}.zip`);
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
      }
    }
    
    // Eliminar de la lista
    machines.splice(machineIndex, 1);
    
    res.json({ 
      message: 'Máquina eliminada exitosamente'
    });
  } else {
    res.status(404).json({ error: 'Máquina no encontrada' });
  }
});

// Agregar writeup
app.post('/api/machines/:id/writeup', (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;
  
  const machine = machines.find(m => m.id === parseInt(id));
  if (machine) {
    const writeup = {
      id: Date.now(),
      title,
      url,
      description,
      addedBy: 'admin',
      createdAt: new Date().toISOString()
    };
    
    machine.writeups.push(writeup);
    
    res.json({ 
      message: 'Writeup agregado exitosamente',
      writeup
    });
  } else {
    res.status(404).json({ error: 'Máquina no encontrada' });
  }
});

// =====================================================
// RUTAS DE DESCARGA - VERSIÓN MEJORADA
// =====================================================

// Descargar máquina (ruta original)
app.get('/api/machines/:name/download', async (req, res) => {
  const machineName = req.params.name;
  
  try {
    // Sanitize machine name to prevent path traversal
    const sanitizedName = machineName.replace(/[^a-zA-Z0-9\-_]/g, '');
    
    // Check multiple possible locations for the file
    const possiblePaths = [
      path.join(__dirname, 'uploads', 'machines', `${sanitizedName}.zip`),
      path.join(__dirname, 'docker-machines', sanitizedName, `${sanitizedName}.zip`),
      path.join(__dirname, 'machines', `${sanitizedName}.zip`)
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
      console.log(`Buscado en: ${possiblePaths.join(', ')}`);
      return res.status(404).json({ 
        error: 'Máquina no encontrada',
        message: `El archivo ${machineName}.zip no está disponible para descarga`
      });
    }
    
    // Log the download attempt
    console.log(`📥 Iniciando descarga: ${machineName}.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`📂 Archivo ubicado en: ${filePath}`);
    
    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Create read stream and handle errors
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error(`❌ Error leyendo archivo ${machineName}.zip:`, error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error interno del servidor',
          message: 'No se pudo leer el archivo de la máquina'
        });
      }
    });
    
    fileStream.on('end', () => {
      console.log(`✅ Descarga completada: ${machineName}.zip`);
    });
    
    // Pipe the file to response
    fileStream.pipe(res);
    
  } catch (error) {
    console.error(`❌ Error en descarga de ${machineName}:`, error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'No se pudo procesar la descarga'
    });
  }
});

// Nueva ruta de descarga genérica (compatible con frontend)
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  
  try {
    // Remover extensión y buscar el archivo
    const machineName = filename.replace(/\.(zip|ova|vmdk)$/i, '');
    const sanitizedName = machineName.replace(/[^a-zA-Z0-9\-_]/g, '');
    
    // Buscar archivo con diferentes extensiones
    const possibleFiles = [
      `${sanitizedName}.zip`,
      `${sanitizedName}.ova`,
      `${sanitizedName}.vmdk`
    ];
    
    const possibleDirs = [
      path.join(__dirname, 'uploads', 'machines'),
      path.join(__dirname, 'docker-machines', sanitizedName),
      path.join(__dirname, 'machines')
    ];
    
    let filePath = null;
    let stats = null;
    let actualFilename = null;
    
    // Buscar archivo en todas las ubicaciones posibles
    for (const dir of possibleDirs) {
      for (const file of possibleFiles) {
        const testPath = path.join(dir, file);
        if (fs.existsSync(testPath)) {
          filePath = testPath;
          stats = fs.statSync(testPath);
          actualFilename = file;
          break;
        }
      }
      if (filePath) break;
    }
    
    if (!filePath || !stats) {
      console.log(`❌ Archivo no encontrado: ${filename}`);
      return res.status(404).json({ 
        error: 'Archivo no encontrado',
        message: `El archivo ${filename} no existe en el servidor`
      });
    }
    
    console.log(`📥 Descarga iniciada: ${actualFilename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${actualFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stats.size);
    
    // Stream del archivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('❌ Error en descarga:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Verificar si máquina existe
app.get('/api/machines/:name/check', (req, res) => {
  const machineName = req.params.name;
  const sanitizedName = machineName.replace(/[^a-zA-Z0-9\-_]/g, '');
  
  const possiblePaths = [
    path.join(__dirname, 'uploads', 'machines', `${sanitizedName}.zip`),
    path.join(__dirname, 'docker-machines', sanitizedName, `${sanitizedName}.zip`),
    path.join(__dirname, 'machines', `${sanitizedName}.zip`)
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      const stats = fs.statSync(possiblePath);
      return res.json({
        available: true,
        size: stats.size,
        sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        path: possiblePath
      });
    }
  }
  
  res.json({
    available: false,
    message: 'Archivo no encontrado'
  });
});

// =====================================================
// RUTAS DE INFORMACIÓN Y ARCHIVOS (NUEVAS)
// =====================================================

// Health check (nueva ruta con /api/)
app.get('/api/health', (req, res) => {
  const vmsExists = fs.existsSync(machinesDir);
  const uploadsExists = fs.existsSync(uploadsDir);
  
  // Actualizar tamaños antes de calcular estadísticas
  updateMachinesSizes();
  const stats = getFilesStatistics();
  
  res.json({ 
    status: 'OK', 
    message: 'CyberTrack Viña Backend - Sistema de Máquinas Virtuales',
    timestamp: new Date().toISOString(),
    directories: {
      uploads: uploadsExists,
      machines: vmsExists
    },
    statistics: {
      availableMachines: stats.availableMachines,
      totalMachines: stats.totalMachines,
      totalSize: stats.totalSize,
      totalSizeFormatted: stats.totalSizeFormatted
    },
    paths: {
      uploads: uploadsDir,
      machines: machinesDir
    },
    port: PORT,
    nodeVersion: process.version
  });
});

// Listar archivos disponibles (nueva ruta)
app.get('/api/files', (req, res) => {
  try {
    if (!fs.existsSync(machinesDir)) {
      return res.json({ 
        files: [], 
        total: 0,
        message: 'Directorio de máquinas no existe',
        directory: machinesDir
      });
    }
    
    const files = fs.readdirSync(machinesDir).map(filename => {
      const filePath = path.join(machinesDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        originalName: filename.replace(/-\d+\.zip$/, ''), // Remover timestamp
        size: stats.size,
        sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        downloadUrl: `/api/download/${filename}`,
        created: stats.birthtime,
        modified: stats.mtime,
        extension: path.extname(filename)
      };
    });
    
    // Ordenar por fecha de creación (más recientes primero)
    files.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    // Actualizar tamaños de máquinas
    updateMachinesSizes();
    
    res.json({ 
      success: true,
      files,
      total: files.length,
      directory: machinesDir,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      machines: machines.map(machine => ({
        id: machine.id,
        name: machine.name,
        difficulty: machine.difficulty,
        description: machine.description,
        size: machine.size,
        tags: machine.tags,
        completed: machine.completed,
        starred: machine.starred,
        writeups: machine.writeups,
        available: machine.fileExists || false
      }))
    });
    
  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al listar archivos',
      message: error.message 
    });
  }
});

// Ruta para forzar actualización de tamaños
app.post('/api/machines/refresh-sizes', (req, res) => {
  try {
    console.log('🔄 Forzando actualización de tamaños...');
    updateMachinesSizes();
    const stats = getFilesStatistics();
    
    res.json({
      success: true,
      message: 'Tamaños actualizados correctamente',
      statistics: stats,
      machines: machines.map(machine => ({
        name: machine.name,
        size: machine.size,
        available: machine.fileExists || false
      }))
    });
  } catch (error) {
    console.error('Error actualizando tamaños:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar tamaños',
      message: error.message
    });
  }
});

// Health check original (mantener compatibilidad)
app.get('/health', (req, res) => {
  updateMachinesSizes();
  const stats = getFilesStatistics();
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    machines: stats.totalMachines,
    availableMachines: stats.availableMachines,
    uploadsDir: uploadsDir
  });
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Manejo de errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande (máximo 500MB)' })
    }
    return res.status(400).json({ error: 'Error al subir archivo: ' + error.message })
  }
  
  if (error.message === 'Solo se permiten archivos ZIP') {
    return res.status(400).json({ error: error.message })
  }
  
  res.status(500).json({ error: 'Error interno del servidor: ' + error.message })
})

// =====================================================
// FUNCIONES DE UTILIDAD
// =====================================================

// Ensure uploads directories exist
const ensureDirectoriesExist = () => {
  const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads', 'machines'),
    path.join(__dirname, 'machines')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Directorio creado: ${dir}`);
    }
  });
};

// =====================================================
// INICIAR SERVIDOR
// =====================================================

// Call this when starting the server
ensureDirectoriesExist();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor CyberTrack Viña ejecutándose en puerto ${PORT}`)
  console.log(`📡 API disponible en: http://localhost:${PORT}`)
  console.log(`🔒 Frontend en: http://localhost:3000`)
  console.log(`👤 Admin: usuario=admin, password=password`)
  console.log(`📁 Directorio de uploads: ${machinesDir}`)
  
  // Actualizar tamaños al iniciar el servidor
  console.log(`🔄 Calculando tamaños de archivos...`)
  updateMachinesSizes();
  const stats = getFilesStatistics();
  
  console.log(`💾 Máquinas en memoria: ${stats.totalMachines}`)
  console.log(`📦 Máquinas disponibles: ${stats.availableMachines}`)
  console.log(`📊 Tamaño total: ${stats.totalSizeFormatted}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📋 Lista de archivos: http://localhost:${PORT}/api/files`)
  console.log(`🔄 Actualizar tamaños: http://localhost:${PORT}/api/machines/refresh-sizes`)
  console.log(`⬇️ Descarga de máquinas: http://localhost:${PORT}/api/machines/[name]/download`)
  console.log(`⬇️ Descarga genérica: http://localhost:${PORT}/api/download/[filename]`)
  
  // Verificar archivos físicos
  if (fs.existsSync(machinesDir)) {
    const files = fs.readdirSync(machinesDir);
    console.log(`🗃️ Archivos físicos: ${files.join(', ')}`);
  }
  
  console.log(`✅ Sistema completo listo para uso`)
})