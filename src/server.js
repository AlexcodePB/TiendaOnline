require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;

connectDB();

// Opcional: ejecutar seeds al iniciar si la variable de entorno lo indica
// Nota: Solo recomendable en desarrollo o staging
if (process.env.SEED_ON_START === 'true') {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    console.warn('[SEEDS] SEED_ON_START está activo pero NODE_ENV=production. No se ejecutarán seeds por seguridad.');
  } else {
    console.log('[SEEDS] Ejecutando seeds al iniciar...');
    const child = spawn(process.execPath, ['src/seeds/allSeeds.js'], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', (code) => {
      if (code === 0) {
        console.log('[SEEDS] Seeds completados correctamente');
      } else {
        console.error(`[SEEDS] Seeds terminaron con código ${code}`);
      }
    });
  }
}

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
