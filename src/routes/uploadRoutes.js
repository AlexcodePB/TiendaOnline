/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Gestión de subida y eliminación de imágenes
 */

const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary
} = require('../controllers/uploadController');

const router = express.Router();

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Subir imagen a Cloudinary (solo admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (PNG, JPG, JPEG - máx 5MB)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen subida exitosamente"
 *                 url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v123/products/sample.jpg"
 *                 public_id:
 *                   type: string
 *                   example: "products/sample_xyz123"
 *       400:
 *         description: Error en el archivo o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               no_file:
 *                 value:
 *                   error: "No se proporcionó archivo"
 *                   details: "Debes enviar un archivo en el campo 'image'"
 *               file_too_large:
 *                 value:
 *                   error: "Archivo demasiado grande"
 *                   details: "El tamaño máximo permitido es 5MB"
 *               invalid_format:
 *                 value:
 *                   error: "Solo se permiten archivos de imagen"
 *                   details: "Formatos válidos: PNG, JPG, JPEG"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Solo administradores pueden subir imágenes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/image', authenticateToken, isAdmin, upload, handleMulterError, uploadImageToCloudinary);

/**
 * @swagger
 * /api/upload/image/{publicId}:
 *   delete:
 *     summary: Eliminar imagen de Cloudinary (solo admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID de la imagen en Cloudinary (reemplaza "/" con "%2F")
 *         example: "products%2Fsample_xyz123"
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Imagen eliminada exitosamente"
 *                 result:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: "ok"
 *       400:
 *         description: Public ID requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Solo administradores pueden eliminar imágenes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/image/:publicId', authenticateToken, isAdmin, deleteImageFromCloudinary);

module.exports = router;