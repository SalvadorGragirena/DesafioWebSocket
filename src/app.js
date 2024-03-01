const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const ProductManager = require('./ProductManager'); // Importa la clase

let managerProducto = new ProductManager();


app.use(express.static("./src/public"));


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/", viewsRouter);
app.use('/api/products/', productsRouter);
app.use('/api/cartProducts/', cartsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO} `);
})



const io = socket(httpServer);


io.on('connection', (socket) => {

    socket.on('productos', async () => {
        try {
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            io.emit('productos-encontrados', { error: 'Error al obtener productos' });
        }
    });

    socket.on('agregar-producto', async (nuevoProducto) => {
        try {
            console.log('Nuevo producto recibido hola:', nuevoProducto);
            const resp = await managerProducto.addProduct(nuevoProducto);
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
            socket.emit('producto-LogicaAdd', resp);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            socket.emit('producto-LogicaAdd', 'Error al agregar producto');
        }
    });


    socket.on('eliminar-producto', async (idProducto) => {
        try {
            console.log('Producto a eliminar recibido:', idProducto);
            await managerProducto.deleteProduct(idProducto);
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
            socket.emit('producto-eliminado', { message: 'El producto ha sido eliminado' });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            socket.emit('error-eliminar-producto', { error: 'Error al eliminar producto' });
        }
    });

});