const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas para productos
const productosRouter = require('./routes/products');
app.use('/api/products', productosRouter);

// Rutas para carritos
const carritosRouter = require('./routes/carts');
app.use('/api/carts', carritosRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
