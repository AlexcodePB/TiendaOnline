const mongoose = require('mongoose');
const { seedUsers } = require('./userSeeds');
const { seedProducts } = require('./productSeeds');
require('dotenv').config();

const seedAll = async () => {
  try {
    console.log('🚀 Iniciando seeds completos...');
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Ejecutar seeds de usuarios
    console.log('\n👥 Ejecutando seeds de usuarios...');
    await seedUsers();
    
    // Ejecutar seeds de productos
    console.log('\n📦 Ejecutando seeds de productos...');
    await seedProducts();

    console.log('\n🎉 Todos los seeds ejecutados correctamente');
    console.log('\n📊 Resumen:');
    console.log('- Usuarios: 6 creados');
    console.log('- Productos de skate: 20 creados');
    console.log('- Categorías: 9 disponibles (tables, wheels, trucks, bearings, etc.)');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error ejecutando seeds completos:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };