🔒 CyberLab Platform

Plataforma web moderna para distribución de máquinas Docker de ciberseguridad
Inspirada en TRACK CIBERSEGURIDAD para talleres y laboratorios de seguridad informática

Version 1.0 | MIT License | Node.js + Next.js

📋 Tabla de Contenidos

🎯 Características
🛠️ Stack Tecnológico
📁 Estructura del Proyecto
⚙️ Instalación
🚀 Uso
🔐 Administración
🐳 Docker
☁️ Despliegue
🤝 Contribución
📄 Licencia


🎯 Características
✨ Funcionalidades Principales

🎨 Interfaz Cyberpunk - Diseño moderno con temática de ciberseguridad
📱 Responsive Design - Adaptable a todos los dispositivos
🔍 Sistema de Filtros - Búsqueda por dificultad, categoría y texto libre
📥 Descarga de Máquinas - ZIPs listos para usar con Docker
⭐ Sistema de Favoritos - Marca máquinas como destacadas
📊 Gestión de Contenido - Panel de administración completo

🔐 Panel de Administración

👤 Autenticación Segura - Login protegido para administradores
✏️ Edición de Máquinas - Modifica descripción, dificultad y tags
📝 Gestión de Writeups - Agrega soluciones y guías paso a paso
📤 Subida de Contenido - Carga nuevas máquinas Docker
📈 Estadísticas - Contadores de máquinas y descargas

📚 Sistema de Writeups

🔗 Enlaces Externos - URLs a writeups web o PDFs
📄 Descripciones - Contexto y información adicional
👨‍💻 Autoría - Registro de quién agregó cada writeup
🕒 Timestamps - Fecha de creación automática


🛠️ Stack Tecnológico
Frontend

Next.js 14 - Framework React para aplicaciones web
React 18 - Librería para interfaces de usuario
Tailwind CSS - Framework CSS utilitario
Lucide React - Iconos modernos

Backend

Node.js - Runtime de JavaScript
Express.js 4.18 - Framework web minimalista
JWT - Autenticación con tokens
Multer - Manejo de archivos

DevOps

Docker - Contenedorización
Docker Compose - Orquestación de servicios
AWS EC2 - Despliegue en la nube


📁 Estructura del Proyecto
cyberlab-platform/
├── 🎨 frontend/               # Aplicación Next.js
│   ├── 📄 src/pages/          # Páginas principales
│   ├── 🧩 src/components/     # Componentes React
│   │   ├── Header/            # Barra de navegación
│   │   ├── MachineCard/       # Tarjetas de máquinas
│   │   ├── FilterBar/         # Sistema de filtros
│   │   ├── AdminPanel/        # Panel de administración
│   │   └── LoginModal/        # Modal de login
│   ├── 🎨 src/styles/         # Estilos globales
│   └── 📦 package.json        # Dependencias frontend
├── ⚙️ backend/                # API Express.js
│   ├── 📤 uploads/            # Archivos subidos
│   │   └── machines/          # ZIPs de máquinas
│   ├── 📦 package.json        # Dependencias backend
│   ├── 🔐 .env.example        # Variables de entorno
│   └── 🚀 server.js           # Servidor principal
├── 🐳 docker-machines/        # Máquinas Docker de ejemplo
│   ├── anonymouspingu/        # Técnicas de anonimato
│   ├── dance-samba/           # Explotación web
│   ├── inclusion/             # File inclusion
│   ├── mirame/                # Vulnerabilidades básicas
│   ├── pinguinazo/            # Desafío avanzado
│   └── whoiam/                # Escalada de privilegios
├── 📚 docs/                   # Documentación
├── 🐳 docker-compose.yml      # Configuración Docker
└── 📖 README.md               # Este archivo

⚙️ Instalación
📋 Prerrequisitos

Node.js 18.0 o superior
npm o yarn
Git

🚀 Configuración Rápida
1. Clonar el repositorio
bashgit clone https://github.com/Suikon1/cyberlab-platform.git
cd cyberlab-platform
2. Configurar Backend
bashcd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
3. Configurar Frontend
bashcd frontend
npm install
npm run dev
4. Acceder a la aplicación

Frontend: http://localhost:3000
Backend API: http://localhost:5000


🚀 Uso
👥 Para Usuarios

🌐 Navegación: Explora las máquinas Docker disponibles
🔍 Filtros: Busca por dificultad (Fácil, Intermedio, Avanzado)
📥 Descarga: Haz clic en "Descargar Máquina" para obtener el ZIP
📖 Writeups: Consulta las soluciones disponibles para cada máquina
⭐ Favoritos: Identifica máquinas destacadas con estrellas

👨‍💼 Para Administradores

🔐 Login: Inicia sesión con credenciales de administrador
⚙️ Panel Admin: Accede al panel de administración
✏️ Edición: Modifica descripción, dificultad y tags de máquinas
📝 Writeups: Agrega enlaces a writeups (web o PDF)
📤 Subida: Carga nuevas máquinas Docker en formato ZIP


🔐 Administración
🔑 Credenciales por Defecto
Usuario: admin
Contraseña: password

⚠️ IMPORTANTE: Cambiar estas credenciales en producción

🛡️ Configuración de Seguridad
Edita el archivo backend/.env:
bash# backend/.env
NODE_ENV=production
PORT=5000
JWT_SECRET=clave_jwt_muy_larga_y_compleja_123456789
ADMIN_USERNAME=tu_usuario_seguro
ADMIN_PASSWORD=tu_password_ultra_seguro
📝 Gestión de Writeups
Los writeups admiten diferentes formatos:

🌐 URLs web: Blogs, GitHub, páginas personales
📄 PDFs: Documentos alojados en cualquier servidor
📝 Plataformas: Google Drive, Notion, GitBook, etc.

Ejemplo de writeup:
Título: "Solución completa AnonymousPingu"
URL: https://mi-blog.com/writeup-anonymouspingu
Descripción: "Walkthrough paso a paso con técnicas de OSINT"

🐳 Docker
🚀 Ejecución con Docker Compose
bash# Levantar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down
📋 Servicios Disponibles

Frontend: Puerto 3000 (Next.js)
Backend: Puerto 5000 (Express.js)
Base de datos: Puerto 27017 (MongoDB - opcional)

🔧 Comandos Útiles
bash# Ver estado de contenedores
docker-compose ps

# Acceder a logs específicos
docker-compose logs backend
docker-compose logs frontend

# Ejecutar comandos en contenedores
docker-compose exec backend npm install nueva-dependencia

☁️ Despliegue
🔶 AWS EC2 (Recomendado)
1. Preparar instancia EC2
bash# Conectar por SSH
ssh -i tu-key.pem ubuntu@tu-ip-ec2

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2
2. Desplegar aplicación
bash# Clonar proyecto
git clone https://github.com/Suikon1/cyberlab-platform.git
cd cyberlab-platform

# Configurar backend
cd backend
npm install
cp .env.example .env
# Editar .env con configuración de producción

# Configurar frontend
cd ../frontend
npm install
npm run build

# Ejecutar con PM2
cd ../backend
pm2 start server.js --name "cyberlab-api"
cd ../frontend
pm2 start "npm start" --name "cyberlab-web"

# Configurar autostart
pm2 startup
pm2 save
3. Configurar firewall
bash# Abrir puertos necesarios
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Frontend
sudo ufw allow 5000  # Backend API
sudo ufw enable
🌐 Otros Proveedores

Vercel: Para frontend estático
Heroku: Para full-stack con add-ons
DigitalOcean: Droplets con configuración similar a EC2
Railway: Despliegue automático desde GitHub


🧪 Máquinas Incluidas
Anonymouspingu🟢 Dance-samba🟡 Inclusion🟡 Mirame🟡 Pinguinazo🟡 Whoiam🟢 

🤝 Contribución
¡Las contribuciones son bienvenidas! 🎉
📝 Cómo Contribuir

🍴 Fork el proyecto
🌟 Crea una rama: git checkout -b feature/AmazingFeature
💾 Commit cambios: git commit -m 'Add AmazingFeature'
📤 Push la rama: git push origin feature/AmazingFeature
🔄 Abre un Pull Request

🐛 Reportar Issues
Para reportar bugs o solicitar features, usa los Issues de GitHub.
💡 Roadmap Futuro

 🗄️ Integración con MongoDB real
 🔐 Autenticación con 2FA
 📊 Dashboard de estadísticas avanzadas
 🌍 Soporte multi-idioma (ES/EN)
 🔔 Sistema de notificaciones
 📈 Analytics de descargas
 🏆 Sistema de puntuación
 💬 Comentarios en writeups

👨‍💻 Autor
Suikon1 - Desarrollo completo - @Suikon1

🙏 Agradecimientos

🎨 Inspiración: TRACK CIBERSEGURIDAD VINA
🐳 Máquinas Docker: dockerlabs.es - Fuente de las máquinas de ciberseguridad
🛠️ Herramientas: Next.js, Express.js, Tailwind CSS
🎨 Iconos: Lucide React
🌍 Comunidad: Desarrolladores de ciberseguridad


📞 Contacto

GitHub: @Suikon1
Proyecto: cyberlab-platform


<div align="center">
🌟 ¡Si te gusta el proyecto, dale una estrella!
Hecho con ❤️ para la comunidad de ciberseguridad
</div>
