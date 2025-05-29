const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
        return res.status(400).json({ error: "ID de usuario no proporcionado" });
    }

    try {
        // 1. Obtener carrito activo
        const cart = await Cart.findByUser(userId);
        if (!cart) {
            return res.status(400).json({ error: "No existe un carrito activo" });
        }

        // 2. Obtener items del carrito
        const items = await Cart.getCartItems(cart.id);
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        // 3. Calcular total
        const totalAmount = items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        ).toFixed(2);

        // 4. Crear orden
        const orderId = await Order.createFromCart(cart.id, userId, totalAmount);
        const order = await Order.findById(orderId);
        const orderItems = await Order.getOrderItems(orderId);

        res.status(201).json({
            message: "Orden creada exitosamente",
            order,
            items: orderItems
        });

    } catch (error) {
        console.error("Error en createOrder:", {
            error: error.message,
            userId,
            stack: error.stack
        });
        
        res.status(500).json({
            error: "Error al crear la orden",
            details: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.user?.id;

    try {
        const orders = await Order.findByUser(userId);
        res.json(orders);
    } catch (error) {
        console.error("Error en getUserOrders:", error);
        res.status(500).json({ error: "Error al obtener órdenes" });
    }
};

const getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.user?.id;

    try {
        const order = await Order.findById(orderId);
        
        // Verificar que la orden pertenece al usuario
        if (!order || order.user_id !== userId) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        const items = await Order.getOrderItems(orderId);
        res.json({ ...order, items });
    } catch (error) {
        console.error("Error en getOrderDetails:", error);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails
};