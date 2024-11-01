import { ROL } from "../model/model.mjs";

const USUARIO_ID = 'USUARIO_ID';
const USUARIO_ROL = 'USUARIO_ROL';
const CARRITO = 'CARRITO';
const CLIENTE_ACTUAL = 'CLIENTE_ACTUAL';

class LibreriaSession {

  formatoMoneda;

  constructor() {
    this.formatoMoneda = Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits:2,
      currencySign: "accounting",
    });
  }

  ingreso(usuario) {
    this.setUsuarioId(usuario._id);
    this.setUsuarioRol(usuario.rol);
    this.setClienteActual(usuario); //Almacenar el cliente actual en la sesion
  }

  setUsuarioId(id) { sessionStorage.setItem(USUARIO_ID, id); }
  getUsuarioId() {
    if (this.esInvitado()) throw new Error('Es un invitado');
    return sessionStorage.getItem(USUARIO_ID);
  }

  setUsuarioRol(rol) { sessionStorage.setItem(USUARIO_ROL, rol); }
  getUsuarioRol() { return sessionStorage.getItem(USUARIO_ROL); }

  salir() {
    sessionStorage.removeItem(USUARIO_ID);
    sessionStorage.removeItem(USUARIO_ROL);
    sessionStorage.removeItem(CARRITO);
    sessionStorage.removeItem(CLIENTE_ACTUAL);
  }

  esInvitado() { return !this.getUsuarioRol(); }
  esCliente() { return !this.esInvitado() && this.getUsuarioRol() == ROL.CLIENTE; }
  esAdmin() { return !this.esInvitado() && this.getUsuarioRol() == ROL.ADMIN; }

  agregarAlCarrito(item) {
    const carrito = this.getCarrito();
    const itemExistente = carrito.items.find(libro => libro.id === item.id);

    if (itemExistente) {
      // Si el libro ya está en el carrito, incrementar la cantidad
      itemExistente.cantidad += item.cantidad;
    } else {
      // Si no, agregar el nuevo ítem
      carrito.items.push(item);
    }

    this.setCarrito(carrito); // Actualizar el carrito en la sesión
  };

  formatearMoneda(valor) {
    return this.formatoMoneda.format(valor);
  }

  setCarrito(carrito){
    sessionStorage.setItem(CARRITO, JSON.stringify(carrito));
  }

  getCarrito(){
    const carritoJSON = sessionStorage.getItem(CARRITO);
    return carritoJSON ? JSON.parse(carritoJSON) : {items:[]};
  }

  vaciarCarrito(){
    sessionStorage.removeItem(CARRITO);
  }

  setClienteActual(cliente){
    sessionStorage.setItem(CLIENTE_ACTUAL, JSON.stringify(cliente));
  }

  getClienteActual(){
    const clienteJSON = sessionStorage.getItem(CLIENTE_ACTUAL);
    return clienteJSON ? JSON.parse(clienteJSON): null;
  }
}

export let libreriaSession = new LibreriaSession();