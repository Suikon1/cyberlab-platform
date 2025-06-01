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
  const filePath = path.join(__dirname, 'uploads', 'machines', `${machineName}.zip`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Máquina no encontrada' });
  }
  
  const stats = fs.statSync(filePath);
  
  res.setHeader('Content-Disposition', `attachment; filename="${machineName}.zip"`);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Length', stats.size);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  
  console.log(`📥 Descargando: ${machineName}.zip`);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    machines: machines.length
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`📡 API disponible en: http://localhost:${PORT}`)
  console.log(`🔒 Frontend en: http://localhost:3000`)
  console.log(`👤 Admin: usuario=admin, password=password`)
})