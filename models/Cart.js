const db = require('../config/db');

class Cart {
  static async create(userId) {
    const [result] = await db.pool.execute(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await db.pool.execute(
      'SELECT * FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0];
  }

  static async addItem(cartId, productId, quantity) {
    // Verificar si el producto ya está en el carrito
    const [existing] = await db.pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      // Actualizar cantidad si ya existe
      const [result] = await db.pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
      return result.affectedRows > 0;
    } else {
      // Agregar nuevo item
      const [result] = await db.pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
      return result.insertId;
    }
  }

  static async getCartItems(cartId) {
    const [rows] = await db.pool.execute(
      `SELECT ci.*, p.name, p.price, p.image_url 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return rows;
  }

  static async removeItem(cartId, productId) {
    const [result] = await db.pool.execute(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return result.affectedRows > 0;
  }

  static async updateItemQuantity(cartId, productId, quantity) {
    const [result] = await db.pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
    return result.affectedRows > 0;
  }

  static async clearCart(cartId) {
    const [result] = await db.pool.execute(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Cart;