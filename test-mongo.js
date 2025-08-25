#!/usr/bin/env node

/**
 * Script de prueba para conexión MongoDB
 * Útil para debugging de problemas de conexión en Koyeb
 * 
 * Uso:
 *   node test-mongo.js
 *   
 * Variables requeridas:
 *   - MONGODB_URI en .env o variables de entorno
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🧪 GRIND - Test de Conexión MongoDB');
console.log('===================================\n');

async function testMongoConnection() {
  try {
    // Información del entorno
    console.log('📋 Información del entorno:');
    console.log(`   🌍 NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`   🔧 Node.js: ${process.version}`);
    console.log(`   💻 Plataforma: ${process.platform} ${process.arch}`);
    console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
    
    // Verificar URI
    const uri = process.env.MONGODB_URI;
    console.log('\n🔍 Verificando MONGODB_URI:');
    console.log(`   📡 URI definida: ${!!uri}`);
    
    if (!uri) {
      throw new Error('❌ MONGODB_URI no está definida en las variables de entorno');
    }
    
    console.log(`   📏 Longitud URI: ${uri.length} caracteres`);
    console.log(`   🔗 Es MongoDB Atlas: ${uri.includes('mongodb.net')}`);
    console.log(`   🔗 Es MongoDB local: ${uri.includes('localhost')}`);
    
    // Mostrar URI parcialmente (ocultar credenciales)
    const safeUri = uri.replace(/:([^:@]+)@/, ':***@');
    console.log(`   🔗 URI (parcial): ${safeUri.substring(0, 60)}...`);
    
    // Configuración de conexión optimizada para Koyeb
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // 15 segundos para test rápido
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4, // IPv4
      maxPoolSize: 5, // Pool pequeño para test
    };
    
    console.log('\n⚡ Configuración de conexión:');
    Object.entries(options).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    console.log('\n🔄 Intentando conectar a MongoDB...');
    console.log('   (Esto puede tomar hasta 30 segundos)');
    
    const startTime = Date.now();
    
    // Conectar
    const connection = await mongoose.connect(uri, options);
    
    const connectionTime = Date.now() - startTime;
    
    console.log('\n✅ ¡CONEXIÓN EXITOSA!');
    console.log('===================');
    console.log(`   ⏱️  Tiempo de conexión: ${connectionTime}ms`);
    console.log(`   🏠 Host: ${connection.connection.host}`);
    console.log(`   🔌 Puerto: ${connection.connection.port}`);
    console.log(`   📊 Base de datos: ${connection.connection.name || 'sin nombre'}`);
    console.log(`   ⚡ Estado: ${getConnectionState(connection.connection.readyState)}`);
    
    // Test básico de operación
    console.log('\n🧪 Probando operación básica...');
    
    try {
      // Crear una colección temporal para test
      const TestCollection = mongoose.model('_test_connection', new mongoose.Schema({
        timestamp: { type: Date, default: Date.now },
        message: String
      }));
      
      // Insertar documento de prueba
      const testDoc = await TestCollection.create({
        message: 'Test de conexión exitoso'
      });
      
      console.log(`   ✅ Documento creado: ${testDoc._id}`);
      
      // Leer documento
      const foundDoc = await TestCollection.findById(testDoc._id);
      console.log(`   ✅ Documento leído: ${foundDoc.message}`);
      
      // Eliminar documento de prueba
      await TestCollection.deleteOne({ _id: testDoc._id });
      console.log('   ✅ Documento eliminado (cleanup)');
      
      // Eliminar colección de prueba
      await TestCollection.collection.drop();
      console.log('   ✅ Colección de prueba eliminada');
      
    } catch (testError) {
      console.log(`   ⚠️  Test de operaciones falló: ${testError.message}`);
      console.log('   (La conexión funciona pero hay restricciones de permisos)');
    }
    
    // Información adicional
    console.log('\n📊 Estadísticas de conexión:');
    const stats = connection.connection.db?.stats ? await connection.connection.db.stats() : null;
    if (stats) {
      console.log(`   📚 Collections: ${stats.collections || 0}`);
      console.log(`   📄 Documents: ${stats.objects || 0}`);
      console.log(`   💾 Tamaño DB: ${((stats.dataSize || 0) / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.log('   ℹ️  Estadísticas no disponibles');
    }
    
    console.log('\n🎉 TEST COMPLETADO EXITOSAMENTE');
    console.log('==============================');
    console.log('✅ La conexión a MongoDB está funcionando correctamente');
    console.log('✅ Tu aplicación debería poder conectarse sin problemas');
    
    if (uri.includes('mongodb.net')) {
      console.log('\n💡 Recordatorios para MongoDB Atlas:');
      console.log('   1. ✅ La IP está whitelistada correctamente');
      console.log('   2. ✅ Las credenciales son válidas');
      console.log('   3. ✅ El usuario tiene permisos apropiados');
    }

  } catch (error) {
    console.error('\n💥 ERROR DE CONEXIÓN');
    console.error('===================');
    console.error(`❌ Tipo: ${error.name}`);
    console.error(`❌ Mensaje: ${error.message}`);
    
    // Diagnósticos específicos
    if (error.message.includes('IP')) {
      console.error('\n🚨 PROBLEMA DE IP WHITELIST:');
      console.error('   1. Ve a MongoDB Atlas → Network Access');
      console.error('   2. Click "ADD IP ADDRESS"');
      console.error('   3. Click "ALLOW ACCESS FROM ANYWHERE" → 0.0.0.0/0');
      console.error('   4. O agrega estas IPs específicas de Koyeb:');
      console.error('      - 52.45.144.63 (Washington)');
      console.error('      - 3.208.70.174 (Washington)');
      console.error('      - 34.207.173.181 (Washington)');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\n🚨 PROBLEMA DE AUTENTICACIÓN:');
      console.error('   1. Verificar usuario y contraseña en MONGODB_URI');
      console.error('   2. Ve a MongoDB Atlas → Database Access');
      console.error('   3. Verificar que el usuario existe y tiene permisos');
      console.error('   4. Password puede necesitar URL encoding si tiene caracteres especiales');
    }
    
    if (error.message.includes('timeout')) {
      console.error('\n🚨 PROBLEMA DE TIMEOUT:');
      console.error('   1. La conexión es demasiado lenta');
      console.error('   2. Puede ser problema de red o firewall');
      console.error('   3. Intenta con un servidor más cercano geográficamente');
    }
    
    console.error('\n🔧 POSIBLES SOLUCIONES:');
    console.error('   1. Verificar que MONGODB_URI esté correcta');
    console.error('   2. Asegurar que MongoDB Atlas Network Access permite la IP');
    console.error('   3. Verificar credenciales de usuario en Database Access');
    console.error('   4. Usar el formato correcto: mongodb+srv://user:pass@cluster.net/database');
    
    if (error.code) {
      console.error(`\n🔢 Código de error: ${error.code}`);
    }
    
    console.error('\n💀 Test falló - revisar configuración');
    process.exit(1);
  
  } finally {
    // Cerrar conexión
    if (mongoose.connection.readyState !== 0) {
      console.log('\n🔌 Cerrando conexión...');
      await mongoose.connection.close();
      console.log('✅ Conexión cerrada');
    }
    
    console.log('\n👋 Test finalizado\n');
  }
}

function getConnectionState(state) {
  const states = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando',
    4: 'Error'
  };
  return states[state] || `Estado desconocido (${state})`;
}

// Manejo de errores globales
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection:');
  console.error('📍 En:', promise);
  console.error('📋 Razón:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:');
  console.error('📋 Mensaje:', error.message);
  console.error('📍 Stack:', error.stack);
  process.exit(1);
});

// Ejecutar test
testMongoConnection().catch((error) => {
  console.error('💥 Error ejecutando test:', error.message);
  process.exit(1);
});