const { body, validationResult } = require('express-validator');

// Validación para registro de usuario
const validateUser = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validación para productos
const validateProduct = [
  body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUser, validateProduct };