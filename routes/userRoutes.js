const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middlewares/validate');
const { auth, isAdmin } = require('../middlewares/auth');

// Rutas pública (No se requiere token para logearse, registrarse)
router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);

// Ruta protegida (requiere token de validacion)
router.get('/profile', auth, userController.getProfile);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;