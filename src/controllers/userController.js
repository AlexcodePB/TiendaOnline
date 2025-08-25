const User = require('../models/User');
const FilterService = require('../services/filterService');

const getAllUsers = async (req, res) => {
  try {
    const allowedFilters = {
      role: { type: 'exact' },
      search: { type: 'regex', field: 'name' },
      email: { type: 'regex', field: 'email' },
      createdAfter: { type: 'date', field: 'createdAt' },
      createdBefore: { type: 'date', field: 'createdAt' }
    };
    
    const validationErrors = FilterService.validateFilterParams(req.query, allowedFilters);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Parámetros de filtro inválidos', 
        details: validationErrors 
      });
    }
    
    const filter = FilterService.buildFilter(req.query, allowedFilters);
    const sortOptions = FilterService.buildSortOptions(req.query.sort || 'date_desc');
    
    const total = await User.countDocuments(filter);
    const { skip, limit: itemsLimit, pagination } = FilterService.getPaginationData(
      req.query.page, 
      req.query.limit, 
      total
    );
    
    const users = await User.find(filter)
      .skip(skip)
      .limit(itemsLimit)
      .sort(sortOptions)
      .select('-password');
    
    res.json({
      users,
      pagination
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario puede ver este perfil
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ 
        error: 'Solo puedes ver tu propio perfil o ser administrador' 
      });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const newUser = new User({
      name,
      email,
      password,
      phone
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone } = req.body;
    
    // Verificar si el usuario puede actualizar este perfil
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ 
        error: 'Solo puedes actualizar tu propio perfil o ser administrador' 
      });
    }
    
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }
    
    const updateData = { name, email, phone };
    if (password) {
      updateData.password = password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Solo los administradores pueden eliminar usuarios' 
      });
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};