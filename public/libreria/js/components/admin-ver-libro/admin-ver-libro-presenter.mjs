import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
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

  get isbnText() {
    return document.querySelector('#isbnText');
  }

  set isbn(isbn) {
    this.isbnText.textContent = isbn;
  }

  get tituloText() {
    return document.querySelector('#tituloText');
  }

  set titulo(titulo) {
    this.tituloText.textContent = titulo;
  }

  get autoresText() {
    return document.querySelector('#autoresText');
  }

  set autores(autores) {
    this.autoresText.textContent = autores;
  }

  get resumenText() {
    return document.querySelector('#resumenText');
  }

  set resumen(resumen) {
    this.resumenText.textContent = resumen;
  }

  get precioText() {
    return document.querySelector('#precioText');
  }

  set precio(precio) {
    this.precioText.textContent = precio;
  }

  get stockText() {
    return document.querySelector('#stockText');
  }

  set stock(stock) {
    this.stockText.textContent = stock;
  }

  get borrarLink() {
    return document.querySelector('#borrarLink');
  }

  borrarClick(event) {
    event.preventDefault();
    try {
      model.removeLibro(this.id);
      this.mensajesPresenter.mensaje('Libro borrado!');
      router.navigate('/libreria/admin-home.html');
    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message);
      this.mensajesPresenter.refresh();
    }
  }

  get desborrarLink() {
    return document.querySelector('#desborrarLink');
  }

  desborrarClick(event) {
    event.preventDefault();
    try {
      model.desborrarLibro(this.id);
      this.mensajesPresenter.mensaje('Libro desborrado!');
      router.navigate('/libreria/admin-home.html');
    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message);
      this.mensajesPresenter.refresh();
    }
  }

  // Añadir el enlace de modificación y configuración de URL
  get modificarLink() {
    return document.querySelector('#modificarLink');
  }

  setModificarLink() {
    if (this.modificarLink) {
      this.modificarLink.setAttribute('href', `admin-modificar-libro.html?id=${this.id}`);
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
    await this.mensajesPresenter.refresh();
    const libro = this.getLibro();
    if (libro) {
      this.libro = libro;
      this.setModificarLink(); // Configurar el enlace de modificación con el ID correcto
    } else {
      console.error(`Libro con ID ${this.id} no encontrado`);
    }

    if (libro.borrado) {
      this.borrarLink.parentElement.classList.add('oculto');
    }
    this.borrarLink.onclick = event => this.borrarClick(event);

    if (!libro.borrado) {
      this.desborrarLink.parentElement.classList.add('oculto');
    }
    this.desborrarLink.onclick = event => this.desborrarClick(event);
  }
}

