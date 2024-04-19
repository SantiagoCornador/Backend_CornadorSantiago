const express = require ("express") 
const app = express ()
const PORT = 8080 
app.use(express.urlencoded({ extended: true }))
const ProductManager = require('./productManager.js');

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = await productManager.getProducts(); 
        const limitedProducts = limit ? products.slice(0, limit) : products;
        res.json(limitedProducts);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId)) {
        return res.status(400).json({ error: 'ID de producto no válido' });
    }
    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});

app.listen(PORT, ()=>{  
    console.log(`Server running on port ${PORT}`)
})