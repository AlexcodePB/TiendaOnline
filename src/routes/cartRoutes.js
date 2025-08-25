/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestión del carrito de compras (requiere autenticación)
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkCartAvailability
} = require('../controllers/cartController');

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 stats:
 *                   $ref: '#/components/schemas/CartStats'
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
router.get('/', authenticateToken, getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *           example:
 *             productId: "64f5a123b12345678901234"
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Producto agregado al carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto agregado al carrito exitosamente"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 stats:
 *                   $ref: '#/components/schemas/CartStats'
 *       400:
 *         description: Datos inválidos, producto no encontrado o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_product:
 *                 value:
 *                   error: "ID de producto inválido"
 *               insufficient_stock:
 *                 value:
 *                   error: "Stock insuficiente"
 *                   details: "Disponible: 5, en carrito: 2, solicitado: 4"
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
router.post('/add', authenticateToken, addToCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Actualizar cantidad de producto en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartInput'
 *           example:
 *             productId: "64f5a123b12345678901234"
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Cantidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cantidad actualizada exitosamente"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 stats:
 *                   $ref: '#/components/schemas/CartStats'
 *       400:
 *         description: Datos inválidos o stock insuficiente
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
 *       404:
 *         description: Producto no encontrado en el carrito
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
router.put('/update', authenticateToken, updateCartItem);

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Eliminar producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado del carrito exitosamente"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 stats:
 *                   $ref: '#/components/schemas/CartStats'
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
 *       404:
 *         description: Producto no encontrado en el carrito
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
router.delete('/remove/:productId', authenticateToken, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Vaciar carrito completamente
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Carrito vaciado exitosamente"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *                 stats:
 *                   $ref: '#/components/schemas/CartStats'
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
router.delete('/clear', authenticateToken, clearCart);

/**
 * @swagger
 * /api/cart/check-availability:
 *   get:
 *     summary: Verificar disponibilidad de productos en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de disponibilidad del carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: false
 *                 unavailableItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemId:
 *                         type: string
 *                         example: "64f5a123b12345678901235"
 *                       productId:
 *                         type: string
 *                         example: "64f5a123b12345678901234"
 *                       productName:
 *                         type: string
 *                         example: "Element Section 8.25\""
 *                       requestedQuantity:
 *                         type: integer
 *                         example: 5
 *                       availableStock:
 *                         type: integer
 *                         example: 2
 *                       reason:
 *                         type: string
 *                         example: "Stock insuficiente"
 *                 totalItems:
 *                   type: integer
 *                   example: 8
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
router.get('/check-availability', authenticateToken, checkCartAvailability);

module.exports = router;