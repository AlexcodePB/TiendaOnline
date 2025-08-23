# Backend Tienda Online

API REST desarrollada con Node.js, Express y MongoDB para una tienda online con gestión de usuarios.

## 🚀 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcrypt** - Encriptación de contraseñas
- **CORS, Helmet, Morgan** - Middleware de seguridad y logging

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
   - El archivo `.env` ya está configurado con valores por defecto
   - Si necesitas cambiar la configuración, edita el archivo `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tienda_online
```

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
- `test@test.com` / `12345678`
- `admin@test.com` / `12345678`
- `juan@test.com` / `12345678`
- `maria@test.com` / `12345678`
- `carlos@test.com` / `12345678`

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

### Usuarios

| Método | Endpoint | Descripción | Ejemplo de datos |
|--------|----------|-------------|------------------|
| GET | `/api/users` | Obtener todos los usuarios | - |
| GET | `/api/users/:id` | Obtener usuario por ID | - |
| POST | `/api/users` | Crear nuevo usuario | `{"nombre": "Juan", "email": "juan@email.com", "contrasenia": "123456", "telefono": "+34123456789"}` |
| PUT | `/api/users/:id` | Actualizar usuario | `{"nombre": "Juan Actualizado"}` |
| DELETE | `/api/users/:id` | Eliminar usuario | - |

### Ejemplos de uso

**Obtener todos los usuarios:**
```bash
curl http://localhost:3000/api/users
```

**Crear un nuevo usuario:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Usuario",
    "email": "nuevo@email.com",
    "contrasenia": "123456",
    "telefono": "+34987654321"
  }'
```

## 🛡️ Seguridad

- Las contraseñas se encriptan con **bcrypt** antes de guardarse
- Validación de emails únicos
- Sanitización de datos de entrada
- Headers de seguridad con **Helmet**
- Control de CORS habilitado

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