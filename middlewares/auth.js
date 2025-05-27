const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    // 1. Extraer el token del header 'Authorization'
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No hay token proporcionado.' });
    }

    // 2. Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Buscar al usuario en la base de datos (para asegurar que aún existe)
    const [user] = await pool.execute('SELECT id, role FROM users WHERE id = ?', [decoded.id]);
    
    if (!user.length) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    // 4. Adjuntar el usuario y su rol a la solicitud (req)
    req.user = { id: user[0].id, role: user[0].role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren privilegios de administrador.' });
  }
  next();
};

module.exports = { auth, isAdmin };