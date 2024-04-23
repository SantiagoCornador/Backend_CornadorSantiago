const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

// Crear un nuevo carrito con productos
router.post('/', async (req, res) => {
    try {
      // Leer el archivo de carritos
      const carritos = await fs.readFile('carritos.json', 'utf8');
      const parsedCarritos = JSON.parse(carritos);
      // Generar un ID único para el nuevo carrito
      const id = Date.now().toString(); // Puedes implementar un generador de IDs más robusto
      const { products } = req.body; // Obtener los productos del cuerpo de la solicitud
      const newCart = { id, products }; // Incluir los productos en el nuevo carrito
      // Agregar el nuevo carrito al archivo
      parsedCarritos.push(newCart);
      await fs.writeFile('carritos.json', JSON.stringify(parsedCarritos, null, 2));
      res.json(newCart);
    } catch (error) {
      console.error('Error al crear carrito:', error);
      res.status(500).json({ error: 'Error al crear carrito' });
    }
  });

// Obtener los productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    // Leer el archivo de carritos
    const carritos = await fs.readFile('carritos.json', 'utf8');
    const parsedCarritos = JSON.parse(carritos);
    // Buscar el carrito por su ID
    const cart = parsedCarritos.find(cart => cart.id === cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    res.status(500).json({ error: 'Error al obtener productos del carrito' });
  }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  try {
    // Leer el archivo de carritos
    const carritos = await fs.readFile('carritos.json', 'utf8');
    const parsedCarritos = JSON.parse(carritos);
    // Buscar el carrito por su ID
    const cart = parsedCarritos.find(cart => cart.id === cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
    if (existingProductIndex !== -1) {
      // Incrementar la cantidad del producto existente
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Agregar el producto al carrito
      cart.products.push({ productId, quantity });
    }
    // Guardar el carrito actualizado en el archivo
    await fs.writeFile('carritos.json', JSON.stringify(parsedCarritos, null, 2));
    res.json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

module.exports = router;
