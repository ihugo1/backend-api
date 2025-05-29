const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Crear orden desde el carrito
router.post('/create', orderController.createOrder);

// Obtener historial de órdenes del usuario logeado
router.get('/', orderController.getUserOrders);

// Obtener detalles de una orden específica
router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;