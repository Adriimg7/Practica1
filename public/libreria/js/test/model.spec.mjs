import { assert } from "chai";
import { Libreria, ROL } from "../model/model.mjs";

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
      // borrado: false,
      // _id: -1,
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
      // borrado: false,
      // _id: -1,
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
      // borrado: false,
      // _id: -1,
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
      assert.equal(libreria.libros.length, 0, 'La coleccion libros no está facía');
      assert.equal(libreria.usuarios.length, 0, 'La coleccion usuarios no está facía');
      assert.equal(libreria.facturas.length, 0, 'La coleccion facturas no está facía');
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

    it("Model.Libreria.Libro.agregarLibro(obj)", function () {
      let obj = crearLibro(1);
      let result = libreria.agregarLibro(obj);
      assert.equal(result.isbn, obj.isbn, "El isbn no coincide");
      assert.equal(result.titulo, obj.titulo, "El titulo no coincide");
      assert.equal(result.resumen, obj.resumen, "El resumen no coincide");
      assert.equal(result.autores, obj.autores, "Los autores no coinciden");
      assert.equal(result.portada, obj.portada, "La portada no coincide");
      assert.equal(result.stock, obj.stock, "El stock no coincide");
      assert.equal(result.precio, obj.precio, "El precio no coincide");
      assert.exists(result._id, "El _id no existe");
      assert.isFalse(result.borrado, "Libro borrrado");
      assert.equal(libreria.libros.length, 1);
    });

    it("Model.Libreria.Libro.libroPorId(_id)", function () {
      let isbns = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
      let libros = isbns.map(isbn => crearLibro(isbn));
      let esperados = libros.map(l => libreria.agregarLibro(l));
      esperados.forEach(esperado => {
        let actual = libreria.libroPorId(esperado._id);
        assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
        assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
        assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
        assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
        assert.equal(esperado.portada, actual.portada, "La portada no coincide");
        assert.equal(esperado.stock, actual.stock, "El stock no coincide");
        assert.equal(esperado.precio, actual.precio, "El precio no coincide");
        assert.equal(esperado._id, actual._id, "El _id no coincide");
        assert.equal(esperado.borrado, actual.borrado, "El borrrado no coincide");
      })
    });

    it("Model.Libreria.Libro.libroPorIsbn(isbn)", function () {
      let isbns = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
      let libros = isbns.map(isbn => crearLibro(isbn));
      let esperados = libros.map(l => libreria.agregarLibro(l));
      esperados.forEach(esperado => {
        let actual = libreria.libroPorIsbn(esperado.isbn);
        assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
        assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
        assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
        assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
        assert.equal(esperado.portada, actual.portada, "La portada no coincide");
        assert.equal(esperado.stock, actual.stock, "El stock no coincide");
        assert.equal(esperado.precio, actual.precio, "El precio no coincide");
        assert.equal(esperado._id, actual._id, "El _id no coincide");
        assert.equal(esperado.borrado, actual.borrado, "El borrrado no coincide");
      })
    });
    it("Model.Libreria.Libro.libroPorTitulo(titulo)", function () {
      let isbns = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];
      let libros = isbns.map(isbn => crearLibro(isbn));
      let esperados = libros.map(l => libreria.agregarLibro(l));
      esperados.forEach(esperado => {
        let actual = libreria.libroPorTitulo(`TITULO_${esperado.isbn}`);
        assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
        assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
        assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
        assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
        assert.equal(esperado.portada, actual.portada, "La portada no coincide");
        assert.equal(esperado.stock, actual.stock, "El stock no coincide");
        assert.equal(esperado.precio, actual.precio, "El precio no coincide");
        assert.equal(esperado._id, actual._id, "El _id no coincide");
        assert.equal(esperado.borrado, actual.borrado, "El borrrado no coincide");
      })
    });
    it("Model.Libreria.Libro.borrarLibro()", function () {
      let libro = libreria.agregarLibro(crearLibro(1));
      libro = libreria.borrarLibro(libro._id);
      assert.isTrue(libreria.libroPorId(libro._id).borrado);
    });


    it("Model.Libreria.Libro.modificarLibro()", function () {
      let libro = libreria.agregarLibro(crearLibro(1));
      let esperado = crearLibro(2);
      esperado._id = libro._id;
      esperado.borrado = true;
      let modificado = libreria.modificarLibro(esperado);
      assert.equal(esperado.isbn, modificado.isbn, "El isbn no coincide");
      assert.equal(esperado.titulo, modificado.titulo, "El titulo no coincide");
      assert.equal(esperado.resumen, modificado.resumen, "El resumen no coincide");
      assert.equal(esperado.autores, modificado.autores, "Los autores no coinciden");
      assert.equal(esperado.portada, modificado.portada, "La portada no coincide");
      assert.equal(esperado.stock, modificado.stock, "El stock no coincide");
      assert.equal(esperado.precio, modificado.precio, "El precio no coincide");
      assert.equal(esperado._id, modificado._id, "El _id no coincide");
      assert.equal(esperado.borrado, modificado.borrado, "El borrrado no coincide");
      assert.equal(libreria.libros.length, 1);

      let actual = libreria.libroPorId(libro._id);
      assert.equal(esperado.isbn, actual.isbn, "El isbn no coincide");
      assert.equal(esperado.titulo, actual.titulo, "El titulo no coincide");
      assert.equal(esperado.resumen, actual.resumen, "El resumen no coincide");
      assert.equal(esperado.autores, actual.autores, "Los autores no coinciden");
      assert.equal(esperado.portada, actual.portada, "La portada no coincide");
      assert.equal(esperado.stock, actual.stock, "El stock no coincide");
      assert.equal(esperado.precio, actual.precio, "El precio no coincide");
      assert.equal(esperado._id, actual._id, "El _id no coincide");
      assert.equal(esperado.borrado, actual.borrado, "El borrrado no coincide");
      assert.equal(libreria.libros.length, 1);
    });

    it("Model.Libreria.Libro.listarLibros()", function () {
      assert.equal(libreria.listarLibros().length, 0);
      let libro = libreria.agregarLibro(crearLibro(1));
      assert.equal(libreria.listarLibros().length, 1);
      libreria.borrarLibro(libro._id);
      assert.equal(libreria.listarLibros().length, 1);
    });

    it("Model.Libreria.Libro.listarLibrosNoBorrados()", function () {
      assert.equal(libreria.listarLibrosNoBorrados().length, 0);
      let libro = libreria.agregarLibro(crearLibro(1));
      assert.equal(libreria.listarLibrosNoBorrados().length, 1);
      libreria.borrarLibro(libro._id);
      assert.equal(libreria.listarLibrosNoBorrados().length, 0);
    });

  });

  /**
   * Usuario
   */
  describe("Model.Libreria.Usuario", function () {

    let isbns, libros;

    beforeEach('Model.Libreria.Usuario.beforeEach()', function () {
      libreria = new Libreria();
      isbns = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4']
      libros = isbns.map(isbn => libreria.agregarLibro(crearLibro(isbn)));
    });

    it("Model.Libreria.Usuario.agregarCliente(obj)", function () {
      let esperado = crearCliente('0000001A');
      let actual = libreria.agregarCliente(esperado);
      // esperado.carro.items = [{ cantidad: 2, libro: libros[0] }, { cantidad: 1, libro: libros[2] }];
      // libreria.agregarItemCarroCliente(esperado._id, esperado.carro.items[0]);
      // libreria.agregarItemCarroCliente(esperado._id, esperado.carro.items[1]);

      assert.equal(esperado.dni, actual.dni, "El dni no coincide");
      assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
      assert.equal(esperado.apellido, actual.apellido, "El apellido no coincide");
      assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
      assert.equal(ROL.CLIENTE, actual.rol, "El rol nos es CLIENTE");
      assert.equal(esperado.email, actual.email, "El email no coincide");
      assert.equal(esperado.carro.iva, actual.carro.iva, "El iva no coincide");
      assert.equal(esperado.carro.total, actual.carro.total, "El total no coincide");
      assert.equal(esperado.carro.subtotal, actual.carro.subtotal, "El subtotal no coincide");
      assert.equal(esperado.carro.items.length, actual.carro.items.length, "El tamaño del carro no coincide");

      // esperado.carro.items.forEach((item, i) => {
      //   assert.equal(item.cantidad, actual.carro.items[i].cantidad);
      //   assert.equal(item.libro._id, actual.carro.items[i].libro._id);
      //   assert.equal(item.libro.isbn, actual.carro.items[i].libro.isbn);
      //   assert.equal(item.libro.titulo, actual.carro.items[i].libro.titulo);
      //   assert.equal(item.libro.autores, actual.carro.items[i].libro.autores);
      //   assert.equal(item.libro.portada, actual.carro.items[i].libro.portada);
      //   assert.equal(item.libro.resumen, actual.carro.items[i].libro.resumen);
      //   assert.equal(item.libro.precio, actual.carro.items[i].libro.precio);
      //   assert.equal(item.total, actual.carro.);
      //   assert.notExists(actual.carro.items[i].libro.stock);
      // })
      assert.isTrue(actual.verificar(esperado.password), "El password no coincide");
      assert.exists(actual._id, "_id no existe");
      assert.isFalse(actual.borrado, "Libro borrrado");
      assert.equal(libreria.usuarios.length, 1);
      assert.equal(libreria.listarClientes().length, 1);
    });

    it("Model.Libreria.Usuario.agregarAdministrador(obj)", function () {
      let esperado = crearAdministrador('0000001A');
      let actual = libreria.agregarAdministrador(esperado);
      assert.equal(esperado.dni, actual.dni, "El dni no coincide");
      assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
      assert.equal(esperado.apellido, actual.apellido, "El apellido no coincide");
      assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
      assert.equal(ROL.ADMIN, actual.rol, "El rol nos es ADMIN");
      assert.equal(esperado.email, actual.email, "El email no coincide");
      assert.isTrue(actual.verificar(esperado.password), "El password no coincide");
      assert.exists(actual._id, "_id no existe");
      assert.isFalse(actual.borrado, "Libro borrrado");
      assert.equal(libreria.usuarios.length, 1);
      assert.equal(libreria.listarAdministradores().length, 1);
    });

    it("Model.Libreria.Usuario.listarClientes()", function () {
      assert.equal(libreria.listarClientes().length, 0);
      let esperados = ['0000001A', '0000001B', '0000001C', '0000001D', '0000001E']
        .map(dni => libreria.agregarCliente(crearCliente(dni)));

      esperados.forEach((esperado, index) => {
        libreria.agregarItemCarroCliente(esperado._id, { cantidad: index + 1, libro: libros[index] });
        libreria.agregarItemCarroCliente(esperado._id, { cantidad: index + 2, libro: libros[(index + 1) % libros.length] });
      })

      let actuales = libreria.listarClientes()
      assert.equal(actuales.length, esperados.length);
      actuales.forEach((actual, index) => {
        let esperado = esperados[index];
        assert.equal(esperado.dni, actual.dni, "El dni no coincide");
        assert.equal(esperado.nombre, actual.nombre, "El nombre no coincide");
        assert.equal(esperado.apellido, actual.apellido, "El apellido no coincide");
        assert.equal(esperado.direccion, actual.direccion, "La direccion no coincide");
        assert.equal(ROL.CLIENTE, actual.rol, "El rol nos es CLIENTE");
        assert.equal(esperado.email, actual.email, "El email no coincide");


        assert.equal(esperado.carro.items.length, actual.carro.items.length, "El tamaño del carro no coincide");

        let subtotal = (index + 1) * libros[index].precio + (index + 2) * libros[(index + 1) % libros.length].precio;
        let iva = subtotal * 0.21;
        let total = subtotal * 1.21;
        assert.equal(subtotal, actual.carro.subtotal, "El subtotal no coincide");
        assert.equal(iva, actual.carro.iva, "El iva no coincide");
        assert.equal(total, actual.carro.total, "El total no coincide");

        assert.deepEqual(esperado.carro, actual.carro);
        assert.equal(100, actual.total)
      })
    });


  });



});
