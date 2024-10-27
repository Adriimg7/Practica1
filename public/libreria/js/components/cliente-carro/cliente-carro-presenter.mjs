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
    // listaLibros.innerHTML = carrito.items.map((item, index) => `
    //   <div class="carrito-item">
    //     <p><strong>${item.libro.titulo}</strong></p>
    //     <p>Precio: $${item.libro.precio.toFixed(2)}</p>
    //     <p>Cantidad: ${item.cantidad}</p>
    //     <p>Total: $${item.total.toFixed(2)}</p>
    //     <button onclick="borrarItem(${index})">Eliminar</button>
    //   </div>
    // `).join("");


    listaLibros.innerHTML = carrito.items.map((item, index) => {
      // Convertir el precio a número si es necesario o manejar un valor predeterminado si es inválido
      const precio = parseFloat(item.libro.precio) || 0; // Usa 0 si no es un número válido
      const total = parseFloat(item.total) || 0;
    
      return `
        <div class="carrito-item">
          <p><strong>${item.libro.titulo}</strong></p>
          <p>Precio: $${precio.toFixed(2)}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Total: $${total.toFixed(2)}</p>
          <button onclick="borrarItem(${index})">Eliminar</button>
        </div>
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
