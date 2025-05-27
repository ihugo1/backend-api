const db = require('../config/db');

class Order {
  static async create(userId, totalAmount) {
    const [result] = await db.pool.execute(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [userId, totalAmount]
    );
    return result.insertId;
  }

  static async findById(orderId) {
    const [rows] = await db.pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const [rows] = await db.pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async addOrderItem(orderId, productId, quantity, price) {
    const [result] = await db.pool.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, price]
    );
    return result.insertId;
  }

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