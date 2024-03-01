const socket = io();

socket.on('connect', () => {
    socket.emit('productos');
});

socket.on('productos-encontrados', (productos) => {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productos.forEach(producto => {

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'm-2');
        cardDiv.style.width = '18rem';

        const imageElement = document.createElement('img');
        imageElement.classList.add('card-img-top');
        imageElement.src = producto.thumbnail[0];
        imageElement.alt = producto.title;

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');

        const titleElement = document.createElement('h5');
        titleElement.classList.add('card-title');
        titleElement.textContent = producto.title;

        const priceElement = document.createElement('p');
        priceElement.classList.add('card-text');
        priceElement.textContent = `Precio: $${producto.price}`;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('card-text');
        descriptionElement.textContent = producto.description;

        const btnElement = document.createElement('button');
        btnElement.classList.add('btn', 'btn-primary');
        btnElement.textContent = 'Eliminar';

        btnElement.addEventListener('click', function (event) {
            socket.emit('eliminar-producto', producto.ID);
        });

        cardBodyDiv.appendChild(titleElement);
        cardBodyDiv.appendChild(priceElement);
        cardBodyDiv.appendChild(descriptionElement);
        cardBodyDiv.appendChild(btnElement);

        cardDiv.appendChild(imageElement);
        cardDiv.appendChild(cardBodyDiv);

        listaProductos.appendChild(cardDiv);
    });
});

const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const codigo = document.getElementById('codigo').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('categoria').value;

    const nuevoProducto = {
        title: titulo,
        description: descripcion,
        price: precio,
        thumbnail: ["hola", "hola"],
        code: codigo,
        stock: stock,
        category: categoria
    };

    socket.emit('agregar-producto', nuevoProducto);
    socket.on('producto-LogicaAdd', (respuesta) => {
        alert(respuesta);
        console.log(respuesta);
    });
    formulario.reset();
});

