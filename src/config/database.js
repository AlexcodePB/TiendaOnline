const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI no está definido en las variables de entorno');
    }

    // Configuración optimizada para producción en Koyeb
    const options = {
      // Opciones básicas de conexión
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Timeouts para conexiones lentas o inestables
      serverSelectionTimeoutMS: 30000, // 30 segundos para seleccionar servidor
      socketTimeoutMS: 45000, // 45 segundos para operaciones de socket
      connectTimeoutMS: 30000, // 30 segundos para conectar inicialmente
      
      // Pool de conexiones para mejor rendimiento
      maxPoolSize: 10, // Máximo 10 conexiones simultáneas
      minPoolSize: 2, // Mínimo 2 conexiones en el pool
      maxIdleTimeMS: 30000, // Cerrar conexiones inactivas después de 30 segundos
      
      // Configuración de red
      family: 4, // Usar IPv4 (más estable en algunos entornos cloud)
      
      // Configuración de retry para conexiones fallidas
      serverSelectionRetryDelayMS: 2000, // Retry cada 2 segundos
      heartbeatFrequencyMS: 10000, // Heartbeat cada 10 segundos
      
      // Buffer settings
      bufferMaxEntries: 0, // Desactivar buffering
      bufferCommands: false, // Desactivar command buffering
    };

    // Logs de debugging para identificar problemas
    console.log('🔍 Iniciando conexión a MongoDB...');
    console.log(`🌐 Entorno: ${process.env.NODE_ENV}`);
    console.log(`📡 URI definida: ${!!uri}`);
    console.log(`📏 URI length: ${uri.length}`);
    console.log(`🔗 Es MongoDB Atlas: ${uri.includes('mongodb.net')}`);

    // Intentar conexión con retry automático
    const conn = await mongoose.connect(uri, options);
    
    // Logs de éxito
    console.log(`✅ MongoDB conectado exitosamente!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`⚡ Estado de conexión: ${conn.connection.readyState}`);
    console.log(`🔢 Conexiones activas: ${conn.connection.db?.serverConfig?.connections?.length || 'N/A'}`);
    
    // Configurar event listeners para monitoreo
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Error de conexión MongoDB:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Mongoose desconectado de MongoDB');
    });

    // Manejo graceful de reconexión
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconectado a MongoDB');
    });

    return conn;
  } catch (error) {
    console.error('💥 Error crítico al conectar con MongoDB:');
    console.error('📋 Mensaje del error:', error.message);
    console.error('🏷️  Nombre del error:', error.name);
    
    // Información adicional para debugging específico de Atlas
    if (error.message.includes('IP')) {
      console.error('🚨 PROBLEMA DE IP WHITELIST:');
      console.error('   1. Ve a MongoDB Atlas → Network Access');
      console.error('   2. Agrega 0.0.0.0/0 para permitir todas las IPs');
      console.error('   3. O agrega las IPs específicas de Koyeb');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('🚨 PROBLEMA DE AUTENTICACIÓN:');
      console.error('   1. Verifica usuario y contraseña en MONGODB_URI');
      console.error('   2. Asegúrate de que el usuario tenga permisos');
    }
    
    if (error.code) {
      console.error('🔢 Código de error:', error.code);
    }
    
    // En producción, intentar reinicio después de un delay
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Reintentando conexión en 5 segundos...');
      setTimeout(() => {
        console.log('💀 Terminando proceso para reinicio automático...');
        process.exit(1);
      }, 5000);
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
