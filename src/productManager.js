const fs = require('fs').promises;

class ProductManager {
    constructor() {
        this.path = "Productos.json";
        this.productos = []
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios");
            }

            const products = await this.loadProducts();
            const existingProduct = products.find(product => product.code === code);
            if (existingProduct) {
                throw new Error("Error - Ya existe el producto");
            }

            const product = {
                id: products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            products.push(product);
            await this.saveProducts(products);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    }

    async getProducts() {
        try {
            const products = await this.loadProducts();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.loadProducts();
            const product = products.find(product => product.id === id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            return null;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }
            products[productIndex] = { ...products[productIndex], ...updatedProduct };
            await this.saveProducts(products);
            return products[productIndex];
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.loadProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado");
            }
            const deletedProduct = products.splice(productIndex, 1)[0];
            await this.saveProducts(products);
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            return null;
        }
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                
                return [];
            }
            throw error;
        }
    }

    async saveProducts(products) {
        const data = JSON.stringify(products);
        await fs.writeFile(this.path, data);
        console.log('Productos guardados correctamente');
    }
}

module.exports = ProductManager;
