const CartService = require('../services/cartService');
const mongoose = require('mongoose');

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const cart = await CartService.getOrCreateCart(userId);
    
    // Limpiar items inválidos y actualizar precios
    await CartService.cleanInvalidItems(cart);
    await CartService.updateCartPrices(cart);
    
    // Recargar carrito después de las actualizaciones
    const updatedCart = await CartService.getOrCreateCart(userId);
    
    // Obtener estadísticas
    const stats = CartService.getCartStats(updatedCart);
    
    res.json({
      cart: updatedCart,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener carrito', 
      details: error.message 
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    
    // Validaciones de entrada
    if (!productId) {
      return res.status(400).json({ 
        error: 'El ID del producto es requerido' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        error: 'ID de producto inválido' 
      });
    }
    
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ 
        error: 'La cantidad debe ser un número entero mayor a 0' 
      });
    }
    
    // Obtener carrito actual
    const cart = await CartService.getOrCreateCart(userId);
    
    // Validar producto y stock
    const product = await CartService.validateProductAndStock(productId, quantity);
    
    // Validar stock total considerando lo que ya está en el carrito
    const existingItem = cart.items.find(
      item => item.productId._id.toString() === productId.toString()
    );
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalQuantityNeeded = currentQuantityInCart + quantity;
    
    if (product.stock < totalQuantityNeeded) {
      return res.status(400).json({
        error: 'Stock insuficiente',
        details: `Disponible: ${product.stock}, en carrito: ${currentQuantityInCart}, solicitado: ${quantity}`
      });
    }
    
    // Agregar item al carrito
    await cart.addItem(productId, quantity, product.price);
    
    // Obtener carrito actualizado
    const updatedCart = await CartService.getOrCreateCart(userId);
    const stats = CartService.getCartStats(updatedCart);
    
    res.status(201).json({
      message: 'Producto agregado al carrito exitosamente',
      cart: updatedCart,
      stats
    });
  } catch (error) {
    if (error.message.includes('Stock insuficiente') || 
        error.message.includes('Producto no encontrado')) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al agregar producto al carrito', 
      details: error.message 
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    
    // Validaciones de entrada
    if (!productId) {
      return res.status(400).json({ 
        error: 'El ID del producto es requerido' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        error: 'ID de producto inválido' 
      });
    }
    
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ 
        error: 'La cantidad debe ser un número entero mayor o igual a 0' 
      });
    }
    
    // Obtener carrito actual
    const cart = await CartService.getOrCreateCart(userId);
    
    // Verificar que el producto está en el carrito
    const existingItem = cart.items.find(
      item => item.productId._id.toString() === productId.toString()
    );
    
    if (!existingItem) {
      return res.status(404).json({ 
        error: 'Producto no encontrado en el carrito' 
      });
    }
    
    // Si la cantidad es mayor a 0, validar stock
    if (quantity > 0) {
      await CartService.validateTotalStock(cart, productId, quantity);
    }
    
    // Actualizar cantidad
    await cart.updateItemQuantity(productId, quantity);
    
    // Obtener carrito actualizado
    const updatedCart = await CartService.getOrCreateCart(userId);
    const stats = CartService.getCartStats(updatedCart);
    
    const message = quantity === 0 
      ? 'Producto eliminado del carrito exitosamente'
      : 'Cantidad actualizada exitosamente';
    
    res.json({
      message,
      cart: updatedCart,
      stats
    });
  } catch (error) {
    if (error.message.includes('Stock insuficiente') || 
        error.message.includes('Producto no encontrado')) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al actualizar producto en carrito', 
      details: error.message 
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    // Validaciones de entrada
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        error: 'ID de producto inválido' 
      });
    }
    
    // Obtener carrito actual
    const cart = await CartService.getOrCreateCart(userId);
    
    // Verificar que el producto está en el carrito
    const existingItem = cart.items.find(
      item => item.productId._id.toString() === productId.toString()
    );
    
    if (!existingItem) {
      return res.status(404).json({ 
        error: 'Producto no encontrado en el carrito' 
      });
    }
    
    // Eliminar item del carrito
    await cart.removeItem(productId);
    
    // Obtener carrito actualizado
    const updatedCart = await CartService.getOrCreateCart(userId);
    const stats = CartService.getCartStats(updatedCart);
    
    res.json({
      message: 'Producto eliminado del carrito exitosamente',
      cart: updatedCart,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar producto del carrito', 
      details: error.message 
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Obtener carrito actual
    const cart = await CartService.getOrCreateCart(userId);
    
    // Limpiar carrito
    await cart.clearCart();
    
    // Obtener carrito actualizado (vacío)
    const updatedCart = await CartService.getOrCreateCart(userId);
    const stats = CartService.getCartStats(updatedCart);
    
    res.json({
      message: 'Carrito vaciado exitosamente',
      cart: updatedCart,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al vaciar carrito', 
      details: error.message 
    });
  }
};

const checkCartAvailability = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Obtener carrito actual
    const cart = await CartService.getOrCreateCart(userId);
    
    // Verificar disponibilidad
    const availability = await CartService.checkCartAvailability(cart);
    
    res.json({
      available: availability.isAvailable,
      unavailableItems: availability.unavailableItems,
      totalItems: cart.totalItems
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al verificar disponibilidad del carrito', 
      details: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkCartAvailability
};