const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

router.post('/', async (req, res) => {
    try {
        const carritos = await fs.readFile('carritos.json', 'utf8');
        const parsedCarritos = JSON.parse(carritos);
        const id = Date.now().toString();
        const { products } = req.body;
        const newCart = { id, products };
        parsedCarritos.push(newCart);
        await fs.writeFile('carritos.json', JSON.stringify(parsedCarritos, null, 2));
        res.json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carritos = await fs.readFile('carritos.json', 'utf8');
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
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    try {
        const carritos = await fs.readFile('carritos.json', 'utf8');
        const parsedCarritos = JSON.parse(carritos);
        const cart = parsedCarritos.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await fs.writeFile('carritos.json', JSON.stringify(parsedCarritos, null, 2));
        res.json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;
