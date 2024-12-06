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

  async getLibroPorIsbn(isbn) {
    let response= await fetch(`http://localhost:3000/api/libros/isbn/${isbn}`);
    if (response.ok){
      return await response.json();
    } else {
      throw new Error (`Error ${response.status}: ${response.statusText} `);
    }
  }

  async removeLibro(id) {
    let response = await fetch(`http://localhost:3000/api/libros/${id}`, { method: 'DELETE' });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async updateLibro(obj) {
    let response = await fetch(`http://localhost:3000/api/libros/${obj.isbn}`, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
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

  async addAdmin(obj) {
    let response = await fetch('/api/admins', {
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

  async getClientes() {
    let response = await fetch('/api/clientes');
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  
  async getAdmins() {
    let response = await fetch('/api/admins');
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async getUsuarioPorId(_id) {
    let response = await fetch(`/api/usuarios/${_id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async getUsuarioPorEmail(email) {
    let response = await fetch(`/api/usuarios/email/${email}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async getUsuarioPorDni(dni) {
    let response = await fetch(`/api/usuarios/dni/${dni}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async updateCliente(obj) {
    let response = await fetch(`/api/clientes/${obj._id}`, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  
  async updateAdmin(obj) {
    let response = await fetch(`/api/admins/${obj._id}`, {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } 

  async getClientePorEmail(email) {
    let response = await fetch(`/api/clientes/email/${email}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

   // Obtener cliente por ID
   async getUsuarioPorId(id) {
    let response = await fetch(`/api/clientes/${id}`);
    if (response.ok) {
      return await response.json(); // Retorna el cliente en formato JSON
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  async getAdminPorId(id) {
    let response = await fetch(`/api/admins/${id}`);
    if (response.ok) {
      return await response.json(); // Retorna el cliente en formato JSON
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  async getAdministradorPorEmail(email) {
    let response = await fetch(`/api/admins/email/${email}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async autenticar(obj) {
    console.log("Enviando al servidor:", obj); // Verifica los datos
    let response = await fetch('/api/clientes/autenticar', {
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
  

  async addClienteCarroItem(id, item) {
    let response = await fetch(`/api/clientes/${id}/carro`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async setClienteCarroItemCantidad(id, index, cantidad) {
    let response = await fetch(`/api/clientes/${id}/carro/${index}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad }),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async getCarroCliente(id) {
    let response = await fetch(`/api/clientes/${id}/carro`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  /**
   * Factura
   */

  async getFacturas() {
    let response = await fetch('/api/facturas');
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  
  async getFacturaPorId(id) {
    let response = await fetch(`/api/facturas/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async getFacturaPorNumero(numero) {
    let response = await fetch(`/api/facturas/numero/${numero}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  

  async facturarCompraCliente(obj) {
    let response = await fetch('/api/facturas', {
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

  async removeFactura(id) {
    let response = await fetch(`/api/facturas/${id}`, { method: 'DELETE' });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }  
}

export const proxy = new LibreriaProxy();