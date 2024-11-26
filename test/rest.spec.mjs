import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.mjs"; // Cambia la ruta según tu proyecto
import { crearLibro } from "../model/seeder.mjs";

const chai = chaiModule.use(chaiHttp);
const assert = chai.assert;

const URL = '/api';
const ISBNS = ['978-3-16-148410-0', '978-3-16-148410-1', '978-3-16-148410-2'];

describe("REST Librería - Rutas de Libros", function () {
  beforeEach(async function () {
    const requester = chai.request.execute(app).keepOpen();
    const response = await requester.put(`${URL}/libros`).send([]); // Limpia todos los libros
    assert.equal(response.status, 200);
    assert.isTrue(response.ok);
    requester.close();
  });

  it(`GET ${URL}/libros - Obtener todos los libros`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Obtener libros (vacío)
    let response = await requester.get(`${URL}/libros`).send();
    assert.equal(response.status, 200);
    assert.isTrue(response.ok);
    let libros = response.body;
    assert.equal(libros.length, 0);

    // Agregar libros
    const librosEsperados = ISBNS.map((isbn) => crearLibro(isbn));
    response = await requester.put(`${URL}/libros`).send(librosEsperados);
    assert.equal(response.status, 200);
    assert.isTrue(response.ok);

    // Obtener libros nuevamente
    response = await requester.get(`${URL}/libros`).send();
    assert.equal(response.status, 200);
    assert.isTrue(response.ok);
    libros = response.body;
    assert.equal(libros.length, librosEsperados.length);

    requester.close();
  });

  it(`GET ${URL}/libros/:id - Obtener un libro por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un libro
    const libro = crearLibro(ISBNS[0]);
    let response = await requester.post(`${URL}/libros`).send(libro);
    assert.equal(response.status, 201);
    const libroId = response.body._id;

    // Obtener el libro por ID
    response = await requester.get(`${URL}/libros/${libroId}`).send();
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "isbn", libro.isbn);

    requester.close();
  });

  it(`GET ${URL}/libros?isbn=isbn - Obtener un libro por ISBN`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un libro
    const libro = crearLibro(ISBNS[1]);
    await requester.post(`${URL}/libros`).send(libro);

    // Obtener el libro por ISBN
    const response = await requester.get(`${URL}/libros`).query({ isbn: libro.isbn });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "isbn", libro.isbn);

    requester.close();
  });

  it(`GET ${URL}/libros?titulo=titulo - Obtener un libro por título`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un libro
    const libro = crearLibro(ISBNS[2]);
    await requester.post(`${URL}/libros`).send(libro);

    // Obtener el libro por título
    const response = await requester.get(`${URL}/libros`).query({ titulo: libro.titulo });
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "titulo", libro.titulo);

    requester.close();
  });

  it(`POST ${URL}/libros - Agregar un nuevo libro`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un nuevo libro
    const libro = crearLibro('978-3-16-148410-3');
    const response = await requester.post(`${URL}/libros`).send(libro);
    assert.equal(response.status, 201);
    assert.propertyVal(response.body, "isbn", libro.isbn);

    requester.close();
  });

  it(`PUT ${URL}/libros/:id - Actualizar un libro`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un libro
    const libro = crearLibro(ISBNS[0]);
    let response = await requester.post(`${URL}/libros`).send(libro);
    const libroId = response.body._id;

    // Actualizar el libro
    const actualizacion = { titulo: "Título Actualizado", precio: 60 };
    response = await requester.put(`${URL}/libros/${libroId}`).send(actualizacion);
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "titulo", actualizacion.titulo);

    requester.close();
  });

  it(`DELETE ${URL}/libros/:id - Eliminar un libro por ID`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Crear un libro
    const libro = crearLibro(ISBNS[1]);
    let response = await requester.post(`${URL}/libros`).send(libro);
    const libroId = response.body._id;

    // Eliminar el libro
    response = await requester.delete(`${URL}/libros/${libroId}`).send();
    assert.equal(response.status, 200);
    assert.propertyVal(response.body, "_id", libroId);

    requester.close();
  });

  it(`DELETE ${URL}/libros - Eliminar todos los libros`, async () => {
    const requester = chai.request.execute(app).keepOpen();

    // Agregar libros
    const librosEsperados = ISBNS.map((isbn) => crearLibro(isbn));
    await requester.put(`${URL}/libros`).send(librosEsperados);

    // Eliminar todos los libros
    const response = await requester.delete(`${URL}/libros`).send();
    assert.equal(response.status, 200);
    assert.equal(response.body.length, librosEsperados.length);

    requester.close();
  });
});
