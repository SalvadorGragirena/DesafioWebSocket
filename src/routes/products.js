const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager'); // Importa la clase

let manager = new ProductManager();

//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/", async (req, res) => {
    const ArrayProducts = await manager.getProducts();
    if (ArrayProducts.length) {
        res.send(ArrayProducts);
    } else {
        res.send("No hay productos");
    }
})

router.get("/limite", async (req, res) => {
    const limit = req.query.limit;
    const ArrayProducts = await manager.getProducts();
    if (ArrayProducts.length) {
        if (limit) {
            const ArrayLimited = ArrayProducts.slice(0, limit);
            res.send(ArrayLimited);
        } else {
            res.send(ArrayProducts);
        }
    } else {
        res.send("No hay productos");
    }
})

router.get("/:ID", async (req, res) => {
    const ID = req.params.ID;
    const ArrayProducts = await manager.getProducts();
    const ProductFound = ArrayProducts.find(p => p.ID == ID);
    if (ProductFound) {
        res.send(ProductFound);
    } else {
        res.send("Producto no encontrado");
    }
})

//ruta Post para generar nuevos productos

router.post("/", async (req, res) => {
    //Se recibe datos de Postman y se crea nuevo producto
    const productoNuevo = req.body;

    if (productoNuevo.title &&
        productoNuevo.description &&
        productoNuevo.price &&
        productoNuevo.code &&
        productoNuevo.stock &&
        productoNuevo.category) {
        const tellmeMessage = await manager.addProduct(productoNuevo.title, productoNuevo.description, productoNuevo.price, productoNuevo.thumbnail, productoNuevo.code, productoNuevo.stock,
            productoNuevo.category);
        if (tellmeMessage === 0) {
            res.send({ status: "success", message: "Producto creado" });
        } else if (tellmeMessage === 1) {
            res.send({ status: "No successfull", message: "Producto ya existe" });
        } else {
            res.send({ status: "No successfull", message: "Problemas con el archivo" });
        }

    } else
        res.send({ status: "No successfull", message: "Debe especificar todos los campos del producto" });
})


router.put("/:id", async (req, res) => {
    const { id } = req.params;
    let productUpdated = req.body;

    if (productUpdated.title &&
        productUpdated.description &&
        productUpdated.price &&
        productUpdated.thumbnail &&
        productUpdated.code &&
        productUpdated.category &&
        productUpdated.stock) {
        const message = await manager.updateProduct(id, productUpdated);
        res.send(message);
    } else {
        res.send({ status: "No successfull", message: "Debe modificar todos los campos" });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const message = await manager.deleteProduct(id);
    res.send(message);
})

module.exports = router;
