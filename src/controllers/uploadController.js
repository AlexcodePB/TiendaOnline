const { uploadImage, deleteImage } = require('../services/cloudinaryService');
const { cleanupTempFile } = require('../middleware/upload');

/**
 * Sube una imagen a Cloudinary
 */
const uploadImageToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No se proporcionó archivo', 
        details: 'Debes enviar un archivo en el campo "image"' 
      });
    }

    const filePath = req.file.path;
    
    try {
      // Subir imagen a Cloudinary
      const result = await uploadImage(filePath);
      
      // Limpiar archivo temporal
      cleanupTempFile(filePath);
      
      res.json({
        message: 'Imagen subida exitosamente',
        url: result.url,
        public_id: result.public_id
      });
    } catch (cloudinaryError) {
      // Limpiar archivo temporal en caso de error
      cleanupTempFile(filePath);
      throw cloudinaryError;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Error al subir imagen', 
      details: error.message 
    });
  }
};

/**
 * Elimina una imagen de Cloudinary
 */
const deleteImageFromCloudinary = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ 
        error: 'Public ID requerido', 
        details: 'Debes proporcionar el public_id de la imagen a eliminar' 
      });
    }

    const result = await deleteImage(publicId);
    
    if (result.result === 'ok') {
      res.json({
        message: 'Imagen eliminada exitosamente',
        result: result
      });
    } else {
      res.status(404).json({
        error: 'Imagen no encontrada',
        details: 'No se pudo encontrar la imagen con el public_id proporcionado'
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      error: 'Error al eliminar imagen', 
      details: error.message 
    });
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary
};