const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es requerido']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser al menos 1'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value > 0;
      },
      message: 'La cantidad debe ser un número entero positivo'
    }
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'El precio debe ser un número válido mayor o igual a 0'
    }
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0,
    min: [0, 'El total de items no puede ser negativo']
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'El total no puede ser negativo'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'El total debe ser un número válido mayor o igual a 0'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware para actualizar totales antes de guardar
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calcular totales automáticamente
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  
  // Redondear el total a 2 decimales
  this.totalAmount = Math.round(this.totalAmount * 100) / 100;
  
  next();
});

// Método para agregar item al carrito
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );
  
  if (existingItemIndex > -1) {
    // Si el item ya existe, actualizar cantidad
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].addedAt = new Date();
  } else {
    // Si no existe, agregar nuevo item
    this.items.push({
      productId,
      quantity,
      price,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Método para actualizar cantidad de un item
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.productId.toString() === productId.toString()
  );
  
  if (!item) {
    throw new Error('Producto no encontrado en el carrito');
  }
  
  if (quantity <= 0) {
    // Si la cantidad es 0 o negativa, eliminar el item
    this.items = this.items.filter(
      item => item.productId.toString() !== productId.toString()
    );
  } else {
    // Actualizar cantidad
    item.quantity = quantity;
    item.addedAt = new Date();
  }
  
  return this.save();
};

// Método para eliminar item del carrito
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  
  return this.save();
};

// Método para limpiar carrito
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Índices para optimizar consultas
cartSchema.index({ userId: 1 }, { unique: true });
cartSchema.index({ 'items.productId': 1 });
cartSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Cart', cartSchema);