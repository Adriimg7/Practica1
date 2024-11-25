import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.mjs";
const chai = chaiModule.use(chaiHttp);
const assert = chai.assert;

const URL = '/api';

// Export crear libro
import { crearLibro } from "../model/seeder.mjs";
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2', '978-3-16-148410-3', '978-3-16-148410-4'];

describe("REST libreria", function () {
  describe("libros", function () {
    it(`PUT ${URL}/libros`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/libros`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let libros = response.body;
      assert.equal(libros.length, 0);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));

      request = requester.put(`/api/libros`);
      response = await request.send(libros_esperados);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      libros = response.body;
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
        assert.isDefined(actual._id, "El _id no está definido");
      });
      requester.close();
    });

    beforeEach(async function () {
      let requester = chai.request.execute(app).keepOpen();
      let request = requester.put(`/api/libros`);
      let response = await request.send([]);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      requester.close();
    });


    it(`GET ${URL}/libros`, async () => {
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/libros`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let libros = response.body;
      assert.equal(libros.length, 0);

      let libros_esperados = ISBNS.map(isbn => crearLibro(isbn));
      request = requester.put(`/api/libros`);
      await request.send(libros_esperados);

      request = requester.get(`/api/libros`);
      response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      libros = response.body;
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
      requester.close();
    });


    it(`GET ${URL}/libros/:id`, async () => {
      // comentar seed
      let requester = chai.request.execute(app).keepOpen();

      let request = requester.get(`/api/libros`);
      let response = await request.send();
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      let libros = response.body;
      assert.equal(libros.length, 0);

      libros = ISBNS.map(isbn => crearLibro(isbn));
      request = requester.put(`/api/libros`);
      response = await request.send(libros);
      assert.equal(response.status, 200);
      assert.isTrue(response.ok);
      libros = response.body;

      let responses = libros.map(async esperado => {
        request = requester.get(`/api/libros/${esperado._id}`);
        response = await request.send();
        assert.equal(response.status, 200);
        assert.isTrue(response.ok);
        let actual = response.body;
        assert.equal(actual.isbn, esperado.isbn, "El isbn no coincide");
        assert.equal(actual.titulo, esperado.titulo, "El titulo no coincide");
        assert.equal(actual.resumen, esperado.resumen, "El resumen no coincide");
        assert.equal(actual.autores, esperado.autores, "Los autores no coinciden");
        assert.equal(actual.portada, esperado.portada, "La portada no coincide");
        assert.equal(actual.stock, esperado.stock, "El stock no coincide");
        assert.equal(actual.precio, esperado.precio, "El precio no coincide");
        assert.equal(actual._id, esperado._id, "El _id no coincide");
      });

      await Promise.all(responses);
      requester.close();
    });
  });
});