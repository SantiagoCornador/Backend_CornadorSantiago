const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
let productos = []

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const productos = await fs.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productos);
        const limitedProductos = limit ? parsedProductos.slice(0, limit) : parsedProductos;
        res.json(limitedProductos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const productos = await fs.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productos);
        const product = parsedProductos.find(prod => prod.id === productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const productos = await fs.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productos);
        const id = parsedProductos.length > 0 ? parsedProductos[parsedProductos.length - 1].id + 1 : 1;
        const productoConId = {
            id,
            title: newProduct.title,
            description: newProduct.description,
            code: newProduct.code,
            price: newProduct.price,
            status: newProduct.status !== undefined ? newProduct.status : true,
            stock: newProduct.stock,
            category: newProduct.category,
            thumbnails: newProduct.thumbnails || []
        };
        parsedProductos.push(productoConId);
        await fs.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(productoConId);
        req.io.emit('productoAgregado', nuevoProducto);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});


router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    try {
        const productos = await fs.readFile('src/productos.json', 'utf8');
        let parsedProductos = JSON.parse(productos);
        const index = parsedProductos.findIndex(prod => prod.id === productId);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        parsedProductos[index] = { ...parsedProductos[index], ...updatedProduct };
        await fs.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(parsedProductos[index]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const productos = await fs.readFile('src/productos.json', 'utf8');
        let parsedProductos = JSON.parse(productos);
        parsedProductos = parsedProductos.filter(prod => prod.id !== productId);
        await fs.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;
