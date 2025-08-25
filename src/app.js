const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Config helpers
const isProd = process.env.NODE_ENV === 'production';
const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true' || !isProd;
const allowAllCors = process.env.CORS_ALLOW_ALL === 'true';

// Parse allowed origins from env (comma-separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
];
const origins = allowedOrigins.length ? allowedOrigins : defaultOrigins;

function isOriginAllowed(origin) {
  if (!origin) return true; // allow tools like curl
  try {
    const { hostname, protocol } = new URL(origin);
    for (const entry of origins) {
      // Exact match
      if (origin === entry) return true;
      // Allow both http/https variants for exact host entries
      if (entry.startsWith('http')) {
        const u = new URL(entry);
        if (u.hostname === hostname) return true;
      }
      // Wildcard domain support: entries like *.vercel.app
      if (entry.startsWith('*.')) {
        const suffix = entry.slice(1); // remove leading '*'
        if (hostname.endsWith(suffix)) return true;
      }
    }
  } catch (e) {
    // If origin is not a valid URL, fall back to strict deny
    return false;
  }
  return false;
}

app.use(helmet());
const corsOptions = {
  origin: function (origin, callback) {
    if (allowAllCors) return callback(null, true); // permitir cualquier origen
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.use(morgan(isProd ? 'tiny' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (swaggerEnabled) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Skate Shop API Documentation'
  }));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API de Tienda Online',
    version: '1.0.0',
    documentation: swaggerEnabled ? '/api-docs' : undefined,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart'
    }
  });
});

// Health check endpoint mejorado para Koyeb
app.get('/health', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Estados de mongoose connection
    const connectionStates = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting',
      4: 'error'
    };
    
    const dbState = connectionStates[mongoose.connection.readyState] || 'unknown';
    const isDbHealthy = mongoose.connection.readyState === 1;
    
    // Información básica del sistema
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Test de conexión DB rápido
    let dbTest = { success: false, responseTime: null, error: null };
    if (isDbHealthy) {
      try {
        const dbTestStart = Date.now();
        await mongoose.connection.db.admin().ping();
        dbTest = {
          success: true,
          responseTime: Date.now() - dbTestStart,
          error: null
        };
      } catch (dbError) {
        dbTest = {
          success: false,
          responseTime: Date.now() - dbTestStart,
          error: dbError.message
        };
      }
    }
    
    const healthData = {
      // Status general
      status: isDbHealthy && dbTest.success ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      
      // Información del servidor
      server: {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: `${process.platform} ${process.arch}`,
        uptime: Math.floor(uptime),
        pid: process.pid
      },
      
      // Estado de la base de datos
      database: {
        status: dbState,
        connected: isDbHealthy,
        host: mongoose.connection.host || null,
        name: mongoose.connection.name || null,
        test: dbTest
      },
      
      // Memoria y recursos
      resources: {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024) // MB
        },
        uptime: {
          seconds: Math.floor(uptime),
          human: formatUptime(uptime)
        }
      },
      
      // Configuración crítica (sin secretos)
      config: {
        port: process.env.PORT || 'default',
        corsEnabled: !!corsOptions,
        swaggerEnabled: swaggerEnabled,
        mongodbConfigured: !!process.env.MONGODB_URI,
        jwtConfigured: !!process.env.JWT_SECRET,
        cloudinaryConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
      }
    };
    
    // Determinar código HTTP según estado
    const httpStatus = healthData.status === 'healthy' ? 200 : 503;
    
    res.status(httpStatus).json(healthData);
    
  } catch (error) {
    console.error('❌ Error en health check:', error.message);
    
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: 'Health check failed',
        details: error.message
      },
      server: {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
      }
    });
  }
});

// Función helper para formatear uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Endpoint adicional para health check simple (para load balancers)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Endpoint de readiness (listo para recibir tráfico)
app.get('/ready', async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    
    if (isDbConnected) {
      // Test rápido de DB
      await mongoose.connection.db.admin().ping();
      res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString(),
        services: {
          database: 'ready'
        }
      });
    } else {
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        services: {
          database: 'not_ready'
        }
      });
    }
  } catch (error) {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Endpoint de liveness (proceso funcionando)
app.get('/live', (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
    pid: process.pid,
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

module.exports = app;
