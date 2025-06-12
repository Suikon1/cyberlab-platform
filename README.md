# 🔒 CyberTrack Viña - Plataforma de Laboratorio de Ciberseguridad

Una plataforma web moderna para la gestión y distribución de máquinas virtuales de práctica en ciberseguridad desarrollada para el laboratorio del Track De Ciberseguridad. Duoc UC Viña Del Mar

![CyberTrack](https://img.shields.io/badge/CyberTrack-Viña-cyan?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Database](https://img.shields.io/badge/MySQL-Ready-orange?style=for-the-badge)

## ✨ Características Principales

- 🖥️ **Catálogo de Máquinas**: Navegación intuitiva y filtrado avanzado de máquinas virtuales
- 📥 **Descargas Directas**: Sistema de descarga real de archivos ZIP de máquinas
- 🔐 **Panel de Administración**: Gestión completa de contenido para administradores
- 📚 **Sistema de Writeups**: Documentación y soluciones organizadas por máquina
- 🎯 **Filtros Inteligentes**: Búsqueda por dificultad, tags, nombre y descripción
- 🎨 **Interfaz Moderna**: Diseño responsive con gradientes cyberpunk
- 🛡️ **Autenticación Segura**: Sistema de login con roles de usuario
- ⭐ **Favoritos**: Marcar máquinas como favoritas
- 🏷️ **Sistema de Tags**: Organización por categorías técnicas

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Clonar el Repositorio
```bash
git clone https://github.com/Suikon1/cyberlab-platform.git
cd cyberlab-platform
```

### Configuración del Backend
```bash
cd backend
npm install

# Crear archivo de entorno (opcional)
echo "PORT=5000" > .env

# Iniciar servidor de desarrollo
npm run dev
```

### Configuración del Frontend
```bash
cd frontend
npm install

# Iniciar aplicación
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` (opcional):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=track25
DB_USER=root
DB_PASSWORD=tu_password
```

### Configuración de Base de Datos (MySQL) ✅
**¡La base de datos MySQL ya está configurada y funcionando!**

1. **MySQL Server** y **MySQL Workbench 8.0 CE** están instalados
2. **Base de datos `cyberlab`** está creada y operativa
3. **Variables de entorno** están configuradas correctamente

### Credenciales de Administrador
- **Usuario**: `admin`
- **Contraseña**: `password`

### URLs de Desarrollo
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Panel Admin**: http://localhost:3000 (click en "Login" → usar credenciales admin)

## 📁 Estructura del Proyecto

```
cyberlab-platform/
├── 📂 backend/                    # Servidor Node.js + Express
│   ├── 📂 controllers/           # Controladores de lógica de negocio
│   ├── 📂 machines/              # 📁 Archivos ZIP de máquinas (*.zip)
│   ├── 📂 middleware/            # Middlewares personalizados
│   ├── 📂 models/                # Modelos de datos y esquemas
│   ├── 📂 public/                # Archivos estáticos públicos
│   ├── 📂 routes/                # Definición de rutas de la API
│   ├── 📂 uploads/               # 📁 Archivos subidos por usuarios
│   ├── server.js                 # Servidor principal con todas las rutas
│   ├── create-test-files.js      # Utilidad para crear archivos de prueba
│   ├── package.json              # Dependencias del backend
│   ├── package-lock.json         # Lock de dependencias
│   └── .env                      # Variables de entorno (opcional)
├── 📂 frontend/                  # Aplicación Next.js + React
│   ├── 📂 components/            # Componentes React reutilizables
│   │   ├── Header/               # Navegación principal
│   │   ├── MachineCard/          # Tarjetas de máquinas virtuales
│   │   ├── FilterBar/            # Barra de filtros y búsqueda
│   │   ├── AdminPanel/           # Panel de administración
│   │   ├── LoginModal/           # Modal de autenticación
│   │   └── UploadModal/          # Modal de subida de archivos
│   ├── 📂 hooks/                 # Custom React Hooks
│   ├── 📂 pages/                 # Páginas de Next.js
│   ├── 📂 styles/                # Estilos globales
│   ├── 📂 utils/                 # Funciones utilitarias
│   ├── next.config.js            # Configuración de Next.js
│   ├── package.json              # Dependencias del frontend
│   ├── package-lock.json         # Lock de dependencias
│   ├── postcss.config.js         # Configuración de PostCSS
│   └── tailwind.config.js        # Configuración de Tailwind CSS
├── 📂 docker-machines/           # Código fuente de máquinas virtuales
│   ├── anonymouspingu/           # Máquina de steganografía
│   ├── dance-samba/              # Máquina de explotación web
│   ├── mirage/                   # Máquina de red y pentesting
│   └── whoiam/                   # Máquina de escalada de privilegios
├── 📂 MySQL/                     # Configuración y datos de MySQL
│   └── Local/                    # Base de datos local
├── 📂 docs/                      # Documentación del proyecto
├── .env                          # Variables de entorno globales
├── .gitignore                    # Archivos excluidos de Git
├── docker-compose.yml            # Configuración de Docker Compose
├── LICENSE                       # Licencia MIT del proyecto
├── package.json                  # Dependencias principales del proyecto
├── package-lock.json             # Lock de dependencias principales
└── README.md                     # Este archivo
```

## 🎮 Máquinas Disponibles

| Nombre | Dificultad | Tags Principales |
|--------|------------|------------------|
| **anonymouspingu** | 🟡 Intermedio | Steganography, OSINT, Network |
| **dance-samba** | 🟢 Fácil | Web, SQLi, File Upload |
| **inclusion** | 🟡 Intermedio | File Inclusion, LFI, RFI, Linux |
| **mirame** | 🟢 Fácil | Beginner, Web, Enumeration |
| **pinguinazo** | 🔴 Avanzado | Advanced, Multi-vector, Exploitation |
| **whoiam** | 🟡 Intermedio | Privilege Escalation, Linux, Identity |

## 🛠️ Funcionalidades Técnicas

### Sistema de Autenticación
- Login persistente con localStorage
- Verificación de roles (admin/usuario)
- Sesiones automáticas
- Logout seguro

### Sistema de Descargas
- Descarga directa de archivos ZIP
- Verificación de existencia de archivos
- Manejo de errores elegante
- Feedback visual de progreso

### Panel de Administración
- Edición de descripciones de máquinas
- Gestión de dificultades y tags
- Añadir/editar writeups
- Vista previa en tiempo real

### Filtros y Búsqueda
- Búsqueda por texto (nombre/descripción)
- Filtro por dificultad
- Filtro por tags
- Resultados instantáneos

## 🎨 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework de React
- **React 18** - Biblioteca de interfaz de usuario
- **Tailwind CSS** - Framework de estilos utilitarios
- **Lucide React** - Iconos modernos
- **Context API** - Manejo de estado global

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web minimalista
- **MySQL** - Base de datos relacional (implementada)
- **CORS** - Manejo de políticas de origen cruzado
- **Multer** - Manejo de archivos multipart

### Base de Datos
- **MySQL Workbench 8.0 CE** - Herramienta de administración de base de datos
- **MySQL Server** - Sistema de gestión de base de datos en producción

### Herramientas de Desarrollo
- **ESLint** - Linter de JavaScript
- **Nodemon** - Recarga automática del servidor
- **PostCSS** - Procesador de CSS

## 👥 Uso de la Plataforma

### Para Estudiantes
1. **Navegar el catálogo** de máquinas disponibles
2. **Filtrar por dificultad** o buscar por nombre
3. **Descargar máquinas** haciendo click en "Descargar Máquina"
4. **Ver writeups** disponibles para cada máquina
5. **Marcar favoritos** para acceso rápido

### Para Administradores
1. **Hacer login** con credenciales de admin
2. **Acceder al panel** de administración
3. **Editar información** de máquinas existentes
4. **Agregar writeups** con enlaces y descripciones
5. **Gestionar contenido** de forma dinámica

## 🔐 Seguridad

### Medidas Implementadas
- Sanitización de nombres de archivo
- Verificación de roles de usuario
- Exclusión de archivos sensibles en Git (.gitignore)
- Validación de entrada de usuarios
- Prevención de path traversal
- Límites de tamaño de archivo (500MB)

## 🚧 Desarrollo y Contribución

### Ejecutar en Modo Desarrollo
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Contribuir al Proyecto
1. **Fork** el repositorio
2. **Crear rama** feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'feat: nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abrir Pull Request**

### Convención de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: añadir tests
chore: tareas de mantenimiento
```

## 📊 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Sistema de usuarios registrados con roles
- [ ] Comentarios en máquinas
- [ ] Sistema de rating/calificaciones
- [ ] Dashboard de estadísticas avanzadas
- [ ] Historial de descargas por usuario

### Versión 1.2 (Futuro)
- [ ] API REST completa
- [ ] Integración con Docker Hub
- [ ] Sistema de notificaciones
- [ ] Múltiples laboratorios
- [ ] Exportar progreso de usuarios

## 🐛 Problemas Conocidos

- Los archivos ZIP deben ubicarse manualmente en `backend/machines/`
- El sistema de autenticación es básico (sin JWT real)
- Subida de archivos requiere configuración de permisos del servidor

## 📞 Soporte

- **Desarrolladores**: [Suikon1](https://github.com/Suikon1) y [Auxinh0](https://github.com/sudoaux801)
- **Issues**: [GitHub Issues](https://github.com/Suikon1/cyberlab-platform/issues)
- **Universidad**: Duoc UC Sede Viña Del Mar

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo `LICENSE` para más detalles.

---

<div align="center">

**Desarrollado con ❤️ para la comunidad de ciberseguridad**

[🌟 Dar una estrella](https://github.com/Suikon1/cyberlab-platform) • [🐛 Reportar Bug](https://github.com/Suikon1/cyberlab-platform/issues) • [💡 Solicitar Feature](https://github.com/Suikon1/cyberlab-platform/issues)

</div>
