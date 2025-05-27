const db = require('../config/db');

class Product {
  static async create({ name, description, price, image_url, category }) {
    const [result] = await db.pool.execute(
      'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image_url, category]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.pool.execute('SELECT * FROM products');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name, description, price, image_url, category }) {
    const [result] = await db.pool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
      [name, description, price, image_url, category, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findByCategory(category) {
    const [rows] = await db.pool.execute('SELECT * FROM products WHERE category = ?', [category]);
    return rows;
  }
}

module.exports = Product;