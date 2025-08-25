const Product = require('../models/Product');
const mongoose = require('mongoose');
const FilterService = require('../services/filterService');
const { deleteImage } = require('../services/cloudinaryService');

const getAllProducts = async (req, res) => {
  try {
    const allowedFilters = {
      category: { type: 'exact' },
      minPrice: { type: 'range', field: 'price' },
      maxPrice: { type: 'range', field: 'price' },
      search: { type: 'search' },
      stock: { type: 'stock' },
      inStock: { type: 'boolean' }
    };
    
    const validationErrors = FilterService.validateFilterParams(req.query, allowedFilters);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Parámetros de filtro inválidos', 
        details: validationErrors 
      });
    }
    
    const filter = FilterService.buildFilter(req.query, allowedFilters);
    const sortOptions = FilterService.buildSortOptions(req.query.sort);
    
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    const total = await Product.countDocuments(filter);
    const { skip, limit: itemsLimit, pagination } = FilterService.getPaginationData(
      req.query.page, 
      req.query.limit, 
      total
    );
    
    const products = await Product.find(filter)
      .skip(skip)
      .limit(itemsLimit)
      .sort(sortOptions);
    
    res.json({
      products,
      pagination
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', details: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock, category } = req.body;
    
    if (!image || !image.url || !image.public_id) {
      return res.status(400).json({ 
        error: 'La imagen debe incluir url y public_id', 
        details: 'Formato requerido: {"url": "https://...", "public_id": "id_cloudinary"}' 
      });
    }
    
    const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingProduct) {
      return res.status(400).json({ error: 'Ya existe un producto con este nombre' });
    }
    
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      stock,
      category
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: savedProduct
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, stock, category } = req.body;
    
    if (image && (!image.url || !image.public_id)) {
      return res.status(400).json({ 
        error: 'La imagen debe incluir url y public_id', 
        details: 'Formato requerido: {"url": "https://...", "public_id": "id_cloudinary"}' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    
    if (name) {
      const existingProduct = await Product.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        return res.status(400).json({ error: 'Ya existe otro producto con este nombre' });
      }
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;
    if (stock !== undefined) updateData.stock = stock;
    if (category !== undefined) updateData.category = category;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Eliminar imagen de Cloudinary si existe
    if (product.image && product.image.public_id) {
      try {
        await deleteImage(product.image.public_id);
        console.log(`Imagen eliminada de Cloudinary: ${product.image.public_id}`);
      } catch (cloudinaryError) {
        console.error('Error eliminando imagen de Cloudinary:', cloudinaryError);
        // No fallar toda la operación por un error de Cloudinary
      }
    }
    
    // Eliminar producto de la base de datos
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    res.json({
      message: 'Producto eliminado exitosamente',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const allowedFilters = {
      minPrice: { type: 'range', field: 'price' },
      maxPrice: { type: 'range', field: 'price' },
      search: { type: 'search' },
      inStock: { type: 'boolean' }
    };
    
    const validationErrors = FilterService.validateFilterParams(req.query, allowedFilters);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Parámetros de filtro inválidos', 
        details: validationErrors 
      });
    }
    
    const filter = FilterService.buildFilter(req.query, allowedFilters);
    filter.category = category;
    
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    const sortOptions = FilterService.buildSortOptions(req.query.sort);
    const total = await Product.countDocuments(filter);
    
    if (total === 0) {
      return res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
    }
    
    const { skip, limit: itemsLimit, pagination } = FilterService.getPaginationData(
      req.query.page, 
      req.query.limit, 
      total
    );
    
    const products = await Product.find(filter)
      .skip(skip)
      .limit(itemsLimit)
      .sort(sortOptions);
    
    res.json({
      category,
      products,
      pagination
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos por categoría', details: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      categories: categories.sort(),
      total: categories.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', details: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getCategories
};