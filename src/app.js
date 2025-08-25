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
// Preflight para todos los endpoints
app.options('*', cors(corsOptions));
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

// Healthcheck endpoint
app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting', 'unauthorized', 'unknown'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development', db: dbState });
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
