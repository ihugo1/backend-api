const db = require('../config/db');

class Order {
    /**
     * Crear una orden desde el carrito (con transacción)
     * @param {number} cartId - ID del carrito
     * @param {number} userId - ID del usuario
     * @param {number} totalAmount - Total calculado
     */
    static async createFromCart(cartId, userId, totalAmount) {
        const connection = await db.pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Obtener items del carrito con precios
            const [items] = await connection.query(
                `SELECT ci.product_id, ci.quantity, p.price 
                 FROM cart_items ci
                 JOIN products p ON ci.product_id = p.id
                 WHERE ci.cart_id = ?`,
                [cartId]
            );

            if (items.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // 2. Crear la orden
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
                [userId, totalAmount]
            );
            const orderId = orderResult.insertId;

            // 3. Mover items a order_items
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }

            // 4. Vaciar carrito
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

            await connection.commit();
            return orderId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Obtener orden por ID
     */
    static async findById(orderId) {
        const [rows] = await db.pool.execute(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );
        return rows[0];
    }

    /**
     * Obtener órdenes de un usuario
     */
    static async findByUser(userId) {
        const [rows] = await db.pool.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    /**
     * Obtener items de una orden
     */
    static async getOrderItems(orderId) {
        const [rows] = await db.pool.execute(
            `SELECT oi.*, p.name, p.image_url 
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        return rows;
    }
}

module.exports = Order;