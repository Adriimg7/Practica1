import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteCarroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  async refresh(){

    await super.refresh();
    this.mostrarCarrito();
  }

  // Método para cargar los datos del carrito en la vista
  mostrarCarrito() {
    const clienteActual = model.getClienteActual();
    const carrito = clienteActual?.getCarro();

    if (!carrito || carrito.items.length === 0) {
      document.querySelector("#lista-libros").innerHTML = "<p>El carrito está vacío</p>";
      document.querySelector("#total").innerHTML = "";
      return;
    }

    // Mostrar libros en el carrito
     const listaLibros = document.querySelector("#lista-libros");
    listaLibros.innerHTML = carrito.items.map((item, index) => {
      // Convertir el precio a número si es necesario o manejar un valor predeterminado si es inválido
      const precio = parseFloat(item.libro.precio) || 0;
      const total = parseFloat(item.total) || 0;
    
    //   return `
    //     <div class="carrito-item">
    //       <p><strong>${item.libro.titulo}</strong></p>
    //       <p>Precio: $${precio.toFixed(2)}</p>
    //       <p>Cantidad: ${item.cantidad}</p>
    //       <p>Total: $${total.toFixed(2)}</p>
    //       <button onclick="borrarItem(${index})">Eliminar</button>
    //     </div>
    //   `;
    // }).join("");

    return `
      <tr class="carrito-item">
        <td>${item.libro.titulo}</td>
        <td>
          <input type="number" min="1" value="${item.cantidad}" 
                 onchange="presenter.actualizarCantidad(${index}, this.value)" />
        </td>
        <td>$${precio.toFixed(2)}</td>
        <td>$${total.toFixed(2)}</td>
        <td><button onclick="presenter.borrarItem(${index})">Eliminar</button></td>
      </tr>
    `;
  }).join("");



    // Mostrar totales
   const totalContainer = document.querySelector("#total");
   totalContainer.innerHTML = `
     <p>Subtotal: $${carrito.subtotal.toFixed(2)}</p>
      <p>IVA: $${carrito.iva.toFixed(2)}</p>
      <p>Total: $${carrito.total.toFixed(2)}</p>
    `;
  }

  // Método para eliminar un libro del carrito
  borrarItem(index) {
    const clienteActual = model.getClienteActual();
    clienteActual.borrarCarroItem(index);
    this.mostrarCarrito();  // Actualizar la vista después de eliminar
  }

  actualizarCantidad(index, nuevaCantidad) {
    const clienteActual = model.getClienteActual();
    const carrito = clienteActual.getCarro();
    const libroItem = carrito.items[index];
  
    // Si la nueva cantidad es mayor al stock disponible, mostrar una alerta
    if (nuevaCantidad > libroItem.libro.stock) {
      alert("No hay suficiente stock disponible");
      return;
    }
  
    // Actualiza la cantidad y el precio total de cada libro
    const diferenciaCantidad = nuevaCantidad - libroItem.cantidad;
    clienteActual.setCarroItemCantidad(index, nuevaCantidad); // Ajusta la cantidad en el modelo
    libroItem.total = libroItem.libro.precio * nuevaCantidad; // Recalcula el total de ese ítem
  
    // Ajusta el stock en el inventario del libro
    libroItem.libro.decStockN(diferenciaCantidad);
  
    // Calcula el subtotal, IVA y total general del carrito
    carrito.subtotal = carrito.items.reduce((acc, item) => acc + item.total, 0);
    carrito.iva = carrito.subtotal * 0.21; // Ejemplo: 21% IVA
    carrito.total = carrito.subtotal + carrito.iva;
  
    // Muestra el carrito actualizado
    this.mostrarCarrito();
  }
  

}

// Inicializar y cargar la vista del carrito
document.addEventListener("DOMContentLoaded", () => {
  const presenter = new ClienteCarroPresenter(model, "cliente-carro");
  presenter.mostrarCarrito();
  document.querySelector("#boton-comprar").addEventListener("click", () => {
    alert("Compra realizada con éxito");
    model.getClienteActual().getCarro().removeItems();
    presenter.mostrarCarrito(); // Refresca el carrito después de la compra
  });
});
