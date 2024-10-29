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
      const precio = parseFloat(item.libro.precio) || 0;
      const total = precio * item.cantidad;

      return `
        <tr>
          <td>${item.libro.titulo}</td>
          <td>
            <input 
              type="number" 
              min="1" 
              value="${item.cantidad}" 
              onchange="presenter.actualizarCantidad(${index}, this.value)" 
            />
          </td>
          <td>$${precio.toFixed(2)}</td>
          <td>$${total.toFixed(2)}</td>
        </tr>
      `;
    }).join("");

    // Mostrar totales
    this.actualizarTotales();
  }

  // Método para actualizar la cantidad de un libro en el carrito
  actualizarCantidad(index, nuevaCantidad) {
    const clienteActual = model.getClienteActual();
    const carrito = clienteActual.getCarro();
    const item = carrito.items[index];

    // Actualizar la cantidad y el total del item
    item.cantidad = parseInt(nuevaCantidad);
    item.total = item.libro.precio * item.cantidad;

    // Actualizar la vista del carrito y los totales
    this.mostrarCarrito();
  }

  // Método para actualizar los totales en la vista
  actualizarTotales() {
    const clienteActual = model.getClienteActual();
    const carrito = clienteActual.getCarro();

    const subtotal = carrito.items.reduce((acc, item) => acc + item.libro.precio * item.cantidad, 0);
    const iva = subtotal * 0.21;  // Suponiendo un IVA del 21%
    const total = subtotal + iva;

    // Actualizar los elementos del DOM con los valores
    document.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector("#iva").textContent = `$${iva.toFixed(2)}`;
    document.querySelector("#total-final").textContent = `$${total.toFixed(2)}`;
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
  window.presenter = new ClienteCarroPresenter(model, "cliente-carro");
  // presenter.mostrarCarrito();
  // document.querySelector("#boton-comprar").addEventListener("click", () => {
  //   alert("Compra realizada con éxito");
  //   model.getClienteActual().getCarro().removeItems();
  //   presenter.mostrarCarrito(); // Refresca el carrito después de la compra
  // });
});
