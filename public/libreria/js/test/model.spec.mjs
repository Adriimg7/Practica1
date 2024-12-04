import { assert } from "chai";
import { proxy, ROL } from "../model/proxy.mjs";  // Usamos el proxy y ROL desde el proxy
describe("Model Test suite", function () {
  let libreria;
  function crearLibro(isbn) {
    return {
      isbn: `${isbn}`,
      titulo: `TITULO_${isbn}`,
      autores: `AUTOR_A${isbn}; AUTOR_B${isbn}`,
      resumen:
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ullamcorper massa libero, eget dapibus elit efficitur id. Suspendisse id dui et dui tincidunt fermentum. Integer vel felis purus. Integer tempor orci risus, at dictum urna euismod in. Etiam vitae nisl quis ipsum fringilla mollis. Maecenas vitae mauris sagittis, commodo quam in, tempor mauris. Suspendisse convallis rhoncus pretium. Sed egestas porta dignissim. Aenean nec ex lacus. Nunc mattis ipsum sit amet fermentum aliquam. Ut blandit posuere lacinia. Vestibulum elit arcu, consectetur nec enim quis, ullamcorper imperdiet nunc. Donec vel est consectetur, tincidunt nisi non, suscipit metus._[${isbn}]`,
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
      rol: ROL.CLIENTE,
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
      rol: ROL.ADMIN,
      email: `${dni}@tsw.uclm.es`,
      password: `${dni}`,
    };
  }
  before(function () { });

  /**
   * Libreria
   */
  describe("Model.Libreria", function () {
    beforeEach("Model.Libreria.beforeEach()", function () {
      libreria = new Libreria();
    });

    it("Model.Libreria", function () {
      assert.equal(Libreria.lastId, 0, 'Valor inicial lastID no es 0');
      assert.equal(Libreria.lastNumeroFactura, 0, 'Valor inicial lastNumeroFactura no es 0');
      assert.equal(libreria.libros.length, 0, 'La coleccion libros no está vacía');
      assert.equal(libreria.usuarios.length, 0, 'La coleccion usuarios no está vacía');
      assert.equal(libreria.facturas.length, 0, 'La coleccion facturas no está vacía');
    });
    it("Model.Libreria.genId()", function () {
      let inicial = Libreria.lastId;
      let actual = Libreria.genId();
      assert.equal(actual, inicial + 1, 'Generador no incrementa lastId');
    });
    it("Model.Libreria.genNumeroFactura()", function () {
      let inicial = Libreria.lastNumeroFactura;
      let actual = Libreria.genNumeroFactura();
      assert.equal(actual, inicial + 1, 'Generador no incrementa lastNumeroFactura');
    });
  });

  /**
   * Libreria Libro
   */
  describe("Model.Libreria.Libro", function () {
    beforeEach('Model.Libreria.Libro.beforeEach()', function () {
      libreria = new Libreria();
    });

    it("Model.Libreria.Libro.agregarLibro(obj)", async function () {
      let obj = crearLibro(1);
      let result = await proxy.addLibro(obj);  // Usamos el proxy para agregar el libro
      assert.equal(result.isbn, obj.isbn, "El isbn no coincide");
      assert.equal(result.titulo, obj.titulo, "El titulo no coincide");
      assert.equal(result.resumen, obj.resumen, "El resumen no coincide");
      assert.equal(result.autores, obj.autores, "Los autores no coinciden");
      assert.equal(result.portada, obj.portada, "La portada no coincide");
      assert.equal(result.stock, obj.stock, "El stock no coincide");
      assert.equal(result.precio, obj.precio, "El precio no coincide");
      assert.exists(result._id, "El _id no existe");
      assert.isFalse(result.borrado, "Libro borrado");
    });

    it("Model.Libreria.Libro.libroPorId(_id)", async function () {
      let libro = crearLibro('978-3-16-148410-0');
      let result = await proxy.addLibro(libro);  // Usamos el proxy para agregar el libro
      let actual = await proxy.getLibroPorId(result._id);  // Usamos el proxy para obtener el libro
      assert.equal(result.isbn, actual.isbn, "El isbn no coincide");
    });

    it("Model.Libreria.Libro.libroPorIsbn(isbn)", async function () {
      let libro = crearLibro('978-3-16-148410-0');
      await proxy.addLibro(libro);  // Usamos el proxy para agregar el libro
      let actual = await proxy.getLibroPorIsbn(libro.isbn);  // Usamos el proxy para obtener el libro por ISBN
      assert.equal(libro.isbn, actual.isbn, "El isbn no coincide");
    });

    it("Model.Libreria.Libro.borrarLibro()", async function () {
      let libro = await proxy.addLibro(crearLibro(1));  // Usamos el proxy para agregar el libro
      await proxy.removeLibro(libro._id);  // Usamos el proxy para borrar el libro
      let actual = await proxy.getLibroPorId(libro._id);
      assert.isTrue(actual.borrado, "El libro no está borrado");
    });
  });

  /**
   * Usuario
   */
  describe("Model.Libreria.Usuario", function () {
    beforeEach('Model.Libreria.Usuario.beforeEach()', function () {
      libreria = new Libreria();
    });

    it("Model.Libreria.Usuario.agregarCliente(obj)", async function () {
      let cliente = crearCliente('0000001A');
      let result = await proxy.addCliente(cliente);  // Usamos el proxy para agregar el cliente
      assert.equal(cliente.dni, result.dni, "El dni no coincide");
      assert.equal(cliente.nombre, result.nombre, "El nombre no coincide");
      assert.equal(cliente.rol, ROL.CLIENTE, "El rol no es CLIENTE");
      assert.equal(cliente.email, result.email, "El email no coincide");
      assert.exists(result._id, "_id no existe");
    });

    it("Model.Libreria.Usuario.agregarAdministrador(obj)", async function () {
      let admin = crearAdministrador('0000001A');
      let result = await proxy.addAdmin(admin);  // Usamos el proxy para agregar el admin
      assert.equal(admin.dni, result.dni, "El dni no coincide");
      assert.equal(admin.nombre, result.nombre, "El nombre no coincide");
      assert.equal(admin.rol, ROL.ADMIN, "El rol no es ADMIN");
      assert.equal(admin.email, result.email, "El email no coincide");
      assert.exists(result._id, "_id no existe");
    });

    it("Model.Libreria.Usuario.listarClientes()", async function () {
      let clientes = ['0000001A', '0000001B', '0000001C', '0000001D', '0000001E']
        .map(dni => crearCliente(dni));

      // Agregamos los clientes usando el proxy
      for (let cliente of clientes) {
        await proxy.addCliente(cliente);
      }

      let actuales = await proxy.getClientes();  // Usamos el proxy para obtener los clientes
      assert.equal(actuales.length, clientes.length);
      actuales.forEach((actual, index) => {
        let esperado = clientes[index];
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.rol, actual.rol, "El rol no coincide");
      });
    });
  });
});
