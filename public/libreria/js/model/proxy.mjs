export const ROL = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};


export class LibreriaProxy {

  constructor() { }

  /**
   * Libros
   */

  async getLibros() {
    let response = await fetch('http://localhost:3000/api/libros');
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async addLibro(obj) {
    let response = await fetch('http://localhost:3000/api/libros', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async setLibros(array) {
    let response = await fetch('http://localhost:3000/api/libros', {
      method: 'PUT',
      body: JSON.stringify(array),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async getLibroPorId(id) {
    let response = await fetch(`http://localhost:3000/api/libros/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  getLibroPorIsbn(isbn) {

  }

  async removeLibro(id) {
    let response = await fetch(`http://localhost:3000/api/libros/${id}`, { method: 'DELETE' });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  updateLibro(obj) {

  }

  /**
   * Usuario
   */

  async addUsuario(obj) {
    if (obj.rol == ROL.ADMIN) this.addAdmin(obj);
    else if (obj.rol == ROL.CLIENTE) this.addCliente(obj);
    else throw new Error('Rol no identificado');
  }

  async addCliente(obj) {
    let response = await fetch('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  addAdmin(obj) {

  }

  getClientes() {
  }

  getAdmins() {
  }

  getUsuarioPorId(_id) {
  }

  getUsuarioPorEmail(email) {
  }

  getUsuarioPorDni(dni) {
  }

  updateUsuario(obj) {

  }

  getClientePorEmail(email) {
  }

  getClientePorId(id) {
  }

  getAdministradorPorEmail(email) {
  }

  async autenticar(obj) {
    let response = await fetch('/api/autenticar', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  addClienteCarroItem(id, item) {

  }

  setClienteCarroItemCantidad(id, index, cantidad) {

  }

  getCarroCliente(id) {

  }

  /**
   * Factura
   */

  getFacturas() {

  }

  getFacturaPorId(id) {

  }

  getFacturaPorNumero(numero) {

  }

  facturarCompraCliente(obj) {

  }

  removeFactura(id) {

  }
}

export const proxy = new LibreriaProxy();