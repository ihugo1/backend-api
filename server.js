require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

/* Test DB connection
testConnection().then((connected) => {
  if (connected) {
    console.log("Database connected successfully");
  }
});*/

/*
app.get("/", (req, res) => {
  res.send("API funcionando");
});
*/

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require('./routes/cartRoutes');

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
