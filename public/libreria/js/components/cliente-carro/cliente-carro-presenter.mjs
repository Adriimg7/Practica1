import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/proxy.mjs";
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
    console.log("Carrito cargado en mostrarCarrito:", carrito);

    if (!carrito || carrito.items.length === 0) {
      document.querySelector("#lista-libros").innerHTML = "<p>El carrito está vacío</p>";
      document.querySelector("#total").innerHTML = "";
      return;
    }

    const listaLibros = document.querySelector("#lista-libros");
    listaLibros.innerHTML = carrito.items.map((item, index) => {
      console.log("Renderizando item con ID:", item.id);
      const precio = item.precio;
      const total = precio * item.cantidad;
      return `
        <tr>
          <td>
            <input 
              type="number"
              name="cantidad" 
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
    // console.log("Actualizando cantidad para el item ID:", id, "a:", cantidad);
    // cantidad = parseInt(cantidad, 10);
    
    // if (isNaN(cantidad) || cantidad <= 0) {
    //   alert("La cantidad debe ser un número válido mayor que 0.");
    //   return;

    if (!id) {
      console.error("No se recibió un ID válido para actualizar la cantidad.");
      return;
    }
  
    console.log("Actualizando cantidad para el item ID:", id, "a:", cantidad);
  
    cantidad = parseInt(cantidad, 10);
    
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad debe ser un número válido mayor que 0.");
      return;
    }
  
    libreriaSession.actualizarCantidadEnCarrito(id, cantidad);
    console.log("Carrito después de actualizar:", libreriaSession.getCarrito());
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
