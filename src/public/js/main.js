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

    // Recorremos cada producto y creamos una tarjeta Bootstrap para cada uno
    productos.forEach(producto => {
        // Creamos el div para la tarjeta
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'm-2'); // Agregamos clases de Bootstrap para la tarjeta y un margen
        cardDiv.style.width = '18rem'; // Establecemos el ancho de la tarjeta

        // Creamos la imagen de la tarjeta
        const imageElement = document.createElement('img');
        imageElement.classList.add('card-img-top');
        imageElement.src = producto.thumbnail[0]; // Tomamos la primera imagen del array de thumbnails
        imageElement.alt = producto.title; // Establecemos el texto alternativo de la imagen

        // Creamos el div del cuerpo de la tarjeta
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        // Creamos el título de la tarjeta
        const titleElement = document.createElement('h5');
        titleElement.classList.add('card-title');
        titleElement.textContent = producto.title;

        // Creamos el texto de la tarjeta para el precio
        const priceElement = document.createElement('p');
        priceElement.classList.add('card-text');
        priceElement.textContent = `Precio: $${producto.price}`;

        // Creamos el texto de la tarjeta para la descripción
        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('card-text');
        descriptionElement.textContent = producto.description;

        // Creamos el botón de la tarjeta
        const btnElement = document.createElement('a');
        btnElement.href = '#'; // Enlace ficticio por ahora
        btnElement.classList.add('btn', 'btn-primary');
        btnElement.textContent = 'Ver más';

        // Agregamos los elementos al cuerpo de la tarjeta
        cardBodyDiv.appendChild(titleElement);
        cardBodyDiv.appendChild(priceElement);
        cardBodyDiv.appendChild(descriptionElement);
        cardBodyDiv.appendChild(btnElement);

        // Agregamos la imagen y el cuerpo de la tarjeta al div de la tarjeta
        cardDiv.appendChild(imageElement);
        cardDiv.appendChild(cardBodyDiv);

        // Agregamos la tarjeta al contenedor de productos
        listaProductos.appendChild(cardDiv);
    });
    socket.disconnect();
});