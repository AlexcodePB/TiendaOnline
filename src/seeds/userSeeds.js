const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const usuarios = [
  {
    name: "Usuario Test",
    email: "test@test.com",
    password: "12345678",
    phone: "+54 123 456 789",
    role: "client",
  },
  {
    name: "Admin Principal",
    email: "admin@test.com",
    password: "12345678",
    phone: "+54 987 654 321",
    role: "admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@test.com",
    password: "12345678",
    phone: "+54 111 222 333",
    role: "admin",
  },
  {
    name: "Juan Pérez",
    email: "juan@test.com",
    password: "12345678",
    phone: "+54 555 123 456",
    role: "client",
  },
  {
    name: "María García",
    email: "maria@test.com",
    password: "12345678",
    phone: "+54 555 987 654",
    role: "client",
  },
  {
    name: "Carlos López",
    email: "carlos@test.com",
    password: "12345678",
    phone: "+54 555 987 654",
    role: "client",
  },
];

const seedUsers = async () => {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    console.log("Eliminando usuarios existentes...");
    await User.deleteMany({});
    console.log("✅ Usuarios existentes eliminados");

    console.log("Creando usuarios de prueba...");
    const usuariosCreados = await User.create(usuarios);
    console.log(`✅ ${usuariosCreados.length} usuarios creados exitosamente`);

    usuariosCreados.forEach((usuario) => {
      console.log(
        `- ${usuario.name} (${usuario.email}) - Rol: ${usuario.role}`
      );
    });

    console.log("\n🎉 Seeds ejecutados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando seeds:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, usuarios };
