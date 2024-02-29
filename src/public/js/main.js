const socket = io();

// Emitir el evento 'productos' al servidor cuando se carga la página
/*document.addEventListener('DOMContentLoaded', () => {
    socket.emit('productos');
});*/

// Solicitar los productos al conectarse al servidor
socket.on('connect', () => {
    socket.emit('productos');
});

// Recibir los productos del servidor
socket.on('productos-encontrados', (productos) => {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = ''; // Limpiamos la lista antes de agregar nuevos productos

    // Agregamos cada producto a la lista
    productos.forEach(producto => {
        const listItem = document.createElement('li');
        listItem.textContent = producto.title; // Asegúrate de que 'title' sea el atributo correcto
        listaProductos.appendChild(listItem);
    });

    //socket.disconnect();
});