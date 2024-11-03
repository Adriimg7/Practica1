import { Presenter } from "../../commons/presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { model } from "../../model/model.mjs";

export class ClienteComprarCarroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  async refresh() {
    await super.refresh();
    this.cargarDatosCliente();
    this.mostrarCarrito();
  }

  cargarDatosCliente() {
    const cliente = libreriaSession.getClienteActual();

    if (cliente) {
      document.querySelector("#dniInput").value = cliente.dni || "";
      // Dejamos que el usuario edite el campo "Razón Social", sin asignarlo desde el cliente.
      document.querySelector("#direccionInput").value = cliente.direccion || "";
      document.querySelector("#emailInput").value = cliente.email || "";
    } else {
      console.error("Cliente no encontrado en la sesión.");
    }
  }

  mostrarCarrito() {
    const carrito = libreriaSession.getCarrito();

    if (!carrito || carrito.items.length === 0) {
      document.querySelector("#lista-libros").innerHTML = "<p>El carrito está vacío</p>";
      return;
    }

    const listaLibros = document.querySelector("#lista-libros");
    listaLibros.innerHTML = carrito.items.map(item => {
      const total = item.cantidad * item.precio;
      return `
        <tr>
          <td>${item.cantidad}</td>
          <td>${item.titulo}</td>
          <td>${libreriaSession.formatearMoneda(item.precio)}</td>
          <td>${libreriaSession.formatearMoneda(total)}</td>
        </tr>
      `;
    }).join("");

    this.actualizarTotales();
  }

  actualizarTotales() {
    const carrito = libreriaSession.getCarrito();
    const subtotal = carrito.items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    document.querySelector("#subtotal").textContent = libreriaSession.formatearMoneda(subtotal);
    document.querySelector("#iva").textContent = libreriaSession.formatearMoneda(iva);
    document.querySelector("#total-final").textContent = libreriaSession.formatearMoneda(total);
  }

  realizarCompra() {
    alert("Compra realizada con éxito");
    libreriaSession.vaciarCarrito(); // Vacía el carrito después de la compra
    this.mostrarCarrito(); // Refresca el carrito para mostrar que está vacío
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.presenter = new ClienteComprarCarroPresenter(model, "cliente-comprar-carro");
  document.querySelector("#boton-pagar").addEventListener("click", () => {
    presenter.realizarCompra();
  });
});
