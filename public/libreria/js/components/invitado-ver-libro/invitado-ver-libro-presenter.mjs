import { Presenter } from "../../commons/presenter.mjs";
// import { Router } from "../../commons/router.mjs";
import { model } from "../../model/proxy.mjs";

export class InvitadoVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  // para acceder al modelo, siempre con métodos, no con getters!
  getLibro() {
    return model.getLibroPorId(this.id);
  }

  get isbnParagraph() {
    console.log(document);
    return document.querySelector('#isbnParagraph');
  }

  set isbn(isbn) {
    this.isbnParagraph.textContent = isbn;
  }
  get tituloParagraph() {
    return document.querySelector('#tituloParagraph');
  }

  set titulo(titulo) {
    this.tituloParagraph.textContent = titulo;
  }
  get autoresParagraph() {
    return document.querySelector('#autoresParagraph');
  }

  set autores(autores) {
    this.autoresParagraph.textContent = autores;
  }

  get resumenParagraph() {
    return document.querySelector('#resumenParagraph');
  }

  set resumen(resumen) {
    this.resumenParagraph.textContent = resumen;
  }
  get precioParagraph() {
    return document.querySelector('#precioParagraph');
  }

  set precio(precio) {
    this.precioParagraph.textContent = precio;
  }

  get stockParagraph() {
    return document.querySelector('#stockParagraph');
  }

  set stock(stock) {
    this.stockParagraph.textContent = stock;
  }

  set libro(libro) {    
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
  }

  async refresh() {
    await super.refresh();
    console.log(this.id);
    let libro = this.getLibro();
    if (libro) this.libro = libro;
    else console.error(`Libro ${id} not found!`);


    
    // cuidado no asignar directamente el método, se pierde this!
    // document.querySelector('#agregarButton').onclick = event => this.agregarClick(event);
    // let self = this;
    // document.querySelector('#agregarButton').onclick = function (event) { self.agregarClick(event) };
  }

}