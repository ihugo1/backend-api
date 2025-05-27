const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

// Todas las rutas requieren autenticación JWT
router.use(auth);

// Obtener/crear carrito
router.get('/', cartController.getOrCreateCart);

// Agregar producto
router.post('/add', cartController.addToCart);

// Eliminar producto
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;