# 🔧 GRIND Backend - API REST Node.js

API REST completa para e-commerce construida con Node.js, Express.js y MongoDB.

## 🚀 Inicio Rápido

### Instalación
```bash
# Windows, macOS, Linux
npm install
```

### Variables de Entorno
Crear archivo `.env` en la raíz de `TO_BACK`:

#### Windows
```cmd
REM Crear archivo .env
echo. > .env
REM Editar con notepad
notepad .env
```

#### macOS/Linux
```bash
# Crear archivo .env
touch .env
# Editar con tu editor preferido
nano .env
# o
code .env
```

**Contenido del archivo `.env`:**
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/tienda_online
# o MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>

# JWT (generar uno seguro para producción)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=development

# Cloudinary (obtener en cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

**💡 Generar JWT_SECRET seguro:**

#### Windows
```cmd
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### macOS/Linux
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# o
openssl rand -hex 64
```

### Ejecutar Servidor

#### Todos los SO
```bash
npm run dev    # Desarrollo con nodemon
npm start      # Producción
```

### Poblar Base de Datos
```bash
# Todos los SO
npm run seed           # Todos los datos de prueba
npm run seed:users     # Solo usuarios  
npm run seed:products  # Solo productos
```

#### Verificar que funciona
- Backend disponible en: http://localhost:5000
- Documentación API: http://localhost:5000/api-docs
- MongoDB conectado (verificar logs)
- Cloudinary configurado (si se usa)

## 🛠️ Tecnologías Utilizadas

### Core
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Autenticación y Seguridad
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hashing seguro de contraseñas
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Control de acceso de origen cruzado

### Servicios Externos
- **Cloudinary** - Gestión de imágenes en la nube
- **Multer** - Manejo de archivos multipart

### Desarrollo y Documentación
- **Swagger** - Documentación interactiva de API
- **Morgan** - Logging de solicitudes HTTP
- **Nodemon** - Recarga automática en desarrollo

## 📁 Estructura del Proyecto

```
TO_BACK/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración MongoDB
│   │   └── swagger.js       # Configuración Swagger
│   ├── controllers/
│   │   ├── authController.js     # Autenticación
│   │   ├── productController.js  # Productos
│   │   ├── cartController.js     # Carrito
│   │   ├── userController.js     # Usuarios
│   │   ├── adminController.js    # Panel admin
│   │   └── uploadController.js   # Subida de archivos
│   ├── middleware/
│   │   ├── auth.js          # Verificación JWT
│   │   ├── upload.js        # Configuración Multer
│   │   └── validation.js    # Validaciones
│   ├── models/
│   │   ├── User.js          # Modelo de usuario
│   │   ├── Product.js       # Modelo de producto
│   │   └── Cart.js          # Modelo de carrito
│   ├── routes/
│   │   ├── authRoutes.js    # Rutas de autenticación
│   │   ├── productRoutes.js # Rutas de productos
│   │   ├── cartRoutes.js    # Rutas de carrito
│   │   ├── userRoutes.js    # Rutas de usuario
│   │   ├── adminRoutes.js   # Rutas de admin
│   │   └── uploadRoutes.js  # Rutas de upload
│   ├── seeds/
│   │   ├── allSeeds.js      # Script principal de seeding
│   │   ├── userSeeds.js     # Datos de usuarios
│   │   └── productSeeds.js  # Datos de productos
│   ├── services/
│   │   ├── cartService.js      # Lógica de carrito
│   │   ├── cloudinaryService.js # Gestión de imágenes
│   │   └── filterService.js    # Filtros de productos
│   ├── app.js               # Configuración Express
│   └── server.js            # Punto de entrada
├── uploads/
│   └── temp/                # Archivos temporales
└── tests/                   # Pruebas (futuro)
```

## 🔌 API Endpoints

### 🔐 Autenticación (`/api/auth`)
- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión
- `GET /profile` - Perfil del usuario autenticado

### 📦 Productos (`/api/products`)
- `GET /` - Listar productos con filtros
- `GET /categories` - Obtener categorías disponibles
- `GET /:id` - Obtener producto específico
- `POST /` - Crear producto (admin)
- `PUT /:id` - Actualizar producto (admin)
- `DELETE /:id` - Eliminar producto (admin)

### 🛒 Carrito (`/api/cart`)
- `GET /` - Obtener carrito del usuario
- `POST /add` - Agregar producto al carrito
- `PUT /update` - Actualizar cantidad de producto
- `DELETE /remove/:productId` - Eliminar producto del carrito

### 👥 Usuarios (`/api/users`)
- `GET /profile` - Obtener perfil de usuario
- `PUT /profile` - Actualizar perfil de usuario

### 👨‍💼 Administración (`/api/admin`)
- `GET /users` - Listar todos los usuarios
- `GET /stats` - Estadísticas del dashboard
- `PUT /users/:id/role` - Cambiar rol de usuario

### 📸 Subida de Archivos (`/api/upload`)
- `POST /image` - Subir imagen a Cloudinary
- `DELETE /image/:publicId` - Eliminar imagen de Cloudinary

### 📚 Documentación
- `GET /api-docs` - Swagger UI con documentación interactiva

## 🔒 Seguridad Implementada

### Autenticación JWT
- Tokens seguros con expiración configurable
- Middleware de verificación en rutas protegidas
- Refresh token (considerar implementar)

### Hashing de Contraseñas
- Bcrypt con salt para máxima seguridad
- Validación de fortaleza de contraseña

### Headers de Seguridad
- Helmet.js para headers HTTP seguros
- CORS configurado específicamente
- Rate limiting (considerar para producción)

### Validación de Datos
- Validación en modelos Mongoose
- Sanitización de inputs
- Manejo seguro de archivos

## 💾 Base de Datos

### Modelos Principales

**Usuario (User)**
- Información personal y autenticación
- Roles (user/admin)
- Timestamps automáticos

**Producto (Product)**
- Información del producto
- Categorización
- Gestión de stock
- URLs de imágenes (Cloudinary)

**Carrito (Cart)**
- Asociación usuario-productos
- Cantidades y precios
- Cálculo automático de totales

### Índices Optimizados
- Índices en campos de búsqueda frecuente
- Índices compuestos para consultas complejas
- Índices de texto para búsqueda

## 🌐 Integración con Servicios

### Cloudinary
- Subida automática de imágenes
- Transformaciones automáticas
- URLs optimizadas para web
- Eliminación segura de archivos

### MongoDB
- Conexión con pooling optimizado
- Manejo de reconexión automática
- Configuración para desarrollo/producción

## 🚀 Despliegue en Producción

### Variables de Entorno Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production_secret_very_secure
FRONTEND_URL=https://tu-dominio.com
```

### Consideraciones
- Usar MongoDB Atlas o servidor dedicado
- Implementar rate limiting
- Configurar HTTPS
- Logs centralizados
- Monitoring y alertas
- Backup automático de BD

## 🧪 Testing (Futuro)

Estructura preparada para testing:
- Tests unitarios con Jest
- Tests de integración para API
- Mocks para servicios externos
- Coverage reports

## 🤝 Desarrollo

### Scripts de Utilidad
- Seeding de datos de prueba
- Validación de esquemas
- Limpieza de archivos temporales
- Backup/restore de datos

### Debugging
- Morgan para logging de requests
- Console logs estructurados
- Error handling centralizado

Consulta el README principal para instrucciones de configuración completa del proyecto.