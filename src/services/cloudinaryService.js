const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary con las variables de entorno
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log('Cloudinary config:', {
  cloud_name: config.cloud_name || 'NOT_SET',
  api_key: config.api_key ? 'SET' : 'NOT_SET',
  api_secret: config.api_secret ? 'SET' : 'NOT_SET'
});

cloudinary.config(config);

/**
 * Sube una imagen a Cloudinary
 * @param {string} filePath - Ruta del archivo a subir
 * @param {string} folder - Carpeta en Cloudinary donde subir la imagen
 * @returns {Promise<Object>} - Objeto con url y public_id
 */
const uploadImage = async (filePath, folder = 'products') => {
  try {
    console.log('Attempting to upload file:', filePath);
    
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error('Configuración de Cloudinary incompleta. Verifica las variables de entorno.');
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'center' },
        { quality: 'auto:good' },
        { format: 'auto' }
      ]
    });

    console.log('Upload successful:', { url: result.secure_url, public_id: result.public_id });

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (error.message.includes('Must supply api_key')) {
      throw new Error('Clave API de Cloudinary no configurada');
    } else if (error.message.includes('Must supply cloud_name')) {
      throw new Error('Nombre de cloud de Cloudinary no configurado');
    } else if (error.message.includes('Invalid API key or secret')) {
      throw new Error('Credenciales de Cloudinary inválidas');
    }
    throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - Public ID de la imagen a eliminar
 * @returns {Promise<Object>} - Resultado de la operación
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Error al eliminar imagen de Cloudinary');
  }
};

/**
 * Obtiene información de una imagen
 * @param {string} publicId - Public ID de la imagen
 * @returns {Promise<Object>} - Información de la imagen
 */
const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image info:', error);
    throw new Error('Error al obtener información de la imagen');
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getImageInfo
};