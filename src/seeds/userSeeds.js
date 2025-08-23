const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const usuarios = [
  {
    nombre: 'Usuario Test',
    email: 'test@test.com',
    contrasenia: '12345678',
    telefono: '+34 123 456 789'
  },
  {
    nombre: 'Admin',
    email: 'admin@test.com',
    contrasenia: '12345678',
    telefono: '+34 987 654 321'
  },
  {
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    contrasenia: '12345678',
    telefono: '+34 555 123 456'
  },
  {
    nombre: 'María García',
    email: 'maria@test.com',
    contrasenia: '12345678',
    telefono: '+34 555 987 654'
  },
  {
    nombre: 'Carlos López',
    email: 'carlos@test.com',
    contrasenia: '12345678'
  }
];

const seedUsers = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('Eliminando usuarios existentes...');
    await User.deleteMany({});
    console.log('✅ Usuarios existentes eliminados');

    console.log('Creando usuarios de prueba...');
    const usuariosCreados = await User.create(usuarios);
    console.log(`✅ ${usuariosCreados.length} usuarios creados exitosamente`);

    usuariosCreados.forEach(usuario => {
      console.log(`- ${usuario.nombre} (${usuario.email})`);
    });

    console.log('\n🎉 Seeds ejecutados correctamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, usuarios };