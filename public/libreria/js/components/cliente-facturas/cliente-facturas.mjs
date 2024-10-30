import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteFacturasPresenter extends Presenter {
    constructor(model, view) {
      super(model, view);
      this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
    }
    async refresh()){
      await super.refresh();
      this.cargarFacturas();
    }

    
     cargarFacturas(){
      const clienteActual=model.getClienteActual();

       if(!clienteActual){
         alert("No hay clientes autenticados");
       }

       const facturas = model.getFacturas();
       const listaCompras= document.getElementById("lista-compras");
       const totalCompras=document.getElementById("totalcompras");

       listaCompras.innerHTML = '';

       let total = 0;

       facturas.forEach(factura => {
         if (factura.cliente._id === clienteActual._id) { // Filtra las facturas por el cliente actual
             const fila = document.createElement("tr");

             // Crear celdas para la fila
             const celdaNumero = document.createElement("td");
             celdaNumero.textContent = factura.numero; // Número de la factura
             fila.appendChild(celdaNumero);

             const celdaFecha = document.createElement("td");
             celdaFecha.textContent = new Date(factura.fecha).toLocaleDateString(); // Fecha de la factura
             fila.appendChild(celdaFecha);

             const celdaTotal = document.createElement("td");
             celdaTotal.textContent = factura.total.toFixed(2) + " €"; // Total de la factura
             fila.appendChild(celdaTotal);

             const celdaVer = document.createElement("td");
             const btnVer = document.createElement("button");
             btnVer.textContent = "Ver";
             botonVer.onclick = () => {
              // Redirigir a la página de detalles de la factura
              window.location.href = 'cliente-ver-compra.html?id=${factura._id}';
          };
             fila.appendChild(celdaVer);

             // Añade la fila a la tabla
             listaCompras.appendChild(fila);

             // Acumula el total
             total += factura.total;
           
         }
     });
     document.getElementById("total-final").textContent = totalFinal.toFixed(2);

     }
 }
 document.addEventListener("DOMContentLoaded", () => {
   window.presenter = new ClienteFacturasPresenter(model, "cliente-facturas");})