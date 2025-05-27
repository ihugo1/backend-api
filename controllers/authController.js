const User = require('../models/User');
const { generateToken } = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = await User.create({ name, email, password });
    const user = await User.findById(userId);
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user || !(await User.comparePasswords(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = generateToken(user);
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil.' });
  }
};

module.exports = { register, login, getProfile };