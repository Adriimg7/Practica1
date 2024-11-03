// ClienteVerLibroPresenter.mjs

import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClienteVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  getLibro() {
    return model.getLibroPorId(this.id);
  }

  get isbnParagraph() { return document.querySelector('#isbnParagraph'); }
  set isbn(isbn) { this.isbnParagraph.textContent = isbn; }

  get tituloParagraph() { return document.querySelector('#tituloParagraph'); }
  set titulo(titulo) { this.tituloParagraph.textContent = titulo; }

  get autoresParagraph() { return document.querySelector('#autoresParagraph'); }
  set autores(autores) { this.autoresParagraph.textContent = autores; }

  get resumenParagraph() { return document.querySelector('#resumenParagraph'); }
  set resumen(resumen) { this.resumenParagraph.textContent = resumen; }

  get precioParagraph() { return document.querySelector('#precioParagraph'); }
  set precio(precio) { this.precioParagraph.textContent = libreriaSession.formatearMoneda(precio); }

  get stockParagraph() { return document.querySelector('#stockParagraph'); }
  set stock(stock) { this.stockParagraph.textContent = stock; }

  set libro(libro) {    
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
  }

  agregarAlCarrito(event) {
    event.preventDefault();
    const libro = this.getLibro();

    if (!libro || libro.stock <= 0) {
      alert('No hay suficiente stock de este libro.');
      return;
    }

    if (libreriaSession.esInvitado()) {
      alert('Por favor, inicie sesión para agregar al carrito.');
      return;
    }
    if (!libro._id) {
      console.error("El libro no tiene un ID:", libro);
      alert('Error: el libro no tiene un ID válido.');
      return;
    }
    console.log(libro);
    console.log("ID del libro:", libro._id);
    // Crear el item con todas las propiedades necesarias para identificación única
    const item = {
      id: libro._id,
      titulo: libro.titulo,
      precio: libro.precio,
      cantidad: 1 // Añadimos uno por cada vez que se llame a agregarAlCarrito
    };
    console.log("Item a agregar al carrito:", item);

    libreriaSession.agregarAlCarrito(item); // Agregar el libro al carrito
    alert(`El libro "${libro.titulo}" ha sido agregado al carrito.`);
    console.log("Carrito después de agregar:", libreriaSession.getCarrito());
  }

  async refresh() {
    await super.refresh();
    const libro = this.getLibro();
    if (libro) this.libro = libro;
    else console.error(`Libro ${this.id} no encontrado!`);

    document.querySelector('#agregarCarritoButton').onclick = (event) => this.agregarAlCarrito(event);
  }
}
