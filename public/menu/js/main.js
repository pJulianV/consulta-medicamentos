const contenedorTarjetas = document.getElementById("productos-container");

function crearTarjetasProductosInicio(productos) {
    productos.forEach(producto => {
        const nuevaPizza = document.createElement("div");
        nuevaPizza.classList.add("tarjeta-producto");
        nuevaPizza.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <p>${producto.descripcion}</p>
        <button>Agregar al carrito</button>
        `
        contenedorTarjetas.appendChild(nuevaPizza);
        nuevaPizza.getElementsByTagName("button")[0].addEventListener("click", () => agregarAlCarrito(producto)); /*Hace que el botón funcione y reconozca cada producto*/
    });
}


crearTarjetasProductosInicio(pizzas);