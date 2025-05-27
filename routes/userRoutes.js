const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');

// Ruta pública
router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);

// Ruta protegida (requiere JWT)
router.get('/profile', auth, userController.getProfile);

module.exports = router;