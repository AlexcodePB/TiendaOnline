const validateUserData = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'El nombre es requerido y debe ser una cadena válida' });
  }
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'El email es requerido' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El email debe tener un formato válido' });
  }
  
  if (req.method === 'POST' && (!password || password.length < 6)) {
    return res.status(400).json({ error: 'La contraseña es requerida y debe tener al menos 6 caracteres' });
  }
  
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  
  next();
};

module.exports = {
  validateUserData
};