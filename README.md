# Backend Tienda Online

API REST desarrollada con Node.js, Express y MongoDB para una tienda online con **autenticación JWT** y **control de acceso basado en roles**.

## 🚀 Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Entorno de ejecución JavaScript |
| **Express** | Framework web para APIs REST |
| **MongoDB** | Base de datos NoSQL |
| **Mongoose** | ODM para MongoDB |
| **bcrypt** | Encriptación de contraseñas |
| **jsonwebtoken** | Autenticación JWT |
| **CORS** | Control de acceso cross-origin |
| **Helmet** | Headers de seguridad |
| **Morgan** | Logging de requests |

## 📋 Prerrequisitos

- **Node.js** v14 o superior
- **npm** v6 o superior
- **MongoDB** instalado y ejecutándose

### Instalar Node.js

#### Windows
1. Descargar desde [nodejs.org](https://nodejs.org/)
2. Ejecutar el instalador `.msi`
3. Verificar instalación: `node --version` y `npm --version`

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install node

# O descargar desde nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Usando repositorio oficial
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Instalar MongoDB

#### Windows
1. Descargar MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Ejecutar el instalador `.msi`
3. Seleccionar "Complete" installation
4. Instalar como servicio de Windows
5. Verificar que el servicio "MongoDB" esté ejecutándose en Services

#### macOS
```bash
# Usando Homebrew (recomendado)
brew tap mongodb/brew
brew install mongodb-community

# Iniciar el servicio
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Crear archivo de lista
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar el servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

## ⚡ Instalación

1. **Clona el repositorio o navega a la carpeta del backend:**
```bash
cd TO_BACK
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configuración de variables de entorno:**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu entorno
nano .env  # o usar tu editor preferido
```

**Variables de entorno requeridas:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tienda_online
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
```

> **⚠️ Importante:** Generar un JWT_SECRET seguro para producción:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

## 🗄️ Base de Datos

### Iniciar MongoDB

#### Windows
- MongoDB se ejecuta automáticamente como servicio de Windows
- Para verificar: Ir a Services y buscar "MongoDB"
- Para iniciar manualmente: `net start MongoDB`
- Para detener: `net stop MongoDB`

#### macOS
```bash
# Con Homebrew (recomendado)
brew services start mongodb-community

# Detener
brew services stop mongodb-community

# O ejecutar manualmente
mongod --config /usr/local/etc/mongod.conf
```

#### Linux
```bash
# Iniciar el servicio
sudo systemctl start mongod

# Detener
sudo systemctl stop mongod

# Verificar estado
sudo systemctl status mongod

# Habilitar inicio automático
sudo systemctl enable mongod
```

### Poblar la base de datos con datos de prueba
```bash
npm run seed
```

**Usuarios creados:**

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `test@test.com` | `12345678` | **client** | Usuario de prueba estándar |
| `admin@test.com` | `12345678` | **admin** | Administrador principal |
| `superadmin@test.com` | `12345678` | **admin** | Super administrador |
| `juan@test.com` | `12345678` | **client** | Cliente de ejemplo |
| `maria@test.com` | `12345678` | **client** | Cliente de ejemplo |
| `carlos@test.com` | `12345678` | **client** | Cliente de ejemplo |

## 🏃‍♂️ Ejecutar la aplicación

### Modo desarrollo (con recarga automática)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se ejecutará en: `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Ejemplo de datos |
|--------|----------|-------------|------------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | `{"name": "Juan", "email": "juan@email.com", "password": "123456", "phone": "+34123456789", "role": "client"}` |
| POST | `/api/auth/login` | Iniciar sesión | `{"email": "juan@email.com", "password": "123456"}` |
| GET | `/api/auth/profile` | Obtener perfil del usuario autenticado | Headers: `Authorization: Bearer <token>` |
| PUT | `/api/auth/profile` | Actualizar perfil del usuario autenticado | Headers: `Authorization: Bearer <token>` |

### Usuarios (Protegidas con JWT y Roles)

| Método | Endpoint | Descripción | Roles Permitidos | Restricciones |
|--------|----------|-------------|------------------|---------------|
| GET | `/api/users` | Obtener todos los usuarios | **Admin** | Solo administradores |
| GET | `/api/users/:id` | Obtener usuario por ID | **Admin, Client** | Admin: cualquier usuario / Client: solo su propio perfil |
| POST | `/api/users` | Crear nuevo usuario | **Admin** | Solo administradores |
| PUT | `/api/users/:id` | Actualizar usuario | **Admin, Client** | Admin: cualquier usuario / Client: solo su propio perfil |
| DELETE | `/api/users/:id` | Eliminar usuario | **Admin** | Solo administradores |

### Ejemplos de uso

**1. Registrar un nuevo cliente:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Cliente",
    "email": "cliente@email.com",
    "password": "123456",
    "phone": "+34987654321",
    "role": "client"
  }'
```

**1b. Registrar un nuevo admin (opcional):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Admin",
    "email": "newadmin@email.com",
    "password": "123456",
    "role": "admin"
  }'
```

**2. Iniciar sesión:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "12345678"
  }'
```

**3. Obtener perfil (requiere token):**
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Obtener todos los usuarios (requiere token):**
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**5. Crear usuario (requiere token de admin):**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Usuario Admin",
    "email": "admin@email.com",
    "password": "123456"
  }'
```

## 🛡️ Seguridad

- **JWT Authentication** - Tokens con expiración de 24h
- **Role-Based Access Control (RBAC)** - Sistema de roles (admin/client)
- **bcrypt** - Contraseñas encriptadas con salt
- **Validación de emails únicos**
- **Sanitización de datos** de entrada
- **Headers de seguridad** con Helmet
- **Control de CORS** habilitado
- **Rutas protegidas** con autenticación y autorización

### Flujo de Autenticación y Autorización

1. **Registro/Login** → Devuelve JWT token con información del rol
2. **Headers requeridos** para rutas protegidas:
   ```
   Authorization: Bearer <jwt_token>
   ```
3. **Verificación de roles** automática en cada request
4. **Token expira** en 24 horas
5. **Renovación** → Hacer login nuevamente

### Sistema de Roles

#### **👑 Admin**
- Puede ver todos los usuarios
- Puede crear nuevos usuarios
- Puede actualizar cualquier usuario
- Puede eliminar usuarios
- Acceso completo a la API

#### **👤 Client**
- Solo puede ver su propio perfil
- Solo puede actualizar su propio perfil
- No puede crear ni eliminar usuarios
- Acceso limitado a sus propios datos

### Códigos de Respuesta de Autorización

- **401** - No autenticado (token faltante/inválido/expirado)
- **403** - Sin permisos (rol insuficiente para la acción)
- **200/201** - Autorizado y ejecutado correctamente

## 📁 Estructura del proyecto

```
TO_BACK/
├── src/
│   ├── controllers/     # Lógica de controladores
│   ├── routes/          # Definición de rutas
│   ├── models/          # Modelos de Mongoose
│   ├── middleware/      # Middleware personalizado
│   ├── config/          # Configuración de BD
│   ├── seeds/           # Datos de prueba
│   ├── utils/           # Utilidades
│   ├── app.js           # Configuración de Express
│   └── server.js        # Punto de entrada
├── tests/               # Tests (futuros)
├── .env                 # Variables de entorno
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔧 Scripts disponibles

- `npm start` - Ejecutar en modo producción
- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm run seed` - Poblar base de datos con usuarios de prueba

## ❗ Solución de problemas

### Error SSL/TLS con MongoDB local
Si ves errores relacionados con SSL, asegúrate de que MongoDB local esté ejecutándose sin SSL.

### Puerto ocupado
Si el puerto 3000 está ocupado, cambia el valor de `PORT` en el archivo `.env`.

### MongoDB no conecta

#### Windows
- Verificar en Services que "MongoDB" esté ejecutándose
- O usar: `net start MongoDB`

#### macOS
```bash
brew services list | grep mongo
# O iniciar: brew services start mongodb-community
```

#### Linux
```bash
sudo systemctl status mongod
# O iniciar: sudo systemctl start mongod
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Añade nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.