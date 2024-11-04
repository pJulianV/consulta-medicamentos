function agregarAlCarrito(producto) {
    // Lee la información del carrito de compras almacenada en localStorage
    // El JSON.parse convierte la cadena JSON en un array de objetos JavaScript
    const memoria = JSON.parse(localStorage.getItem("pizzas"));
    console.log(memoria);
    let cuenta = 0;

    // Si no hay nada en la memoria, crea un nuevo carrito con el primer producto
    if (!memoria) {
        // Crea un nuevo producto con una cantidad inicial de 1
        const nuevoProducto = getNuevoProductoParaMemoria(producto);
        // Guarda el nuevo carrito en localStorage (convirtiéndolo en una cadena JSON)
        localStorage.setItem("pizzas", JSON.stringify([nuevoProducto]));
        cuenta = 1; // Actualiza la cuenta de productos en el carrito
    } else {
        // Busca el índice del producto en la memoria, si ya existe en el carrito
        const indiceProducto = memoria.findIndex(pizza => pizza.id === producto.id);
        console.log(indiceProducto);
        const nuevaMemoria = memoria;

        // Si el producto no está en el carrito, lo agrega como nuevo
        if (indiceProducto === -1) {
            nuevaMemoria.push(getNuevoProductoParaMemoria(producto));
            cuenta = 1; // Inicializa la cantidad del nuevo producto
        } else {
            // Si el producto ya existe en el carrito, incrementa su cantidad
            nuevaMemoria[indiceProducto].cantidad++;
            cuenta = nuevaMemoria[indiceProducto].cantidad; // Actualiza la cuenta con la nueva cantidad
        }

        // Guarda el carrito actualizado en localStorage
        localStorage.setItem("pizzas", JSON.stringify(nuevaMemoria));
        // Actualiza el número de productos en el carrito visible en la interfaz
        actualizarNumeroCarrito();
        return cuenta;
    }
}

function restarAlCarrito(producto) {
    // Lee el carrito de compras desde localStorage
    const memoria = JSON.parse(localStorage.getItem("pizzas"));
    // Encuentra el índice del producto en el carrito
    const indiceProducto = memoria.findIndex(pizza => pizza.id === producto.id);

    // Si la cantidad del producto es 1, lo elimina del carrito
    if (memoria[indiceProducto].cantidad === 1) {
        memoria.splice(indiceProducto, 1); // Elimina el producto del array
        localStorage.setItem("pizzas", JSON.stringify(memoria)); // Guarda el carrito actualizado
    } else {
        // Si la cantidad es mayor a 1, la disminuye
        memoria[indiceProducto].cantidad--;
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("pizzas", JSON.stringify(memoria));
    // Actualiza el número de productos en el carrito visible en la interfaz
    actualizarNumeroCarrito();
}

/* Crea un nuevo producto con una cantidad inicial de 1 y lo devuelve */
function getNuevoProductoParaMemoria(producto) {
    const nuevoProducto = producto;
    nuevoProducto.cantidad = 1; // Inicializa la cantidad del producto
    return nuevoProducto;
}

// Elemento en la interfaz que muestra el número de productos en el carrito
const cuentaCarritoElement = document.getElementById("cuentaCarrito");

function actualizarNumeroCarrito() {
    // Lee el carrito de compras desde localStorage
    const memoria = JSON.parse(localStorage.getItem("pizzas"));

    // Si hay productos en el carrito
    if (memoria && memoria.length > 0) {
        // Reduce el array de productos a un solo valor: la suma de las cantidades de cada producto
        const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
        cuentaCarritoElement.innerText = cuenta; // Actualiza la interfaz con la cantidad total
        console.log(cuenta);
    } else {
        // Si no hay productos, muestra 0 en la interfaz
        cuentaCarritoElement.innerText = 0;
    }
}

// Se llama a esta función al cargar la página para asegurarse de que el número del carrito esté actualizado
actualizarNumeroCarrito();
