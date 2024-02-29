const { Console } = require("console");
const fs = require("fs").promises;


class Producto {
    constructor(title, description, price, thumbnail, code, stock, ID, status, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.ID = ID;
        this.status = status;
        this.category = category;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.Path = "./ArchivoProductos.json";
    }

    async readProduct(direccion) {
        try {
            const contenido = await fs.readFile(direccion, "utf-8");
            const parsedData = JSON.parse(contenido);

            // Asegurarse de que parsedData sea un array
            this.products = Array.isArray(parsedData) ? parsedData : [parsedData];

            return this.products;
        } catch (error) {
            console.log("Error al leer los usuarios ", error);
            return this.products || [];
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        try {
            let ID;
            this.products = await this.readProduct(this.Path);

            if (!this.products.some(p => p.code === code)) {
                if (this.products.length !== 0) {
                    const identificadores = this.products.map(p => p.ID);
                    ID = Math.max(...identificadores) + 1;
                } else {
                    ID = 1;
                }

                const nuevoProducto = new Producto(title, description, price, thumbnail, code, stock, ID, true, category);
                this.products.push(nuevoProducto);
                await fs.writeFile(this.Path, JSON.stringify(this.products, null, 2));
                return 0;
            } else {
                return 1;
            }
        } catch (error) {
            return "Error en agregar carrito " + error;
        }
    }

    getProducts = async () => {
        return await this.readProduct(this.Path);
    }

    getProductByID = async (aux) => {
        this.products = await this.readProduct(this.Path);
        const p = this.products.find(p => p.ID === aux)

        if (p) {
            console.log("Producto encontrado: ");
            return p;
        }
        else {
            console.log("Producto no existe");
        }
    }

    updateProduct = async (aux, modificacion) => {
        try {
            const productos = await this.readProduct(this.Path);
            const indexProducto = productos.findIndex(p => p.ID == aux);

            if (indexProducto !== -1) {
                console.log("Producto encontrado, se verifica si se puede modificar: ");
                if (!productos.find(p => p.code === modificacion.code)) {
                    productos[indexProducto].title = modificacion.title;
                    productos[indexProducto].description = modificacion.description;
                    productos[indexProducto].price = modificacion.price;
                    productos[indexProducto].code = modificacion.code;
                    productos[indexProducto].stock = modificacion.stock;
                    productos[indexProducto].category = modificacion.category;
                    productos[indexProducto].thumbnail = modificacion.thumbnail.slice();
                    await fs.writeFile(this.Path, JSON.stringify(productos, null, 2));
                    console.log("Producto actualizado: ");
                    return { status: "success", message: "Producto actualizado" };
                } else {
                    console.log("Codigo ya existente, producto no se puede modificar");
                    return { status: "failure", message: "Código ya existente, producto no se puede modificar" };
                }
            } else {
                console.log("Producto no existe");
                return { status: "failure", message: "Producto no existe" };
            }
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            return { status: "error", message: "Error al actualizar el producto" };
        }
    }

    deleteProduct = async (aux) => {
        try { 
            const productos = await this.readProduct(this.Path);
            const arrayFiltrado = productos.filter(p => p.ID != aux);

            if (arrayFiltrado.length < productos.length) {
                console.log("Producto encontrado, se procede a eliminarlo ");
                await fs.writeFile(this.Path, JSON.stringify(arrayFiltrado, null, 2));
                console.log("Producto eliminado con éxito");
                return { status: "error", message: "Producto eliminado con éxito" };

            } else {
                console.log("Producto no existe");
                return { status: "failure", message: "Producto no existe" };
            }
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
            return { status: "failure", message: "Error al eliminar el producto: " + error};
        }
    }
}



module.exports = ProductManager;