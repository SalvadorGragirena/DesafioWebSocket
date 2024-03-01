

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

//Middleware
app.use(express.static("./src/public"));

//Configuramos Express Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas 
app.use("/", viewsRouter);
app.use('/api/products/', productsRouter);
app.use('/api/cartProducts/', cartsRouter);

//Listen

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO} `);
})

//Socket.io: 

//1) Guardar una referencia del servidor: 

const io = socket(httpServer);


io.on('connection', (socket) => {
    // Manejar evento 'productos'
    socket.on('productos', async () => {
        try {
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            io.emit('productos-encontrados', { error: 'Error al obtener productos' });
        }
    });

    // Manejar evento 'agregar-producto'
    socket.on('agregar-producto', async (nuevoProducto) => {
        try {
            // Agregar el nuevo producto al sistema o realizar cualquier otra acción necesaria
            console.log('Nuevo producto recibido hola:', nuevoProducto);
            // Por ejemplo, puedes llamar a un método en tu ProductManager para agregar el producto
            const resp = await managerProducto.addProduct(nuevoProducto);
            // Emitir un evento para informar a todos los clientes sobre el nuevo producto
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
            socket.emit('producto-LogicaAdd', resp);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            // Puedes emitir un evento de error si lo deseas
            socket.emit('producto-LogicaAdd', 'Error al agregar producto');
        }
    });


    socket.on('eliminar-producto', async (idProducto) => {
        try {
            // Eliminar el producto del sistema o realizar cualquier otra acción necesaria
            console.log('Producto a eliminar recibido:', idProducto);
            // Llamar al método en ProductManager para eliminar el producto
            await managerProducto.deleteProduct(idProducto);
            // Emitir un evento para informar a todos los clientes sobre la actualización en los productos
            const ArrayProducts = await managerProducto.getProducts();
            io.emit('productos-encontrados', ArrayProducts);
            // Emitir un evento para indicar que se ha eliminado el producto
            socket.emit('producto-eliminado', { message: 'El producto ha sido eliminado' });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            // Puedes emitir un evento de error si lo deseas
            socket.emit('error-eliminar-producto', { error: 'Error al eliminar producto' });
        }
    });

});