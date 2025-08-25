const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio temporal si no existe
const uploadDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para almacenamiento temporal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Verificar que sea una imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
    files: 1 // Solo un archivo
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          error: 'Archivo demasiado grande', 
          details: 'El tamaño máximo permitido es 5MB' 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          error: 'Demasiados archivos', 
          details: 'Solo se permite subir un archivo a la vez' 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Campo de archivo inesperado', 
          details: 'El campo debe llamarse "image"' 
        });
      default:
        return res.status(400).json({ 
          error: 'Error al procesar archivo', 
          details: error.message 
        });
    }
  } else if (error) {
    return res.status(400).json({ 
      error: 'Error al validar archivo', 
      details: error.message 
    });
  }
  next();
};

// Función para limpiar archivo temporal
const cleanupTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up temp file:', error);
  }
};

module.exports = {
  upload: upload.single('image'),
  handleMulterError,
  cleanupTempFile
};