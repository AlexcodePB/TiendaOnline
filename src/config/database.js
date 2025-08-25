const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI no está definido');

    // Para Atlas, deja TLS habilitado por defecto. Para local, el driver maneja la conexión sin TLS.
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
