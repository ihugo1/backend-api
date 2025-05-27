const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser } = require('../middlewares/validate');

// Ruta pública
router.post('/register', validateUser, authController.register);
router.post('/login', authController.login);

// Ruta protegida (requiere JWT)
router.get('/profile', require('../middlewares/auth').auth, authController.getProfile);

module.exports = router;