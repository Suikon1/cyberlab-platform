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

// DATOS EN MEMORIA (sin base de datos)
let machines = [
  {
    id: 1,
    name: 'anonymouspingu',
    difficulty: 'Intermedio',
    description: 'Máquina de pentesting enfocada en técnicas de anonimato y steganografía avanzada',
    size: '231.2 MB',
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
    size: '159.3 MB',
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
    size: '187.6 MB',
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
    size: '142.8 MB',
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
    size: '203.1 MB',
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
    size: '188.5 MB',
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

// RUTAS

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: '🔒 CyberLab API funcionando correctamente!',
    version: '1.0.0',
    status: 'online'
  })
})

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

// Obtener máquinas
app.get('/api/machines', (req, res) => {
  res.json(machines)
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

    // Obtener tamaño del archivo subido
    const fileSize = getFileSize(req.file.path)

    // Crear nueva máquina
    const newMachine = {
      id: Math.max(...machines.map(m => m.id)) + 1,
      name: name,
      difficulty: difficulty,
      description: description,
      size: fileSize,
      tags: tagsArray,
      completed: false,
      starred: false,
      writeups: []
    }

    // Agregar a la lista de máquinas
    machines.push(newMachine)

    console.log(`✅ Nueva máquina agregada: ${name} (${fileSize})`)

    res.json({
      message: 'Máquina subida exitosamente',
      machine: newMachine
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
    
    res.json({ 
      message: 'Máquina actualizada exitosamente',
      machine: machines[machineIndex]
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

// Descargar máquina
app.get('/api/machines/:name/download', (req, res) => {
  const machineName = req.params.name;
  const filePath = path.join(machinesDir, `${machineName}.zip`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo de máquina no encontrado' });
  }
  
  const stats = fs.statSync(filePath);
  
  res.setHeader('Content-Disposition', `attachment; filename="${machineName}.zip"`);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Length', stats.size);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  
  console.log(`📥 Descargando: ${machineName}.zip (${getFileSize(filePath)})`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    machines: machines.length,
    uploadsDir: uploadsDir
  })
})

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📡 API disponible en: http://localhost:${PORT}`)
  console.log(`🔒 Frontend en: http://localhost:3000`)
  console.log(`👤 Admin: usuario=admin, password=password`)
  console.log(`📁 Directorio de uploads: ${machinesDir}`)
  console.log(`💾 Máquinas cargadas: ${machines.length}`)
})
// Add this to your backend server.js file

// Improved download route with better error handling and logging
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

// Add a route to check if a machine file exists
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

// Call this when starting the server
ensureDirectoriesExist();