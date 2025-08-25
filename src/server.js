require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor de forma robusta
const startServer = async () => {
  try {
    console.log('🚀 Iniciando GRIND Backend...');
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`🔧 Node.js: ${process.version}`);
    console.log(`💻 Plataforma: ${process.platform} ${process.arch}`);
    
    // Verificar variables críticas antes de continuar
    console.log('\n🔍 Verificando configuración...');
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'NODE_ENV'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Variables de entorno faltantes:', missingVars);
      throw new Error(`Variables de entorno requeridas faltantes: ${missingVars.join(', ')}`);
    }
    
    console.log('✅ Variables de entorno verificadas');
    
    // Conectar a MongoDB primero
    console.log('\n📊 Conectando a base de datos...');
    await connectDB();
    
    // Opcional: ejecutar seeds al iniciar si la variable de entorno lo indica (solo dev/staging)
    if (process.env.SEED_ON_START === 'true') {
      const isProd = process.env.NODE_ENV === 'production';
      if (isProd) {
        console.warn('⚠️  [SEEDS] SEED_ON_START activo pero NODE_ENV=production. No se ejecutarán seeds por seguridad.');
      } else {
        console.log('🌱 [SEEDS] Ejecutando seeds al iniciar...');
        try {
          const child = spawn(process.execPath, ['src/seeds/allSeeds.js'], {
            stdio: 'inherit',
            env: process.env,
          });
          
          child.on('close', (code) => {
            if (code === 0) {
              console.log('✅ [SEEDS] Seeds completados correctamente');
            } else {
              console.error(`❌ [SEEDS] Seeds terminaron con código ${code}`);
            }
          });
          
          child.on('error', (error) => {
            console.error('💥 [SEEDS] Error ejecutando seeds:', error.message);
          });
        } catch (seedError) {
          console.error('💥 [SEEDS] Error iniciando proceso de seeds:', seedError.message);
        }
      }
    }
    
    // Iniciar servidor HTTP
    console.log('\n🌐 Iniciando servidor HTTP...');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(50));
      console.log('🎉 ¡SERVIDOR INICIADO EXITOSAMENTE!');
      console.log('='.repeat(50));
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 Entorno: ${process.env.NODE_ENV}`);
      console.log(`📅 Iniciado: ${new Date().toLocaleString('es-ES', { timeZone: 'UTC' })} UTC`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      }
      console.log('='.repeat(50) + '\n');
    });

    // Configurar timeout para el servidor
    server.timeout = 30000; // 30 segundos
    server.keepAliveTimeout = 65000; // 65 segundos
    server.headersTimeout = 66000; // 66 segundos

    // Manejo de cierre graceful para Koyeb
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Señal ${signal} recibida. Iniciando cierre graceful...`);
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error cerrando servidor HTTP:', err.message);
          process.exit(1);
        }
        
        console.log('✅ Servidor HTTP cerrado');
        
        // Cerrar conexión a MongoDB
        const mongoose = require('mongoose');
        mongoose.connection.close(() => {
          console.log('✅ Conexión MongoDB cerrada');
          console.log('👋 Proceso terminado exitosamente');
          process.exit(0);
        });
      });
      
      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('⏰ Timeout de cierre graceful. Forzando terminación...');
        process.exit(1);
      }, 10000);
    };

    // Event listeners para cierre graceful
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${PORT} ya está en uso`);
        process.exit(1);
      } else {
        console.error('❌ Error del servidor:', error.message);
        process.exit(1);
      }
    });

    return server;

  } catch (error) {
    console.error('\n💥 ERROR CRÍTICO AL INICIAR SERVIDOR:');
    console.error('📋 Mensaje:', error.message);
    console.error('🏷️  Tipo:', error.name || 'Error');
    console.error('📍 Stack:', error.stack);
    
    // Información específica para diferentes tipos de errores
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   1. Verificar que MONGODB_URI esté definida en variables de entorno');
      console.error('   2. Formato: mongodb+srv://user:pass@cluster.net/database');
    }
    
    if (error.message.includes('JWT_SECRET')) {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   1. Definir JWT_SECRET en variables de entorno');
      console.error('   2. Generar uno seguro: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    }
    
    console.error('\n💀 Terminando proceso...');
    process.exit(1);
  }
};

// Manejo de errores globales no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection:');
  console.error('📍 En:', promise);
  console.error('📋 Razón:', reason);
  
  if (process.env.NODE_ENV === 'production') {
    console.error('🔄 Reiniciando aplicación...');
    process.exit(1);
  } else {
    console.error('⚠️  Continuando en modo desarrollo...');
  }
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:');
  console.error('📋 Mensaje:', error.message);
  console.error('📍 Stack:', error.stack);
  console.error('💀 Terminando proceso inmediatamente...');
  process.exit(1);
});

// Logs de memoria en producción (para debugging)
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log('📊 Uso de memoria:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    });
  }, 30000); // Cada 30 segundos
}

// Iniciar la aplicación
startServer().catch((error) => {
  console.error('💥 Error fatal iniciando aplicación:', error.message);
  process.exit(1);
});
