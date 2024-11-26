export const ROL = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
};

class Identificable {
  _id;
  assignId() {
    this._id = Libreria.genId();
  }
}

export class Libreria {
  libros = [];
  usuarios = [];
  facturas = [];
  static lastId = 0;

  constructor() { }

  static genId() {
    return ++this.lastId;
  }

  /**
   * Libros
   */

  getLibros() {
    return this.libros;
  }

  setLibros(array) {
    let libros = this.getLibros();
    libros.forEach((l) => { this.removeLibro(l._id) })
    array.forEach((l) => { this.addLibro(l) })
    return this.libros;
  }
  // Método para eliminar todos los libros
  removeLibros() {
    const librosEliminados = [...this.libros]; // Guardamos todos los libros eliminados
    this.libros = []; // Vaciamos la lista de libros
    return librosEliminados; // Retornamos los libros eliminados
  }
  addLibro(obj) {
    if (!obj.isbn) throw new Error('El libro no tiene ISBN');
    if (this.getLibroPorIsbn(obj.isbn)) throw new Error(`El ISBN ${obj.isbn} ya existe`)
    let libro = new Libro();
    Object.assign(libro, obj);
    libro.assignId();
    this.libros.push(libro);
    return libro;
  }

// Método para obtener un libro por su ID
getLibroPorId(id) {
  const numericId = Number(id); // Convierte el id de la URL en un número
  return this.libros.find((v) => v._id === numericId); // Comparación estricta
}


getLibroPorIsbn(isbn) {
  if (!isbn) throw new Error('El ISBN es obligatorio');
  const isbnString = String(isbn).trim(); // Asegurarse de que el ISBN sea tratado como string y sin espacios
  
  const libro = this.libros.find((libro) => libro.isbn === isbnString);
  return libro || null; // Retornar el libro encontrado o null si no existe
}






  getLibroPorTitulo(titulo) {
    titulo = titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.libros.find(
      (v) => !!v.titulo.match(new RegExp(titulo, 'i'))
    );
  }

  removeLibro(id) {
    let libro = this.getLibroPorId(id);
    if (!libro) throw new Error('Libro no encontrado');
    else this.libros = this.libros.filter(l => l._id != id);
    return libro;
  }


  updateLibro(id, data) {
    if (!id) throw new Error('El ID es obligatorio para actualizar un libro');
    const libroIndex = this.libros.findIndex((libro) => libro._id === id);

    if (libroIndex === -1) {
        throw new Error(`No se encontró ningún libro con el ID ${id}`);
    }

    // Actualizar solo los campos proporcionados
    this.libros[libroIndex] = {
        ...this.libros[libroIndex], // Mantener los campos existentes
        ...data,                   // Sobrescribir con los datos proporcionados
    };

    return this.libros[libroIndex]; // Devolver el libro actualizado
}


  /**
   * Usuario
   */

  addUsuario(obj) {
    if (obj.rol == ROL.CLIENTE)
      this.addCliente(obj);
    else if (obj.rol == ROL.ADMIN)
      this.addAdmin(obj);
    else throw new Error('Rol desconocido');
  }
  removeClientes() {
    // Vaciar el array de usuarios (clientes y administradores)
    this.usuarios = this.usuarios.filter(u => u.rol !== ROL.CLIENTE); // Elimina solo los clientes
    return { message: 'Todos los clientes han sido eliminados' }; // Mensaje de éxito
}


addCliente(obj) {
  // Verificar si ya existe un cliente con el mismo email
  let clienteExistente = this.getClientePorEmail(obj.email);
  if (clienteExistente) {
      throw new Error('Correo electrónico ya registrado');
  }

  // Crear una nueva instancia de Cliente
  let cliente = new Cliente();
  Object.assign(cliente, obj); // Asignar los datos del objeto al cliente
  cliente.assignId(); // Asignar un ID único al cliente
  this.usuarios.push(cliente); // Agregar el cliente a la lista de usuarios
  return cliente; // Devolver el cliente recién creado
}

  setClientes(array) {
    if (!Array.isArray(array)) {
        throw new Error('El parámetro debe ser un array'); // Validar que el parámetro sea un array
    }

    // Asegúrate de que todos los objetos en el array sean clientes válidos
    array.forEach(cliente => {
        if (!cliente.id || !cliente.nombre || !cliente.email) {
            throw new Error('El cliente debe tener un id, nombre y email');
        }
    });

    this.clientes = array; // Reemplaza la lista de clientes actual por la nueva
    return this.clientes; // Retorna la lista actualizada de clientes
}
getClientePorId(id) {
  // Buscar al cliente por su ID en la lista de usuarios
  const cliente = this.usuarios.find(u => u.rol === ROL.CLIENTE && u._id === id);
  return cliente || null; // Retorna el cliente encontrado o null si no existe
}
getClientePorEmail(email) {
  return this.usuarios.find(u => u.rol === ROL.CLIENTE && u.email === email);  // Use this.usuarios
}

getClientePorDni(dni) {
  return this.usuarios.find(u => u.rol === ROL.CLIENTE && u.dni === dni);  // Use this.usuarios
}
// Función para eliminar un cliente por su ID
removeCliente(id) {
  // Buscar el índice del cliente por su ID
  const index = this.usuarios.findIndex(cliente => cliente._id === parseInt(id));
  
  // Si no se encuentra el cliente, lanzar un error
  if (index === -1) {
      throw new Error("Cliente no encontrado");
  }
  
  // Eliminar el cliente de la lista de usuarios
  const clienteEliminado = this.usuarios.splice(index, 1); // Elimina el cliente
  
  // Retornar el cliente eliminado
  return clienteEliminado[0]; 
}
// Función para actualizar un cliente por su ID
updateCliente(id, data) {
  // Buscar al cliente por su ID
  const cliente = this.getClientePorId(id); // Usamos el método ya existente getClientePorId
  if (!cliente) {
    throw new Error("Cliente no encontrado"); // Si no existe el cliente, lanzamos un error
  }

  // Actualizar solo los campos proporcionados en el objeto `data`
  Object.assign(cliente, data); // Asignamos los nuevos valores a las propiedades del cliente

  // Devolver el cliente actualizado
  return cliente;
}
autenticar(obj) {
    let email = obj.email;
    let password = obj.password;
    let usuario;

    if (obj.rol === ROL.CLIENTE) usuario = this.getClientePorEmail(email);
    else if (obj.rol === ROL.ADMIN) usuario = this.getAdministradorPorEmail(email);
    else throw new Error('Rol no encontrado');

    if (!usuario) throw new Error('Usuario no encontrado');
    else if (usuario.verificar(password)) return usuario;
    else throw new Error('Error en la contraseña');
}
removeAdmin(id) {
  const index = this.usuarios.findIndex(admin => admin._id === parseInt(id));

  if (index === -1) {
      throw new Error("Administrador no encontrado");
  }

  const adminEliminado = this.usuarios.splice(index, 1);
  return adminEliminado[0];
}


  addAdmin(obj) {
    let admin = new Administrador();
    Object.assign(admin, obj)
    admin.assignId();
    this.usuarios.push(admin);
    return admin;
  }

  getClientes() {
    return this.usuarios.filter((u) => u.rol == ROL.CLIENTE);
  }

  getAdmins() {
    return this.usuarios.filter((u) => u.rol == ROL.ADMIN);
  }

  getUsuarioPorId(_id) {
    return this.usuarios.find((u) => u._id == _id);
  }

  getUsuarioPorEmail(email) {
    return this.usuarios.find((u) => u.email == email);
  }

  getUsuarioPorDni(dni) {
    return this.usuarios.find((u) => u.dni == dni);
  }

  updateUsuario(obj) {
    let usuario = this.getUsuarioPorId(obj._id);
    Object.assign(usuario, obj);
    return usuario;
  }
  setAdministradores(array) {
    if (!Array.isArray(array)) {
        throw new Error('El parámetro debe ser un array'); // Validar que el parámetro sea un array
    }

    // Asegúrate de que todos los objetos en el array sean administradores válidos
    array.forEach(admin => {
        if (!admin._id || !admin.dni || !admin.nombre || !admin.email || !admin.rol || admin.rol !== 'ADMIN') {
            throw new Error('El administrador debe tener un _id, dni, nombre, email, rol y el rol debe ser "ADMIN"');
        }
    });

    this.usuarios = array; // Reemplaza la lista de administradores actual por la nueva
    return this.usuarios; // Retorna la lista actualizada de administradores
}

removeAdmins() {
  // Filtrar el array de usuarios y eliminar aquellos con rol 'ADMIN'
  this.usuarios = this.usuarios.filter(u => u.rol !== ROL.ADMIN); 

  // Retornar un mensaje de éxito
  return { message: 'Todos los administradores han sido eliminados' };
}


  getClientePorEmail(email) {
    return this.usuarios.find(u => u.rol == ROL.CLIENTE && u.email == email);
  }

  getClientePorId(id) {
    return this.usuarios.find(u => u.rol == ROL.CLIENTE && u._id == id);
  }
// Método para buscar administrador por ID
getAdminPorId(id) {
  // Buscar el administrador por su ID
  const admin = this.usuarios.find(admin => admin._id === parseInt(id));
  return admin || null; // Si no se encuentra, devuelve null
}
  getAdministradorPorEmail(email) {
    return this.usuarios.find(u => u.rol == ROL.ADMIN && u.email == email);
  }
  getAdministradorPorId(id) {
   
    // Asegúrate de que la comparación sea correcta, usando parseInt o toString si es necesario
    const administrador = this.usuarios.find(u => u.rol === ROL.ADMIN && u._id === id);
    
    if (!administrador) {
       
    }
    
    return administrador; // Retorna el administrador encontrado o null si no existe
}

setClientes(array) {
  if (!Array.isArray(array)) {
      throw new Error('El parámetro debe ser un array');
  }
  // Validar que los clientes tengan los campos básicos.
  array.forEach(cliente => {
      if (!cliente.nombre || !cliente.email || !cliente.dni) {
          throw new Error('El cliente debe tener nombre, email y dni');
      }
  });
  // Reemplazar la lista de clientes.
  this.usuarios = array.filter(cliente => cliente.rol === ROL.CLIENTE);
  return this.usuarios;
}

addClienteCarroItem(id, item) {
  const cliente = this.getClientePorId(id);
  if (!cliente) throw new Error("Cliente no encontrado");

  // Si el cliente no tiene carro, inicializamos uno vacío
  if (!cliente.carro) cliente.carro = { items: [] };

  // Añadimos el ítem al carro
  cliente.carro.items.push(item);
  return cliente.carro;
}


setClienteCarroItemCantidad(id, index, cantidad) {
  const cliente = this.getClientePorId(id);
  if (!cliente || !cliente.carro) throw new Error("Carro no encontrado para el cliente");
  cliente.setCarroItemCantidad(index, cantidad);
  return cliente.carro.items;
}

  getAdministradorPorDni(dni) {
    return this.usuarios.find(u => u.rol == ROL.ADMIN && u.dni == dni);
  }
  autenticar(obj) {
    let email = obj.email;
    let password = obj.password;
    let usuario;

    if (obj.rol == ROL.CLIENTE) usuario = this.getClientePorEmail(email);
    else if (obj.rol == ROL.ADMIN) usuario = this.getAdministradorPorEmail(email);
    else throw new Error('Rol no encontrado');

    if (!usuario) throw new Error('Usuario no encontrado');
    else if (usuario.verificar(password)) return usuario;
    else throw new Error('Error en la contraseña');
  }
  addAdmin(obj) {
    // Verificar si ya existe un administrador con el mismo email
    let adminExistente = this.getAdministradorPorEmail(obj.email);
    if (adminExistente) {
        throw new Error('Correo electrónico ya registrado como administrador');
    }

    // Crear una nueva instancia de Administrador
    let admin = new Administrador(); // Suponiendo que Administrador es una clase que extiende Cliente
    Object.assign(admin, obj); // Asignar los datos del objeto al administrador
    admin.assignId(); // Asignar un ID único al administrador
    this.usuarios.push(admin); // Agregar el administrador a la lista de usuarios
    return admin; // Devolver el administrador recién creado
}

  addClienteCarroItem(id, item) {
    // Obtener el cliente por su ID
    const cliente = this.getClientePorId(id);
    if (!cliente) {
        return null; // Si el cliente no existe, devolvemos null
    }

    // Obtener el libro a partir del ID proporcionado en el item
    item.libro = this.getLibroPorId(item.libro);
    if (!item.libro) {
        return null; // Si no se encuentra el libro, devolvemos null
    }

    // Asegurarse de que el cliente tiene un carro
    if (!cliente.carro) {
        cliente.carro = { items: [] }; // Si no tiene carro, inicializamos uno vacío
    }

    // Agregar el nuevo item al carro del cliente
    cliente.carro.items.push(item);

    // Devolvemos el item agregado al carro (puedes devolver el carro completo si prefieres)
    return item;
}


  setClienteCarroItemCantidad(id, index, cantidad) {
    let cliente = this.getClientePorId(id);
    return cliente.setCarroItemCantidad(index, cantidad);
  }
  

  getCarroCliente(id) {
    return this.getClientePorId(id).carro;
  }

  /**
   * Factura
   */

 // Obtener todas las facturas
 getFacturas() {
  return this.facturas;
}

// Obtener una factura por su ID
getFacturaPorId(id) {
  const numericId = Number(id);
  return this.facturas.find(factura => factura._id === numericId) || null;
}

// Obtener facturas por número
getFacturaPorNumero(numero) {
  if (!numero) throw new Error("El número de factura es obligatorio");
  const numeroString = String(numero).trim(); // Asegurar que sea string
  return this.facturas.filter(factura => factura.numero === numeroString);
}

// Obtener facturas por cliente
getFacturasPorCliente(clienteId) {
  if (!clienteId) throw new Error("El ID del cliente es obligatorio");
  const numericClienteId = Number(clienteId);
  return this.facturas.filter(factura => factura.cliente && factura.cliente._id === numericClienteId);
}
setFacturas(array) {
  if (!Array.isArray(array)) {
      throw new Error("El parámetro debe ser un array de facturas");
  }

  // Validación de las propiedades mínimas de cada factura
  array.forEach(factura => {
      if (
          !factura._id ||
          !factura.numero ||
          !factura.cliente ||
          !factura.items ||
          !factura.total
      ) {
          throw new Error("Cada factura debe tener _id, numero, cliente, items y total");
      }
  });

  // Reemplaza las facturas actuales por las nuevas
  this.facturas = array;
  return this.facturas;
}
removeFacturas() {
  const facturasEliminadas = [...this.facturas]; // Crear una copia de las facturas eliminadas
  this.facturas = []; // Vaciar la lista de facturas
  return facturasEliminadas; // Retornar las facturas eliminadas
}
facturarCompraCliente(obj) {
  if (!obj || !obj.cliente) {
      throw new Error("Cliente no definido");
  }

  // Buscar al cliente por su ID
  const cliente = this.getClientePorId(obj.cliente);
  if (!cliente) {
      throw new Error("Cliente no encontrado");
  }

  // Validar que el cliente tiene ítems en su carrito
  if (!cliente.carro || cliente.carro.items.length === 0) {
      throw new Error("El carrito del cliente está vacío");
  }

  // Crear la factura
  const factura = new Factura();
  factura.assignId(); // Generar un ID único
  factura.numero = `F-${Date.now()}`; // Generar un número de factura único
  factura.fecha = new Date();
  factura.cliente = { 
      _id: cliente._id,
      dni: cliente.dni,
      nombre: cliente.nombre,
      email: cliente.email
  };
  factura.items = [...cliente.carro.items]; // Copiar los ítems del carrito a la factura
  factura.subtotal = cliente.carro.subtotal;
  factura.iva = cliente.carro.iva;
  factura.total = cliente.carro.total;

  // Vaciar el carrito del cliente después de facturar
  cliente.carro.items = [];
  cliente.carro.subtotal = 0;
  cliente.carro.iva = 0;
  cliente.carro.total = 0;

  // Agregar la factura a la lista de facturas
  this.facturas.push(factura);

  return factura; // Retornar la factura creada
}


  removeFactura(id) {
    let factura = this.getFacturaPorId(id);
    if (!factura) throw new Error('Factura no encontrada');
    this.facturas = this.facturas.filter(f => f._id != id);
    return factura;
  }
}

class Libro extends Identificable {
  isbn;
  titulo;
  autores;
  portada;
  resumen;
  stock;
  precio;
  constructor() {
    super();
  }

  incStockN(n) {
    this.stock = this.stock + n;
  }

  decStockN(n) {
    this.stock = this.stock - n;
  }

  incPrecioP(porcentaje) {
    this.precio = this.precio * (1 + porcentaje / 100);
  }

  dexPrecioP(porcentaje) {
    this.precio = this.precio * (porcentaje / 100);
  }
}

class Usuario extends Identificable {
  dni;
  nombre;
  apellidos;
  direccion;
  rol;
  email;
  password;

  verificar(password) {
    return this.password == password;
  }
}

class Cliente extends Usuario {
  carro;
  constructor() {
    super();
    this.rol = ROL.CLIENTE;
    this.carro = new Carro();
  }


  getCarro() {
    return this.carro;
  }
  addCarroItem(item) {
    this.carro.addItem(item);
  }
  setCarroItemCantidad(index, cantidad) {
    this.getCarro().setItemCantidad(index, cantidad);
  }
  borrarCarroItem(index) {
    this.carro.borrarItem(index);
  }

}

class Administrador extends Usuario {
  constructor() {
    super();
    this.rol = ROL.ADMIN;
  }
}

class Factura extends Identificable {
  numero;
  fecha;
  razonSocial;
  direccion;
  email;
  dni;
  items = [];
  subtotal;
  iva;
  total;
  cliente;

  genNumero() {
    this.numero = Libreria.genNumeroFactura();
  }

  addItem(obj) {
    let item = new Item();
    Object.assign(item, obj);
    this.items.push(item);
    this.calcular();
    return item;
  }

  removeItems() {
    this.items = [];
    this.calcular();
  }

  calcular() {
    this.subtotal = this.items.reduce((total, i) => total + i.total, 0);
    this.iva = this.total * 0.21;
    this.total = this.subtotal * this.iva;
  }
}

class Item {
  cantidad;
  libro;
  total;
  constructor() {
    this.cantidad = 0;
  }

  calcular() {
    this.total = this.cantidad * this.libro.precio;
  }
}

class Carro {
  items;
  subtotal;
  iva;
  total;
  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
  }

  addItem(obj) {
    let item = this.items.find(i => i.libro._id == obj.libro._id);
    if (!item) {
      item = new Item();
      Object.assign(item, obj);
      item.calcular();
      this.items.push(item);
    } else {
      item.cantidad = item.cantidad + obj.cantidad;
      item.calcular();
    }
    this.calcular();
  }

  setItemCantidad(index, cantidad) {
    if (cantidad < 0) throw new Error('Cantidad inferior a 0')
    if (cantidad == 0) this.items = this.items.filter((v, i) => i != index);
    else {
      let item = this.items[index];
      item.cantidad = cantidad;
      
    }
    this.calcular();
  }

  removeItems() {
    this.items = [];
    calcular();
  }
  calcular() {
    this.subtotal = this.items.reduce((total, i) => total + i.total, 0);
    this.iva = this.subtotal * 0.21;
    this.total = this.subtotal + this.iva;
  }

}
export const model = new Libreria();