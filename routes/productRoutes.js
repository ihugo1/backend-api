const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, isAdmin } = require('../middlewares/auth');
const { validateProduct } = require('../middlewares/validate');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo admin)
router.post('/', auth, isAdmin, validateProduct, productController.createProduct);
router.put('/:id', auth, isAdmin, validateProduct, productController.updateProduct);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router;