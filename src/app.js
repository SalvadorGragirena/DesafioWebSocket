

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

const httpServer =  app.listen(PUERTO, () => {
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
});