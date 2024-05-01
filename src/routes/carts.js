const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

router.post('/', async (req, res) => {
    try {
        const carritos = await fs.readFile('src/carritos.json', 'utf8');
        const parsedCarritos = JSON.parse(carritos);
        const id = parsedCarritos.length > 0 ? parsedCarritos [parsedCarritos.length - 1].id + 1 : 1;
        const { products } = req.body;
        const newCart = { id, products };
        parsedCarritos.push(newCart);
        await fs.writeFile('src/carritos.json', JSON.stringify(parsedCarritos, null, 2));
        res.json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = parseInt (req.params.cid);
    try {
        const carritos = await fs.readFile('src/carritos.json', 'utf8');
        const parsedCarritos = JSON.parse(carritos);
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

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;
    try {
        const carritos = await fs.readFile('src/carritos.json', 'utf8');
        const parsedCarritos = JSON.parse(carritos);
        const cart = parsedCarritos.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const existingProduct = cart.products.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }
        await fs.writeFile('src/carritos.json', JSON.stringify(parsedCarritos, null, 2));
        req.io.emit('productAdded', { cartId, productId, quantity });
        res.json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});


module.exports = router;
