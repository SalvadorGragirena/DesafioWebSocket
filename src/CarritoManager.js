const { Console } = require("console");
const fs = require("fs").promises;

class Carrito {
    constructor(ID) {
        this.ID = ID
        this.products = [];
    }
}

class CarritoManager {
    constructor() {
        this.Path = "./ArchivoCarritos.json";
    }

    async readCarritos() {
        try {
            const contenido = await fs.readFile(this.Path, "utf-8");
            const parsedData = JSON.parse(contenido);

            // Asegurarse de que parsedData sea un array
            const carritos = Array.isArray(parsedData) ? parsedData : [parsedData];

            return carritos;
        } catch (error) {
            console.log("Error al leer carritos ", error);
            return [];
        }
    }


    showCarrito = async () => {
        try {
            const contenido = await fs.readFile(this.Path, "utf-8");
            const parsedData = JSON.parse(contenido);

            // Asegurarse de que parsedData sea un array
            const carritos = Array.isArray(parsedData) ? parsedData : [parsedData];

            return carritos;
        } catch (error) {
            return [];
        }
    }

    addCarrito = async () => {
        try {
            let ID;
            let carritos = await this.readCarritos();
            if (carritos.length !== 0) {
                const identificadores = carritos.map(c => c.ID);
                ID = Math.max(...identificadores) + 1;
            } else {
                ID = 1;
            }

            const nuevoCarrito = new Carrito(ID);
            carritos.push(nuevoCarrito);
            await fs.writeFile(this.Path, JSON.stringify(carritos, null, 2));
            return { status: "success", message: "Carrito añadido con éxito" };

        } catch (error) {
            return { status: "failure", message: "Carrito no se pudo añadir " + error };
        }
    }


   async addProduct(cid, pid) {
        try {
            let contenido = await fs.readFile(this.Path, "utf-8");
            let parsedData = JSON.parse(contenido);
            const productos = Array.isArray(parsedData) ? parsedData : [parsedData];
          
            contenido = await fs.readFile(this.Path, "utf-8");
            parsedData = JSON.parse(contenido);
            const carritos = Array.isArray(parsedData) ? parsedData : [parsedData];

            if (carritos.length > 0) {
                if (productos.length > 0) {
                    const auxProducto = productos.find(p => p.ID == pid);
                    if (auxProducto) {
                        console.log(auxProducto);
                        console.log("Existe producto");
                        const auxCarrito = carritos.find(c => c.ID == cid);
                        if (auxCarrito) {
                            console.log("Existe carrito");
                            console.log(auxCarrito);
                            const nuevoProducto = { ID: pid, quantity: 1 };
                            if(auxCarrito.products.length === 0){
                            auxCarrito.products.push(nuevoProducto);
                            }else{
                                let quantityProducto = auxCarrito.products.find(q => q.ID == pid);
                                quantityProducto.quantity = quantityProducto.quantity + 1;
                            }
                            await fs.writeFile(this.Path, JSON.stringify(carritos, null, 2));
                            console.log("Producto añadido al carrito con éxito");
                            return ({ status: "success", message: "Producto añadido al carrito con éxito" })
                        } else {
                            console.log("Carrito no existe");
                            return ({ status: "failure", message: "Carrito no existe" })
                        }
                    } else {
                        console.log("Producto no existe");
                        return ({ status: "failure", message: "Producto no existe" })
                    }
                } else {
                    console.log("No hay productos en la lista");
                    return ({ status: "failure", message: "No hay productos en la lista" })
                }
            } else {
                console.log("No hay carritos creados");
                return ({ status: "failure", message: "No hay carritos creados" })
            }
        }
        catch (error) {
            console.log("Error al leer archivo de productos:", error);
            return ({ status: "failure", message: "Error al leer archivo de productos o de carrito:", error })
        }
    }

}

module.exports = CarritoManager;