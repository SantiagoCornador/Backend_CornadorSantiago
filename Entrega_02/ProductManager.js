const fs = require('fs');

class Products {
    constructor({ id, title, description, price, thumbnail, code, stock }) {
        this.id = id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}

class ProductManager {
    static #ultimoId = 0

    constructor(path) {
        this.products = this.loadProducts(path)
        this.path = path
    }

    static #generarNuevoId() {
        return ++ProductManager.#ultimoId
    }

    loadProducts(path) {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf8');
            return JSON.parse(data);
        }
        return [];
    }

    saveProducts() {
        const data = JSON.stringify(this.products);
        fs.writeFileSync(this.path, data);
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.log('Un producto con el mismo código ya existe.');
            return null;
        }
        const id = ProductManager.#generarNuevoId()
        const product = new Products({ id, title, description, price, thumbnail, code, stock })
        this.products.push(product)
        this.saveProducts();
        return product
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log('Producto no encontrado');
            return null;
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log('Not found');
            return null;
        }
        Object.assign(product, updatedProduct);
        this.saveProducts();
        return product;
    }

    deleteProduct(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log('Not found');
            return null;
        }
        this.products = this.products.filter(product => product.id !== id);
        this.saveProducts();
        return product;
    }

    getProducts() {
        return this.products
    }
}
