const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    const timestamp = Date.now()
    cb(null, `${machineName}-${timestamp}.zip`)
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB límite
  },
  fileFilter: (req, file, cb) => {
    // Permitir archivos ZIP, OVA, VMDK, etc.
    const allowedTypes = ['.zip', '.ova', '.vmdk', '.vdi', '.iso']
    const fileExtension = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'), false)
    }
  }
})

// Servir archivos estáticos
app.use('/uploads', express.static(uploadsDir))

// =====================================================
// RUTAS DE AUTENTICACIÓN
// =====================================================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  
  // Verificación simple - en producción usar base de datos y bcrypt
  if (username === 'admin' && password === 'Admin123!') {
    res.json({
      success: true,
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@cybertrack.cl',
        first_name: 'Administrador',
        last_name: 'CyberTrack',
        role: 'admin'
      },
      token: 'fake_jwt_token' // En producción, generar JWT real
    })
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Credenciales incorrectas' 
    })
  }
})

// =====================================================
// RUTAS DE UPLOAD DE MÁQUINAS
// =====================================================

app.post('/api/upload', upload.single('machine'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No se ha enviado ningún archivo' 
      })
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    }

    console.log(`📤 Archivo subido: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`)

    res.json({
      success: true,
      message: 'Archivo subido exitosamente',
      file: fileInfo
    })

  } catch (error) {
    console.error('Error en upload:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      message: error.message 
    })
  }
})

// =====================================================
// RUTAS DE DESCARGA DE MÁQUINAS
// =====================================================

app.get('/api/download/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(machinesDir, filename)
    
    console.log(`📁 Buscando archivo: ${filePath}`)
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filename}`)
      return res.status(404).json({ 
        error: 'Archivo no encontrado',
        message: `El archivo ${filename} no existe en el servidor`,
        path: filePath
      })
    }
    
    // Obtener información del archivo
    const stats = fs.statSync(filePath)
    console.log(`✅ Archivo encontrado: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    
    // Headers para forzar descarga
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Length', stats.size)
    
    // Log de inicio de descarga
    console.log(`📥 Descarga iniciada: ${filename}`)
    
    // Crear stream y enviar archivo
    const fileStream = fs.createReadStream(filePath)
    
    fileStream.on('error', (error) => {
      console.error(`❌ Error en stream de ${filename}:`, error)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error al leer el archivo' })
      }
    })
    
    fileStream.on('end', () => {
      console.log(`✅ Descarga completada: ${filename}`)
    })
    
    fileStream.pipe(res)
    
  } catch (error) {
    console.error('❌ Error en descarga:', error)
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    })
  }
})

// =====================================================
// RUTAS DE GESTIÓN DE ARCHIVOS
// =====================================================

app.get('/api/files', (req, res) => {
  try {
    if (!fs.existsSync(machinesDir)) {
      return res.json({ 
        files: [], 
        total: 0,
        message: 'Directorio de máquinas no existe',
        directory: machinesDir
      })
    }
    
    const files = fs.readdirSync(machinesDir).map(filename => {
      const filePath = path.join(machinesDir, filename)
      const stats = fs.statSync(filePath)
      
      return {
        filename,
        originalName: filename.replace(/-\d+\.zip$/, ''), // Remover timestamp
        size: stats.size,
        sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        downloadUrl: `/api/download/${filename}`,
        created: stats.birthtime,
        modified: stats.mtime,
        extension: path.extname(filename)
      }
    })
    
    // Ordenar por fecha de creación (más recientes primero)
    files.sort((a, b) => new Date(b.created) - new Date(a.created))
    
    res.json({ 
      success: true,
      files,
      total: files.length,
      directory: machinesDir,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    })
    
  } catch (error) {
    console.error('Error listando archivos:', error)
    res.status(500).json({ 
      success: false,
      error: 'Error al listar archivos',
      message: error.message 
    })
  }
})

// Eliminar archivo
app.delete('/api/files/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(machinesDir, filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false,
        error: 'Archivo no encontrado' 
      })
    }
    
    fs.unlinkSync(filePath)
    console.log(`🗑️ Archivo eliminado: ${filename}`)
    
    res.json({ 
      success: true,
      message: `Archivo ${filename} eliminado exitosamente` 
    })
    
  } catch (error) {
    console.error('Error eliminando archivo:', error)
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar archivo',
      message: error.message 
    })
  }
})

// =====================================================
// RUTAS DE INFORMACIÓN
// =====================================================

app.get('/api/health', (req, res) => {
  const vmsExists = fs.existsSync(machinesDir)
  const uploadsExists = fs.existsSync(uploadsDir)
  
  let fileCount = 0
  let totalSize = 0
  
  if (vmsExists) {
    try {
      const files = fs.readdirSync(machinesDir)
      fileCount = files.length
      totalSize = files.reduce((sum, filename) => {
        const filePath = path.join(machinesDir, filename)
        const stats = fs.statSync(filePath)
        return sum + stats.size
      }, 0)
    } catch (error) {
      console.error('Error calculando estadísticas:', error)
    }
  }
  
  res.json({ 
    status: 'OK', 
    message: 'CyberTrack Viña Backend - Sistema de Máquinas Virtuales',
    timestamp: new Date().toISOString(),
    directories: {
      uploads: uploadsExists,
      machines: vmsExists
    },
    statistics: {
      totalFiles: fileCount,
      totalSize: totalSize,
      totalSizeFormatted: `${(totalSize / 1024 / 1024).toFixed(2)} MB`
    },
    paths: {
      uploads: uploadsDir,
      machines: machinesDir
    },
    port: PORT,
    nodeVersion: process.version
  })
})

// Obtener estadísticas del sistema
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    }
    
    if (fs.existsSync(machinesDir)) {
      const files = fs.readdirSync(machinesDir)
      stats.files = {
        count: files.length,
        totalSize: files.reduce((sum, filename) => {
          const filePath = path.join(machinesDir, filename)
          const fileStats = fs.statSync(filePath)
          return sum + fileStats.size
        }, 0)
      }
    }
    
    res.json(stats)
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    res.status(500).json({ error: error.message })
  }
})

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Middleware de manejo de errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Archivo demasiado grande',
        message: 'El archivo excede el límite de 500MB'
      })
    }
  }
  
  console.error('Error no manejado:', error)
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: error.message
  })
})

// Ruta 404 para APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`
  })
})

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor CyberTrack Viña ejecutándose en puerto ${PORT}`)
  console.log(`📁 Directorio de uploads: ${uploadsDir}`)
  console.log(`💾 Directorio de máquinas: ${machinesDir}`)
  console.log(`🌐 Salud del sistema: http://localhost:${PORT}/api/health`)
  console.log(`📋 Lista de archivos: http://localhost:${PORT}/api/files`)
  console.log(`📤 Endpoint de upload: http://localhost:${PORT}/api/upload`)
  console.log(`⬇️ Endpoint de descarga: http://localhost:${PORT}/api/download/[filename]`)
  
  // Verificar que los directorios existan
  if (fs.existsSync(machinesDir)) {
    const files = fs.readdirSync(machinesDir)
    console.log(`📦 Máquinas disponibles: ${files.length}`)
    if (files.length > 0) {
      console.log(`🗃️ Archivos: ${files.join(', ')}`)
    }
  }
  
  console.log(`✅ Sistema listo para uso`)
})