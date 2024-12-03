import { assert } from "chai";
import { proxy } from "../model/proxy.mjs";

describe("Model Test suite with Proxy", function () {
  function crearLibro(isbn) {
    return {
      isbn: `${isbn}`,
      titulo: `TITULO_${isbn}`,
      autores: `AUTOR_A${isbn}; AUTOR_B${isbn}`,
      resumen: `Resumen del libro con ISBN ${isbn}`,
      portada: `http://google.com/${isbn}`,
      stock: 5,
      precio: 50,
    };
  }

  function crearCliente(dni) {
    return {
      dni: `${dni}`,
      nombre: `Nombre ${dni}`,
      apellidos: `Apellido_1${dni} Apellido_2${dni}`,
      direccion: `Direccion ${dni}`,
      rol: "CLIENTE",
      email: `${dni}@tsw.uclm.es`,
      password: `${dni}`,
      carro: { items: [], iva: 0, total: 0, subtotal: 0 },
    };
  }

  function crearAdministrador(dni) {
    return {
      dni: `${dni}`,
      nombre: `Nombre ${dni}`,
      apellidos: `Apellido_1${dni} Apellido_2${dni}`,
      direccion: `Direccion ${dni}`,
      rol: "ADMIN",
      email: `${dni}@tsw.uclm.es`,
      password: `${dni}`,
    };
  }

  beforeEach(async function () {
    await proxy.setLibros([]);
    await proxy.setClientes([]);
  });

  describe("Proxy.Libreria.Libro", function () {
    it("Proxy.Libreria.Libro.agregarLibro(obj)", async function () {
      let obj = crearLibro(1);
      let result = await proxy.addLibro(obj);

      assert.equal(result.isbn, obj.isbn, "El isbn no coincide");
      assert.equal(result.titulo, obj.titulo, "El titulo no coincide");
      assert.equal(result.resumen, obj.resumen, "El resumen no coincide");
      assert.equal(result.autores, obj.autores, "Los autores no coinciden");
      assert.equal(result.portada, obj.portada, "La portada no coincide");
      assert.equal(result.stock, obj.stock, "El stock no coincide");
      assert.equal(result.precio, obj.precio, "El precio no coincide");
      assert.exists(result._id, "El _id no existe");

      let libros = await proxy.getLibros();
      assert.equal(libros.length, 1, "El número de libros no es correcto");
    });

    it("Proxy.Libreria.Libro.getLibroPorId(_id)", async function () {
      let obj = crearLibro(1);
      let added = await proxy.addLibro(obj);

      let libro = await proxy.getLibroPorId(added._id);
      assert.equal(libro.isbn, obj.isbn, "El isbn no coincide");
    });
  });

  describe("Proxy.Libreria.Usuario", function () {
    it("Proxy.Libreria.Usuario.agregarCliente(obj)", async function () {
      let obj = crearCliente("0000001A");
      let result = await proxy.addCliente(obj);

      assert.equal(result.dni, obj.dni, "El dni no coincide");
      assert.equal(result.nombre, obj.nombre, "El nombre no coincide");
      assert.equal(result.email, obj.email, "El email no coincide");

      let clientes = await proxy.getClientes();
      assert.equal(clientes.length, 1, "El número de clientes no es correcto");
    });

    it("Proxy.Libreria.Usuario.agregarAdministrador(obj)", async function () {
      let obj = crearAdministrador("0000001B");
      let result = await proxy.addAdmin(obj);

      assert.equal(result.dni, obj.dni, "El dni no coincide");
      assert.equal(result.nombre, obj.nombre, "El nombre no coincide");
      assert.equal(result.email, obj.email, "El email no coincide");

      let admins = await proxy.getAdmins();
      assert.equal(admins.length, 1, "El número de administradores no es correcto");
    });
  });
});
