const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: 'Error de autenticación', details: error.message });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado. No tienes permisos para realizar esta acción',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Solo administradores pueden realizar esta acción'
    });
  }

  next();
};

const isClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'client') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Solo clientes pueden realizar esta acción'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  authorizeRoles,
  isAdmin,
  isClient
};