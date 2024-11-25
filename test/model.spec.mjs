/**
 * Pruebas del modelo
 * Importadas del cliente
 */
import { assert } from "chai";
import { Libreria, ROL } from "../model/model.mjs";
import { crearLibro } from "../model/seeder.mjs";
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];


describe("Libreria model test suite", function () {
  let libreria;

  before('Model.Libreria.before()', function () {
    libreria = new Libreria();
  });

  beforeEach('Model.Libreria.beforeEach()', function () {
    libreria.setLibros([]);
  });


  /**
   * Libreria Libro
   */
  describe("Model.Libreria.Libro", function () {
    it("Model.Libreria.Libro.setLibros()", function () {
      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      libros_esperados.forEach((l, i) => l._id = i + 1);
      let libros = libreria.setLibros(libros_esperados);
      assert.equal(libros.length, libros_esperados.length);
      libros_esperados.forEach(esperado => {
        let actual = libros.find(l => l.isbn == esperado.isbn);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
    });

    it("Model.Libreria.Libro.getLibros()", function () {
      let libros = libreria.getLibros();
      assert.equal(0, libros.length);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      libreria.setLibros(libros_esperados);

      libros = libreria.getLibros();
      assert.equal(libros.length, libros_esperados.length);

      libros_esperados.forEach(esperado => {
        let actual = libros.find(l => l.isbn == esperado.isbn);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.isDefined(actual._id, "El _id no esta definido");
      });
    });

    it("Model.Libreria.Libro.getLibroPorId(id)", function () {
      let libros = libreria.getLibros();
      assert.equal(libros.length, 0);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      libros = libreria.setLibros(libros_esperados);

      libros.forEach(async esperado => {
        let actual = libreria.getLibrosPorId(esperado._id);
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, acesperadotual.precio, "El precio no coincide");
        assert.equal(actual._id, esperado._id, "El _id no coincide");
      });
    });


  });

});

