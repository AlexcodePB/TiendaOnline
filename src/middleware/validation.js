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

const validateProductData = (req, res, next) => {
  const { name, description, price, image, stock, category } = req.body;

  const isImageObjectValid = (img) => {
    return (
      img &&
      typeof img === 'object' &&
      typeof img.url === 'string' && img.url.trim().length > 0 &&
      typeof img.public_id === 'string' && img.public_id.trim().length > 0
    );
  };

  // Validación para creación
  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre del producto es requerido y debe ser una cadena válida' });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ error: 'La descripción es requerida y debe tener al menos 10 caracteres' });
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'El precio es requerido y debe ser un número mayor o igual a 0' });
    }

    // Imagen como objeto { url, public_id }
    if (!isImageObjectValid(image)) {
      return res.status(400).json({ error: 'La imagen es requerida y debe incluir url y public_id válidos' });
    }

    if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      return res.status(400).json({ error: 'El stock es requerido y debe ser un número entero mayor o igual a 0' });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'La categoría es requerida' });
    }
  }

  // Validación para actualización parcial (PUT)
  if (req.method === 'PUT') {
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ error: 'El nombre debe ser una cadena válida' });
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
      return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres' });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ error: 'El precio debe ser un número mayor o igual a 0' });
    }

    if (image !== undefined && !isImageObjectValid(image)) {
      return res.status(400).json({ error: 'La imagen debe incluir url y public_id válidos' });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
      return res.status(400).json({ error: 'El stock debe ser un número entero mayor o igual a 0' });
    }

    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: 'La categoría debe ser una cadena' });
    }
  }

  // Normalización
  if (name !== undefined) req.body.name = name.trim();
  if (description !== undefined) req.body.description = description.trim();
  if (category !== undefined) req.body.category = category.trim().toLowerCase();

  next();
};

module.exports = {
  validateUserData,
  validateProductData
};
