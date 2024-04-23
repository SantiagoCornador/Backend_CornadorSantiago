const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

// Listar todos los productos
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const productos = await fs.readFile('productos.json', 'utf8');
        const parsedProductos = JSON.parse(productos);
        const limitedProductos = limit ? parsedProductos.slice(0, limit) : parsedProductos;
        res.json(limitedProductos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const productos = await fs.readFile('productos.json', 'utf8');
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

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        // Validar campos obligatorios
        if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        // Leer productos existentes
        const productos = await fs.readFile('productos.json', 'utf8');
        const parsedProductos = JSON.parse(productos);
        // Generar ID único para el nuevo producto
        const id = Date.now().toString(); // Puedes implementar un generador de IDs más robusto
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
        // Agregar el nuevo producto
        parsedProductos.push(productoConId);
        // Guardar en el archivo
        await fs.writeFile('productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(productoConId);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});


// Actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    try {
        // Leer productos existentes
        const productos = await fs.readFile('productos.json', 'utf8');
        let parsedProductos = JSON.parse(productos);
        // Buscar el producto a actualizar
        const index = parsedProductos.findIndex(prod => prod.id === productId);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        // Actualizar el producto
        parsedProductos[index] = { ...parsedProductos[index], ...updatedProduct };
        // Guardar en el archivo
        await fs.writeFile('productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(parsedProductos[index]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// Eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        // Leer productos existentes
        const productos = await fs.readFile('productos.json', 'utf8');
        let parsedProductos = JSON.parse(productos);
        // Filtrar el producto a eliminar
        parsedProductos = parsedProductos.filter(prod => prod.id !== productId);
        // Guardar en el archivo
        await fs.writeFile('productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;
