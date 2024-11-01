import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClienteCarroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  async refresh() {
    await super.refresh();
    this.mostrarCarrito();
  }

  mostrarCarrito() {
    const carrito = libreriaSession.getCarrito();

    if (!carrito || carrito.items.length === 0) {
      document.querySelector("#lista-libros").innerHTML = "<p>El carrito está vacío</p>";
      document.querySelector("#total").innerHTML = "";
      return;
    }

    const listaLibros = document.querySelector("#lista-libros");
    listaLibros.innerHTML = carrito.items.map((item, index) => {
      const precio = item.precio;
      const total = precio * item.cantidad;
      return `
        <tr>
          <td align="center">
            <input 
              type="number" 
              min="1" 
              value="${item.cantidad}" 
              onchange="presenter.actualizarCantidad('${item.id}', this.value)" 
            />
          </td>
          <td align="center">${item.titulo}</td>
          <td align="center">${libreriaSession.formatearMoneda(precio)}</td>
          <td align="center">${libreriaSession.formatearMoneda(total)}</td>
        </tr>
      `;
    }).join("");

    this.actualizarTotales();
  }

  actualizarCantidad(id, cantidad) {
    libreriaSession.actualizarCantidadEnCarrito(id, parseInt(cantidad));
    this.mostrarCarrito();
  }

  actualizarTotales() {
    const carrito = libreriaSession.getCarrito();
    const subtotal = carrito.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    document.querySelector("#subtotal").textContent = libreriaSession.formatearMoneda(subtotal);
    document.querySelector("#iva").textContent = libreriaSession.formatearMoneda(iva);
    document.querySelector("#total-final").textContent = libreriaSession.formatearMoneda(total);
  }

  borrarItem(id) {
    libreriaSession.eliminarDelCarrito(id);
    this.mostrarCarrito();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.presenter = new ClienteCarroPresenter(model, "cliente-carro");
});
