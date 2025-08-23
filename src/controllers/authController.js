const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role: role || 'client'
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: savedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: 'Login exitoso',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      message: 'Perfil del usuario',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Datos de validación incorrectos', details: errors });
    }
    res.status(500).json({ error: 'Error al actualizar perfil', details: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};