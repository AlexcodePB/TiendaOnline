const express = require('express');
const { authenticateToken, isAdmin, authorizeRoles } = require('../middleware/auth');
const { validateProductData } = require('../middleware/validation');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getCategories
} = require('../controllers/productController');

const router = express.Router();

// Rutas públicas (sin autenticación) - pueden acceder clients y admins
router.get('/', authenticateToken, authorizeRoles('admin', 'client'), getAllProducts);
router.get('/categories', authenticateToken, authorizeRoles('admin', 'client'), getCategories);
router.get('/category/:category', authenticateToken, authorizeRoles('admin', 'client'), getProductsByCategory);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'client'), getProductById);

// Rutas protegidas - solo admins
router.post('/', authenticateToken, isAdmin, validateProductData, createProduct);
router.put('/:id', authenticateToken, isAdmin, validateProductData, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;