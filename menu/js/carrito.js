// Selecciona el contenedor donde se mostrarán las tarjetas de los productos
const contenedorTarjetas = document.getElementById("productos-container");

// Elementos de la interfaz que mostrarán las unidades y el precio total
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");

// Elementos para mostrar mensajes cuando el carrito esté vacío o para mostrar totales
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");    

// Elemento para reiniciar (vaciar) el carrito de compras
const reiniciarCarritoElement = document.getElementById("reiniciar");
const solicitarButton = document.getElementById('solicitar');

// Función que crea las tarjetas de productos al inicio o al actualizar el carrito
function crearTarjetasProductosInicio() {
    contenedorTarjetas.innerHTML = ""; // Limpia el contenedor de tarjetas antes de agregar nuevas

    // Obtiene los productos del carrito desde el almacenamiento local
    const productos = JSON.parse(localStorage.getItem("pizzas"));
    console.log(productos);

    // Verifica si hay productos en el carrito
    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            // Crea una nueva tarjeta para cada producto
            const nuevaPizza = document.createElement("div");
            nuevaPizza.classList = "tarjeta-producto"; // Asigna la clase CSS para estilizar la tarjeta

            // Define el contenido HTML de la tarjeta con la imagen, nombre, precio y controles de cantidad
            nuevaPizza.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <div>
                <button>-</button>
                <span class="cantidad">${producto.cantidad}</span>
                <button>+</button>
            </div>
            `;
            contenedorTarjetas.appendChild(nuevaPizza); // Agrega la nueva tarjeta al contenedor

            // Evento para aumentar la cantidad de un producto
            nuevaPizza
                .getElementsByTagName("button")[1] // Selecciona el botón de incremento
                .addEventListener("click", (e) => {
                    const cuentaElement = e.target.parentElement.getElementsByTagName("span")[0];
                    cuentaElement.innerText = agregarAlCarrito(producto); // Actualiza la cantidad en la interfaz
                    actualizarTotales(); // Actualiza los totales después de cambiar la cantidad
                });

            // Evento para disminuir la cantidad de un producto
            nuevaPizza
                .getElementsByTagName("button")[0] // Selecciona el botón de decremento
                .addEventListener("click", (e) => {
                    restarAlCarrito(producto); // Disminuye la cantidad en el carrito
                    crearTarjetasProductosInicio(); // Vuelve a renderizar las tarjetas
                    actualizarTotales(); // Actualiza los totales después de cambiar la cantidad
                });
        });
    }
}

// Llama a la función para crear las tarjetas de productos al cargar la página
crearTarjetasProductosInicio();

// Llama a la función para actualizar los totales al cargar la página
actualizarTotales();

// Función que actualiza las unidades y el precio total en la interfaz
function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("pizzas")); // Obtiene los productos del almacenamiento local
    let unidades = 0; // Inicializa el contador de unidades
    let precio = 0; // Inicializa el precio total

    // Si hay productos en el carrito, suma las cantidades y los precios
    if (productos && productos.length > 0) {
        productos.forEach(producto => {
            unidades += producto.cantidad; // Suma la cantidad del producto a las unidades totales
            precio += producto.precio * producto.cantidad; // Suma el costo total del producto al precio total
        });

        // Actualiza los elementos de la interfaz con las unidades y el precio
        unidadesElement.innerText = unidades;
        precioElement.innerText = precio;

        // Habilitar el botón "Solicitar"
        solicitarButton.disabled = false;
    } else {
        solicitarButton.disabled = true; // Deshabilitar el botón si no hay productos
    }
    revisarMensajeVacio(); // Verifica si debe mostrar el mensaje de carrito vacío
}

// Función que revisa si el carrito está vacío y ajusta la interfaz en consecuencia
function revisarMensajeVacio() {
    const productos = JSON.parse(localStorage.getItem("pizzas")); // Obtiene los productos del almacenamiento local

    // Muestra u oculta el mensaje de carrito vacío dependiendo de si hay productos en el carrito
    carritoVacioElement.classList.toggle("escondido", productos && productos.length > 0);

    // Muestra u oculta los totales dependiendo de si hay productos en el carrito
    totalesElement.classList.toggle("escondido", !(productos && productos.length > 0));
}

// Llama a la función para revisar si el carrito está vacío al cargar la página
revisarMensajeVacio();

// Añade un evento al botón de reiniciar para vaciar el carrito
reiniciarCarritoElement.addEventListener("click", reiniciarCarrito);

// Función que vacía el carrito de compras
function reiniciarCarrito() {
    localStorage.removeItem("pizzas"); // Elimina los productos del almacenamiento local
    actualizarTotales(); // Actualiza la interfaz después de vaciar el carrito
    crearTarjetasProductosInicio(); // Vuelve a renderizar las tarjetas, que ahora estarán vacías
}

// Función para generar un código aleatorio de 4 caracteres y mostrar el tiempo de espera
function generarCodigoAleatorio() {
    const codigo = Math.random().toString(36).substr(2, 4).toUpperCase(); // Genera un código de 4 caracteres

    // Genera un tiempo de espera aleatorio entre 30 minutos y 2 horas
    const tiempoEsperar = Math.floor(Math.random() * (120 - 30 + 1)) + 30; // Tiempo en minutos
    const horas = Math.floor(tiempoEsperar / 60);
    const minutos = tiempoEsperar % 60;

    // Calcula el tiempo de espera en formato legible
    const tiempoMensaje = `Acerquese a la sede en:  ${horas > 0 ? horas + ' horas' : ''} ${minutos} minutos.`;

    alert(`Tu turno  es: ${codigo}\n${tiempoMensaje}`);
}

// Agregar el evento al botón "Solicitar" para generar el código aleatorio y mostrar el tiempo de espera
solicitarButton.addEventListener('click', generarCodigoAleatorio);

// Función para enviar el pedido
function enviarPedido() {
    const productos = JSON.parse(localStorage.getItem("pizzas"));
    const datosPedido = {
        cliente: {
            // Aquí puedes incluir información del cliente
            nombre: "Nombre del Cliente",
            email: "correo@ejemplo.com"
        },
        productos: productos,
        total: calcularTotal(productos)
    };

    fetch('URL_DEL_SERVICIO', { // Cambia por la URL de tu servicio web
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Éxito:', data);
        // Aquí puedes agregar lógica para mostrar un mensaje de éxito o redirigir al usuario
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Función para calcular el total del pedido
function calcularTotal(productos) {
    let total = 0;
    productos.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total;
}

// Agregar el evento al botón para enviar el pedido
document.getElementById("enviar-pedido").addEventListener("click", enviarPedido);
