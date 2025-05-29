const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await Cart.findByUser(userId);
    if (!cart) {
      return res.status(400).json({ error: "No existe un carrito activo" });
    }

    const items = await Cart.getCartItems(cart.id);
    if (items.length === 0) {
      return res.status(400).json({ error: "No hay items en el carrito" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderId = await Order.create(cart.id, user.id, totalAmount);
    const order = await Order.findById(orderId);
    const orderItems = await Order.getOrderItems(orderId);

    res.status(201).json({
      message: "Orden creade exitosamente",
      order,
      items: orderItems,
    });
  } catch (error) {
    console.error("Error en createOrder:", error);
    res.status(500).json({
      error: "Error al crear la orden",
      details: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
    const { userId } = req.user;
    
    try {
        const orders = await Order.findByUser(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error en getUserOrders:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
};

const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    const { userId } = req.user;
    
    try {
        // Verificar que la orden pertenece al usuario
        const order = await Order.findById(orderId);
        if (!order || order.user_id !== userId) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const items = await Order.getOrderItems(orderId);
        res.json({ ...order, items });
    } catch (error) {
        console.error('Error en getOrderDetails:', error);
        res.status(500).json({ error: 'Error al obtener orden' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails
};
