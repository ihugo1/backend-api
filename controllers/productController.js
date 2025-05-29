const Product = require('../models/Product');

// Obtener todos los productos (público)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    // Si no hay productos pero la consulta fue exitosa
    if (products.length === 0) {
      return res.status(200).json([]); // Devuelve array vacío
    }
    res.json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error); // Log para debugging
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message // Opcional: mostrar el error técnico (solo en desarrollo)
    });
  }
};

// Obtener un producto por ID (público)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar producto' });
  }
};

// Crear un producto (solo admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category } = req.body;
    const productId = await Product.create({ 
      name, 
      description, 
      price, 
      image_url, 
      category 
    });
    const newProduct = await Product.findById(productId);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

/*
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category } = req.body;
    const updated = await Product.update(req.params.id, { 
      name, 
      description, 
      price, 
      image_url, 
      category 
    });
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};*/

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};