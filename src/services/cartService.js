const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  
  // Obtener o crear carrito para un usuario
  static async getOrCreateCart(userId) {
    try {
      let cart = await Cart.findOne({ userId })
        .populate({
          path: 'items.productId',
          select: 'name description price image stock category'
        });
      
      if (!cart) {
        cart = new Cart({ userId });
        await cart.save();
        // Populate después de crear
        cart = await Cart.findById(cart._id)
          .populate({
            path: 'items.productId',
            select: 'name description price image stock category'
          });
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }
  
  // Validar que un producto existe y tiene stock suficiente
  static async validateProductAndStock(productId, requestedQuantity) {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      if (product.stock < requestedQuantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock}, solicitado: ${requestedQuantity}`);
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }
  
  // Validar stock total considerando cantidad existente en carrito
  static async validateTotalStock(cart, productId, newQuantity) {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      // Buscar si el producto ya está en el carrito
      const existingItem = cart.items.find(
        item => item.productId._id.toString() === productId.toString()
      );
      
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const totalQuantityNeeded = newQuantity;
      
      if (product.stock < totalQuantityNeeded) {
        throw new Error(
          `Stock insuficiente. Disponible: ${product.stock}, ` +
          `en carrito: ${currentQuantityInCart}, ` +
          `total solicitado: ${totalQuantityNeeded}`
        );
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }
  
  // Calcular totales del carrito
  static calculateTotals(items) {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + (item.quantity * item.price), 0);
    
    return {
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100 // Redondear a 2 decimales
    };
  }
  
  // Actualizar precios del carrito basado en precios actuales de productos
  static async updateCartPrices(cart) {
    try {
      let hasChanges = false;
      
      for (let item of cart.items) {
        const currentProduct = await Product.findById(item.productId);
        
        if (currentProduct && currentProduct.price !== item.price) {
          item.price = currentProduct.price;
          hasChanges = true;
        }
      }
      
      if (hasChanges) {
        await cart.save();
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar precios: ${error.message}`);
    }
  }
  
  // Limpiar items de productos que ya no existen
  static async cleanInvalidItems(cart) {
    try {
      const validItems = [];
      
      for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          validItems.push(item);
        }
      }
      
      if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al limpiar items inválidos: ${error.message}`);
    }
  }
  
  // Verificar disponibilidad de todos los items del carrito
  static async checkCartAvailability(cart) {
    try {
      const unavailableItems = [];
      
      for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          unavailableItems.push({
            itemId: item._id,
            productId: item.productId,
            reason: 'Producto no encontrado'
          });
        } else if (product.stock < item.quantity) {
          unavailableItems.push({
            itemId: item._id,
            productId: item.productId,
            productName: product.name,
            requestedQuantity: item.quantity,
            availableStock: product.stock,
            reason: 'Stock insuficiente'
          });
        }
      }
      
      return {
        isAvailable: unavailableItems.length === 0,
        unavailableItems
      };
    } catch (error) {
      throw new Error(`Error al verificar disponibilidad: ${error.message}`);
    }
  }
  
  // Obtener estadísticas del carrito
  static getCartStats(cart) {
    if (!cart.items.length) {
      return {
        totalItems: 0,
        totalAmount: 0,
        uniqueProducts: 0,
        averageItemPrice: 0
      };
    }
    
    const totalItems = cart.totalItems;
    const totalAmount = cart.totalAmount;
    const uniqueProducts = cart.items.length;
    const averageItemPrice = Math.round((totalAmount / totalItems) * 100) / 100;
    
    return {
      totalItems,
      totalAmount,
      uniqueProducts,
      averageItemPrice
    };
  }
}

module.exports = CartService;