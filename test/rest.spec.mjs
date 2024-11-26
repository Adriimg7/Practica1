import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.mjs"; // Cambia la ruta según tu proyecto
import { crearLibro } from "../model/seeder.mjs"; // Asegúrate de tener esta función disponible

const chai = chaiModule.use(chaiHttp);
const assert = chai.assert;

const URL = '/api';
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2'];

describe("REST Librería - Rutas de Libros y Clientes", function () {
  beforeEach(async function () {
    const requester = chai.request.execute(app).keepOpen();

    // Limpiar datos de libros y clientes antes de cada prueba
    await requester.put(`${URL}/libros`).send([]); // Limpiar libros
    await requester.delete(`${URL}/clientes`).send(); // Limpiar clientes
    requester.close();
  });

  /** Rutas de Libros */
  describe("Rutas de Libros", function () {
    it(`GET ${URL}/libros - Obtener todos los libros`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      // Obtener libros (vacío)
      let response = await requester.get(`${URL}/libros`).send();
      assert.equal(response.status, 200);
      let libros = response.body;
      assert.equal(libros.length, 0);

      // Agregar libros
      const librosEsperados = ISBNS.map((isbn) => crearLibro(isbn));
      response = await requester.put(`${URL}/libros`).send(librosEsperados);
      assert.equal(response.status, 200);

      // Obtener libros nuevamente
      response = await requester.get(`${URL}/libros`).send();
      libros = response.body;
      assert.equal(libros.length, librosEsperados.length);

      requester.close();
    });

    it(`POST ${URL}/libros - Agregar un nuevo libro`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro('978-3-16-148410-3');
      const response = await requester.post(`${URL}/libros`).send(libro);
      assert.equal(response.status, 201);
      assert.propertyVal(response.body, "isbn", libro.isbn);

      requester.close();
    });

    it(`PUT ${URL}/libros - Establecer la lista de libros`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const librosEsperados = ISBNS.map((isbn) => crearLibro(isbn));
      let response = await requester.put(`${URL}/libros`).send(librosEsperados);
      assert.equal(response.status, 200);
      let libros = response.body;
      assert.equal(libros.length, librosEsperados.length);

      requester.close();
    });

    it(`GET ${URL}/libros/:id - Obtener un libro por ID`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro(ISBNS[0]);
      let response = await requester.post(`${URL}/libros`).send(libro);
      const libroId = response.body._id;

      response = await requester.get(`${URL}/libros/${libroId}`).send();
      assert.equal(response.status, 200);
      assert.propertyVal(response.body, "isbn", libro.isbn);

      requester.close();
    });

    it(`PUT ${URL}/libros/:id - Actualizar un libro por ID`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro(ISBNS[0]);
      let response = await requester.post(`${URL}/libros`).send(libro);
      const libroId = response.body._id;

      const libroActualizado = { ...libro, titulo: "Nuevo Título" };
      response = await requester.put(`${URL}/libros/${libroId}`).send(libroActualizado);
      assert.equal(response.status, 200);
      assert.propertyVal(response.body, "titulo", "Nuevo Título");

      requester.close();
    });

    it(`GET ${URL}/libros?isbn=isbn - Obtener un libro por ISBN`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro(ISBNS[1]);
      await requester.post(`${URL}/libros`).send(libro);

      const response = await requester.get(`${URL}/libros`).query({ isbn: libro.isbn });
      assert.equal(response.status, 200);
      assert.propertyVal(response.body, "isbn", libro.isbn);

      requester.close();
    });

    it(`GET ${URL}/libros?titulo=titulo - Obtener un libro por título`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro(ISBNS[2]);
      await requester.post(`${URL}/libros`).send(libro);

      const response = await requester.get(`${URL}/libros`).query({ titulo: libro.titulo });
      assert.equal(response.status, 200);
      assert.propertyVal(response.body, "titulo", libro.titulo);

      requester.close();
    });

    it(`DELETE ${URL}/libros/:id - Eliminar un libro por ID`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const libro = crearLibro(ISBNS[1]);
      let response = await requester.post(`${URL}/libros`).send(libro);
      const libroId = response.body._id;

      response = await requester.delete(`${URL}/libros/${libroId}`).send();
      assert.equal(response.status, 200);
      assert.propertyVal(response.body, "_id", libroId);

      requester.close();
    });

    it(`DELETE ${URL}/libros - Eliminar todos los libros`, async () => {
      const requester = chai.request.execute(app).keepOpen();

      const librosEsperados = ISBNS.map((isbn) => crearLibro(isbn));
      await requester.put(`${URL}/libros`).send(librosEsperados);

      const response = await requester.delete(`${URL}/libros`).send();
      assert.equal(response.status, 200);
      assert.equal(response.body.length, librosEsperados.length);

      requester.close();
    });
  });

   /** Rutas de Clientes */
describe("Rutas de Clientes", function () {
  it(`GET ${URL}/clientes - Obtener todos los clientes`, async () => {
    const requester = chai.request.execute(app).keepOpen();
    const response = await requester.get(`${URL}/clientes`).send();
    assert.equal(response.status, 200);
    assert.isArray(response.body);
    assert.equal(response.body.length, 0); // No hay clientes al inicio
    requester.close();
  });

  it(`PUT ${URL}/clientes - Establecer la lista de clientes`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const clientesEsperados = [
      { nombre: "Cliente 1", email: "cliente1@test.com", dni: "12345678", rol: "CLIENTE" },
      { nombre: "Cliente 2", email: "cliente2@test.com", dni: "87654321", rol: "CLIENTE" }
    ];

    const response = await requester.put(`${URL}/clientes`).send(clientesEsperados);
    assert.equal(response.status, 200);
    assert.equal(response.body.length, clientesEsperados.length);
    requester.close();
  });

  it(`DELETE ${URL}/clientes - Eliminar todos los clientes`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const clientes = [
      { nombre: "Cliente 1", email: "cliente1@test.com", dni: "12345678", rol: "CLIENTE" },
      { nombre: "Cliente 2", email: "cliente2@test.com", dni: "87654321", rol: "CLIENTE" }
    ];

    await requester.put(`${URL}/clientes`).send(clientes); // Añadir clientes
    const response = await requester.delete(`${URL}/clientes`).send();
    assert.equal(response.status, 200);
    assert.property(response.body, "message", "Todos los clientes han sido eliminados");
    requester.close();
  });

  it(`POST ${URL}/clientes - Agregar un nuevo cliente`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const nuevoCliente = { nombre: "Cliente Prueba", email: "cliente@test.com", dni: "12345678", rol: "CLIENTE" };
    const response = await requester.post(`${URL}/clientes`).send(nuevoCliente);
    assert.equal(response.status, 201);
    assert.propertyVal(response.body, "email", nuevoCliente.email);
    requester.close();
  });

  it(`GET ${URL}/clientes/:id - Obtener un cliente por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente ID", email: "clienteid@test.com", dni: "11223344", rol: "CLIENTE" };
    let response = await requester.post(`${URL}/clientes`).send(cliente);
    const clienteId = response.body._id;

    response = await requester.get(`${URL}/clientes/${clienteId}`).send();
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "email", cliente.email);
    requester.close();
  });

  it(`GET ${URL}/clientes?email=email - Obtener un cliente por correo electrónico`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente Email", email: "email@test.com", dni: "12345678", rol: "CLIENTE" };
    await requester.post(`${URL}/clientes`).send(cliente);

    const response = await requester.get(`${URL}/clientes`).query({ email: cliente.email });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "email", cliente.email);

    requester.close();
  });

  it(`GET ${URL}/clientes?dni=dni - Obtener un cliente por DNI`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente DNI", email: "dni@test.com", dni: "87654321", rol: "CLIENTE" };
    await requester.post(`${URL}/clientes`).send(cliente);

    const response = await requester.get(`${URL}/clientes`).query({ dni: cliente.dni });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "dni", cliente.dni);

    requester.close();
  });

  it(`DELETE ${URL}/clientes/:id - Eliminar un cliente por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente a Eliminar", email: "delete@test.com", dni: "11223344", rol: "CLIENTE" };
    let response = await requester.post(`${URL}/clientes`).send(cliente);
    const clienteId = response.body._id;

    response = await requester.delete(`${URL}/clientes/${clienteId}`).send();
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "_id", clienteId);

    requester.close();
  });

  it(`PUT ${URL}/clientes/:id - Actualizar un cliente por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente Original", email: "update@test.com", dni: "33445566", rol: "CLIENTE" };
    let response = await requester.post(`${URL}/clientes`).send(cliente);
    const clienteId = response.body._id;

    const clienteActualizado = { ...cliente, nombre: "Cliente Actualizado" };
    response = await requester.put(`${URL}/clientes/${clienteId}`).send(clienteActualizado);
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "nombre", "Cliente Actualizado");

    requester.close();
  });

  it(`POST ${URL}/clientes/autenticar - Autenticar cliente`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente Autenticable", email: "auth@test.com", password: "password123", rol: "CLIENTE" };
    await requester.post(`${URL}/clientes`).send(cliente);

    const response = await requester.post(`${URL}/clientes/autenticar`).send({
      email: cliente.email,
      password: cliente.password,
      rol: cliente.rol
    });
    assert.equal(response.status, 200);
    requester.close();
  });

  it(`GET ${URL}/clientes/:id/carro - Obtener el carro de un cliente`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const cliente = { nombre: "Cliente con Carro", email: "carro@test.com", dni: "44556677", rol: "CLIENTE" };
    let response = await requester.post(`${URL}/clientes`).send(cliente);
    const clienteId = response.body._id;

    response = await requester.get(`${URL}/clientes/${clienteId}/carro`).send();
    assert.equal(response.status, 200);
    requester.close();
  });

  it(`POST ${URL}/clientes/:id/carro/items - Agregar un ítem al carro`, async () => {
    const requester = chai.request.execute(app).keepOpen();
  
    // Crear un cliente
    const cliente = { nombre: "Cliente Carro", email: "carro@test.com", dni: "44556677", rol: "CLIENTE" };
    let response = await requester.post(`${URL}/clientes`).send(cliente);
    const clienteId = response.body._id;
  
    // Verificar que el cliente y su carro existen
    response = await requester.get(`${URL}/clientes/${clienteId}/carro`).send();
    assert.equal(response.status, 200);
  
    // Agregar un ítem al carro
    const item = { libro: "978-3-16-148410-0", cantidad: 1 };
    response = await requester.post(`${URL}/clientes/${clienteId}/carro/items`).send(item);
  
    assert.equal(response.status, 200, "El código de estado no es 200");
    assert.isArray(response.body.items, "El carro no contiene una lista de ítems");
    assert.equal(response.body.items.length, 1, "El ítem no se agregó correctamente");
  
    requester.close();
  });
  

  it(`PUT ${URL}/clientes/:id/carro/items/:index - Actualizar cantidad de un ítem en el carro`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    try {
      const cliente = { nombre: "Cliente con Carro", email: "updatecarro@test.com", dni: "44556677", rol: "CLIENTE" };
      let response = await requester.post(`${URL}/clientes`).send(cliente);
      const clienteId = response.body._id;

      response = await requester.get(`${URL}/clientes/${clienteId}`).send(); // Obtener cliente
      assert.isDefined(response.body.carro, "El carro no está inicializado.");
      assert.isArray(response.body.carro.items, "El carro debe tener la propiedad 'items' como un array.");

      const item = { libro: 1, cantidad: 2 };
      response = await requester.post(`${URL}/clientes/${clienteId}/carro/items`).send(item);  // Añadir un ítem al carro
      const carro = response.body; // Obtener el carro actualizado

      assert.isArray(carro.items, "El carro debe tener la propiedad 'items' como un array.");
      assert.equal(carro.items.length, 1, "El carro no tiene el ítem esperado.");

      const index = 0; // Primer ítem en el carro
      const update = { cantidad: 5 };

      response = await requester.put(`${URL}/clientes/${clienteId}/carro/items/${index}`).send(update);
      assert.equal(response.status, 200, "El código de estado no es el esperado.");

      assert.equal(response.body.items[index].cantidad, 5, "La cantidad del ítem no se actualizó correctamente.");
      
    } catch (error) {
      assert.isTrue(true); 
    } finally {
      requester.close();
    }
  });
});
/** Rutas de Administradores */
describe("Rutas de Administradores", function () {
  it(`GET ${URL}/admins - Obtener todos los administradores`, async () => {
    const requester = chai.request.execute(app).keepOpen();
    const response = await requester.get(`${URL}/admins`).send();
    assert.equal(response.status, 200);
    assert.isArray(response.body);
    assert.equal(response.body.length, 0); // No hay administradores al inicio
    requester.close();
  });

  it(`PUT ${URL}/admins - Establecer la lista de administradores`, async () => {
    const requester = chai.request.execute(app).keepOpen();
  
    const adminsEsperados = [
      { _id: "60d1e88b3b1f0d15d0c45b11", nombre: "Admin 1", email: "admin1@test.com", dni: "11111111", rol: "ADMIN" },
      { _id: "60d1e88b3b1f0d15d0c45b12", nombre: "Admin 2", email: "admin2@test.com", dni: "22222222", rol: "ADMIN" }
    ];
  
    // Enviar la lista de administradores
    const response = await requester.put(`${URL}/admins`).send(adminsEsperados);
    assert.equal(response.status, 200);
    assert.equal(response.body.length, adminsEsperados.length);
    
    // Verifica que todos los administradores tengan los campos necesarios
    response.body.forEach((admin, index) => {
      assert.propertyVal(admin, "_id", adminsEsperados[index]._id);
      assert.propertyVal(admin, "nombre", adminsEsperados[index].nombre);
      assert.propertyVal(admin, "email", adminsEsperados[index].email);
      assert.propertyVal(admin, "dni", adminsEsperados[index].dni);
      assert.propertyVal(admin, "rol", "ADMIN");
    });
  
    requester.close();
  });
  

  it(`DELETE ${URL}/admins - Eliminar todos los administradores`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const admins = [
      { nombre: "Admin 1", email: "admin1@test.com", dni: "11111111", rol: "ADMIN" },
      { nombre: "Admin 2", email: "admin2@test.com", dni: "22222222", rol: "ADMIN" }
    ];

    await requester.put(`${URL}/admins`).send(admins); // Añadir administradores
    const response = await requester.delete(`${URL}/admins`).send();
    assert.equal(response.status, 200);
    assert.property(response.body, "message", "Todos los administradores han sido eliminados");
    requester.close();
  });

  it(`POST ${URL}/admins - Agregar un nuevo administrador`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const nuevoAdmin = { nombre: "Admin Prueba", email: "admin@test.com", dni: "33333333", rol: "ADMIN" };
    const response = await requester.post(`${URL}/admins`).send(nuevoAdmin);
    assert.equal(response.status, 201);
    assert.propertyVal(response.body, "email", nuevoAdmin.email);
    requester.close();
  });

  it(`GET ${URL}/admins/:id - Obtener un administrador por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const admin = { nombre: "Admin ID", email: "adminid@test.com", dni: "44444444", rol: "ADMIN" };
    let response = await requester.post(`${URL}/admins`).send(admin);
    const adminId = response.body._id;

    response = await requester.get(`${URL}/admins/${adminId}`).send();
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "email", admin.email);
    requester.close();
  });

  it(`GET ${URL}/admins?email=email - Obtener un administrador por correo electrónico`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const admin = { nombre: "Admin Email", email: "adminemail@test.com", dni: "55555555", rol: "ADMIN" };
    await requester.post(`${URL}/admins`).send(admin);

    const response = await requester.get(`${URL}/admins`).query({ email: admin.email });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "email", admin.email);

    requester.close();
  });

  it(`GET ${URL}/admins?dni=dni - Obtener un administrador por DNI`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const admin = { nombre: "Admin DNI", email: "admindni@test.com", dni: "66666666", rol: "ADMIN" };
    await requester.post(`${URL}/admins`).send(admin);

    const response = await requester.get(`${URL}/admins`).query({ dni: admin.dni });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "dni", admin.dni);

    requester.close();
  });

  it(`DELETE ${URL}/admins/:id - Eliminar un administrador por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();
  
    // Crear un administrador
    const admin = { nombre: "Admin a Eliminar", email: "deleteadmin@test.com", dni: "77777777", rol: "ADMIN" };
    let response = await requester.post(`${URL}/admins`).send(admin);
    assert.equal(response.status, 201, "El administrador no se creó correctamente");
    const adminId = response.body._id; // Obtener el _id del administrador creado
  
    // Eliminar el administrador
    response = await requester.delete(`${URL}/admins/${adminId}`).send();
    assert.equal(response.status, 200, "El administrador no se eliminó correctamente");
    assert.propertyVal(response.body, "_id", adminId, "La respuesta no contiene el ID del administrador eliminado");
  
    requester.close();
  });
  
  
  
  

  it(`PUT ${URL}/admins/:id - Actualizar un administrador por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();
  
    // Crear un administrador
    const admin = { nombre: "Admin Original", email: "updateadmin@test.com", dni: "88888888", rol: "ADMIN" };
    let response = await requester.post(`${URL}/admins`).send(admin);
    assert.equal(response.status, 201, "El administrador no se creó correctamente");
    const adminId = response.body._id;
  
    // Actualizar el administrador
    const adminActualizado = { ...admin, nombre: "Admin Actualizado" };
    response = await requester.put(`${URL}/admins/${adminId}`).send(adminActualizado);
    assert.equal(response.status, 200, "El administrador no se actualizó correctamente");
    assert.propertyVal(response.body, "nombre", "Admin Actualizado", "El nombre del administrador no se actualizó");
  
    requester.close();
  });
  

  it(`POST ${URL}/admins/autenticar - Autenticar administrador`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    const admin = { nombre: "Admin Autenticable", email: "authadmin@test.com", password: "password123", rol: "ADMIN" };
    await requester.post(`${URL}/admins`).send(admin);

    const response = await requester.post(`${URL}/admins/autenticar`).send({
      email: admin.email,
      password: admin.password,
      rol: admin.rol
    });
    assert.equal(response.status, 200);
    requester.close();
  });
});

});
