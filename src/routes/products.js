import express from 'express';
import { promises as fsPromises } from 'fs';
import { Server } from 'socket.io';

const router = express.Router();
const io = new Server();

router.get('/', async (req, res) => {
    try {
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productosData);
        res.render('home', { productos: parsedProductos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productosData);
        res.render('realTimeProducts', { productos: parsedProductos });
    } catch (error) {
        console.error('Error al obtener productos en tiempo real:', error);
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});

io.on('connection', (socket) => {
    console.log('Cliente WebSocket conectado');

    socket.on('addProduct', async (newProduct) => {
        try {
            const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
            let parsedProductos = JSON.parse(productosData);
            const id = parsedProductos.length > 0 ? parsedProductos[parsedProductos.length - 1].id + 1 : 1;
            const productoConId = {
                id,
                ...newProduct,
            };
            parsedProductos.push(productoConId);
            await fsPromises.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
            io.emit('newProduct', productoConId); 
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });
});



router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productosData);
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
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        const parsedProductos = JSON.parse(productosData);
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
        await fsPromises.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(productoConId);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    try {
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        let parsedProductos = JSON.parse(productosData);
        const index = parsedProductos.findIndex(prod => prod.id === productId);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        parsedProductos[index] = { ...parsedProductos[index], ...updatedProduct };
        await fsPromises.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json(parsedProductos[index]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const productosData = await fsPromises.readFile('src/productos.json', 'utf8');
        let parsedProductos = JSON.parse(productosData);
        parsedProductos = parsedProductos.filter(prod => prod.id !== productId);
        await fsPromises.writeFile('src/productos.json', JSON.stringify(parsedProductos, null, 2));
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});


export { router as default, io };