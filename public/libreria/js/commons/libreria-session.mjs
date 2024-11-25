// libreria-session.mjs

import { ROL } from "../model/model.mjs";

const USUARIO_ID = 'USUARIO_ID';
const USUARIO_ROL = 'USUARIO_ROL';
const CARRITO = 'CARRITO';
const CLIENTE_ACTUAL = 'CLIENTE_ACTUAL';

class LibreriaSession {
  formatoMoneda;

  constructor() {
    this.formatoMoneda = Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Manejo de sesión de usuario
  ingreso(usuario) {
    this.setUsuarioId(usuario._id);
    this.setUsuarioRol(usuario.rol);
    this.setClienteActual(usuario); // Almacenar el cliente actual en la sesión
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

  // Gestión del carrito
  agregarAlCarrito(item) {
    const carrito = this.getCarrito();

    if (!item.id) {
      console.error("El item no tiene ID:", item);
      return; // Salir si el item no tiene un ID válido
    }
    // Buscar el libro por ID, título y precio para asegurar que es el mismo item exacto
    const itemExistente = carrito.items.find(
      libro => libro.id === item.id && libro.titulo === item.titulo && libro.precio === item.precio
    );

    if (itemExistente) {
      // Incrementar la cantidad si el libro ya está en el carrito y coincide en todas las propiedades clave
      itemExistente.cantidad += item.cantidad;
    } else {
      // Agregar el nuevo ítem si no existe
      carrito.items.push(item);
    }

    this.setCarrito(carrito); // Guardar el carrito actualizado en sessionStorage
  }

  actualizarCantidadEnCarrito(itemId, cantidad) {
    const carrito = this.getCarrito();
    console.log("Carrito actual:", carrito);
    console.log("Buscando item con ID:", itemId);
    const item = carrito.items.find(libro => libro.id === parseInt(itemId));

    if (item) {
      item.cantidad = parseInt(cantidad);
      if (item.cantidad === 0) {
        // Eliminar el libro si la cantidad es cero
        this.eliminarDelCarrito(itemId);
      } else {
        this.setCarrito(carrito); // Actualizar el carrito en sessionStorage
      }
    } else {
      console.error("Item no encontrado en el carrito:", itemId);
    }
  }

  eliminarDelCarrito(itemId) {
    const carrito = this.getCarrito();
    carrito.items = carrito.items.filter(libro => libro.id !== itemId);
    this.setCarrito(carrito); // Guardar el carrito actualizado en sessionStorage
  }

  vaciarCarrito() {
    sessionStorage.removeItem(CARRITO);
  }

  getCarrito() {
    const carritoJSON = sessionStorage.getItem(CARRITO);
    return carritoJSON ? JSON.parse(carritoJSON) : { items: [] };
  }

  setCarrito(carrito) {
    sessionStorage.setItem(CARRITO, JSON.stringify(carrito));
  }

  formatearMoneda(valor) {
    return this.formatoMoneda.format(valor);
  }

  // Gestión del cliente actual
  setClienteActual(cliente) {
    sessionStorage.setItem(CLIENTE_ACTUAL, JSON.stringify(cliente));
  }

  getClienteActual() {
    const clienteJSON = sessionStorage.getItem(CLIENTE_ACTUAL);
    return clienteJSON ? JSON.parse(clienteJSON) : null;
  }
}

export let libreriaSession = new LibreriaSession();
