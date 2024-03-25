class ProductManager {
    constructor() {
        this.products = [];
    }


    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }


        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                console.log("Error - Ya existe el producto");
                return;
            }
        }
        const product_id = this.products.length + 1
        const product = {
            id: product_id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };
        this.products.push(product);
    }


    getProducts() {
    return this.products;

}
    getProductById(id) {
        let product = this.products.find(product => product.id === id);
        if (!product) {
            console.log("Not found");
            return null;
        }
        return product;
}
}

const productManager = new ProductManager();

