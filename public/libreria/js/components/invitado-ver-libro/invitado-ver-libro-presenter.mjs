import { Presenter } from "../../commons/presenter.mjs";
import { proxy } from "../../model/proxy.mjs";

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

  // Para acceder al libro desde la API REST utilizando el proxy.
  async getLibro() {
    try {
      return await proxy.getLibroPorId(this.id);
    } catch (error) {
      console.error("Error al obtener el libro:", error);
      return null;
    }
  }

  get isbnParagraph() {
    return document.querySelector('#isbnParagraph');
  }

  set isbn(isbn) {
    if (this.isbnParagraph) {
      this.isbnParagraph.textContent = isbn;
    }
  }

  get tituloParagraph() {
    return document.querySelector('#tituloParagraph');
  }

  set titulo(titulo) {
    if (this.tituloParagraph) {
      this.tituloParagraph.textContent = titulo;
    }
  }

  get autoresParagraph() {
    return document.querySelector('#autoresParagraph');
  }

  set autores(autores) {
    if (this.autoresParagraph) {
      this.autoresParagraph.textContent = autores;
    }
  }

  get resumenParagraph() {
    return document.querySelector('#resumenParagraph');
  }

  set resumen(resumen) {
    if (this.resumenParagraph) {
      this.resumenParagraph.textContent = resumen;
    }
  }

  get precioParagraph() {
    return document.querySelector('#precioParagraph');
  }

  set precio(precio) {
    if (this.precioParagraph) {
      this.precioParagraph.textContent = precio;
    }
  }

  get stockParagraph() {
    return document.querySelector('#stockParagraph');
  }

  set stock(stock) {
    if (this.stockParagraph) {
      this.stockParagraph.textContent = stock;
    }
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

    // Obtener el libro desde la API REST.
    const libro = await this.getLibro();
    if (libro) {
      this.libro = libro;
    } else {
      console.error(`Libro con ID ${this.id} no encontrado.`);
    }

    // Otros eventos o configuraciones necesarios.
    // Por ejemplo, manejar eventos para botones relacionados.
  }
}
