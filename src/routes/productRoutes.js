/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos de skateboard
 */

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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos con filtros, paginación y ordenamiento
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [tables, wheels, trucks, bearings, grip-tape, hardware, tools, clothing, accessories]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio máximo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar en nombre y descripción
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Solo productos en stock
 *       - in: query
 *         name: stock
 *         schema:
 *           type: string
 *           enum: [available, outOfStock]
 *         description: Estado de stock
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, date_asc, date_desc]
 *           default: date_desc
 *         description: Ordenamiento
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de productos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Parámetros de filtro inválidos
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
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Obtener todas las categorías disponibles
 *     tags: [Products]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["bearings", "clothing", "grip-tape", "hardware", "tables", "tools", "trucks", "wheels"]
 *                 total:
 *                   type: integer
 *                   example: 8
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Obtener productos por categoría con filtros
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [tables, wheels, trucks, bearings, grip-tape, hardware, tools, clothing, accessories]
 *         description: Categoría del producto
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio máximo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar en nombre y descripción
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Solo productos en stock
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, date_asc, date_desc]
 *           default: date_desc
 *         description: Ordenamiento
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Productos de la categoría con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   example: "tables"
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Parámetros de filtro inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron productos en esta categoría
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
router.get('/category/:category', getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
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
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear nuevo producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Baker Brand Deck 8.0\""
 *             description: "Tabla Baker profesional de 8.0 pulgadas, maple canadiense premium con gráfico clásico del logo."
 *             price: 79.99
 *             image:
 *               url: "https://res.cloudinary.com/demo/image/upload/v123/sample.jpg"
 *               public_id: "baker-deck-80_xyz123"
 *             stock: 12
 *             category: "tables"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto creado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos, imagen incorrecta o producto ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "La imagen debe incluir url y public_id"
 *               details: "Formato requerido: {\"url\": \"https://...\", \"public_id\": \"id_cloudinary\"}"
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Solo administradores pueden crear productos
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
router.post('/', authenticateToken, isAdmin, validateProductData, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Element Nyjah Huston Pro Model 8.0\""
 *               description:
 *                 type: string
 *                 example: "Tabla signature actualizada de Nyjah Huston"
 *               price:
 *                 type: number
 *                 example: 89.99
 *               image:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     example: "https://res.cloudinary.com/demo/image/upload/v123/updated.jpg"
 *                   public_id:
 *                     type: string
 *                     example: "element-nyjah-pro-80_abc456"
 *               stock:
 *                 type: integer
 *                 example: 15
 *               category:
 *                 type: string
 *                 enum: [tables, wheels, trucks, bearings, grip-tape, hardware, tools, clothing, accessories]
 *                 example: "tables"
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto actualizado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido, datos incorrectos o producto ya existe
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
 *         description: Solo administradores pueden actualizar productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
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
router.put('/:id', authenticateToken, isAdmin, validateProductData, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto inválido
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
 *         description: Solo administradores pueden eliminar productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
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
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;