const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear o obtener el carrito activo del usuario
const getOrCreateCart = async (req, res) => {
  try {
    let cart = await Cart.findByUser(req.user.id);
    
    if (!cart) {
      cart = await Cart.create(req.user.id);
    }

    const items = await Cart.getCartItems(cart.id);
    res.json({ cart, items });
  } catch (error) {
    console.error('Error en getOrCreateCart:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Obtener o crear carrito
    let cart = await Cart.findByUser(req.user.id);
    if (!cart) {
      cart = await Cart.create(req.user.id);
    }

    // Agregar item
    await Cart.addItem(cart.id, productId, quantity);
    const updatedItems = await Cart.getCartItems(cart.id);

    res.json({ message: 'Producto agregado', items: updatedItems });
  } catch (error) {
    console.error('Error en addToCart:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findByUser(req.user.id);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const success = await Cart.removeItem(cart.id, productId);
    if (!success) {
      return res.status(404).json({ error: 'Producto no está en el carrito' });
    }

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error en removeFromCart:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

module.exports = {
  getOrCreateCart,
  addToCart,
  removeFromCart
};