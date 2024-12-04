import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs";
import { router } from "../../commons/router.mjs";
import {proxy} from "../../model/proxy.mjs";

export class AdminModificarLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  // Obtener parámetros de la URL para el ID del libro
  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  // Enlaces a los campos del formulario
  get isbnInput() {
    return document.querySelector('#isbnInput');
  }
  set isbn(value) {
    this.isbnInput.value = value;
  }

  get tituloInput() {
    return document.querySelector('#tituloArea');
  }
  set titulo(value) {
    this.tituloInput.value = value;
  }

  get autoresInput() {
    return document.querySelector('#autoresArea');
  }
  set autores(value) {
    this.autoresInput.value = value;
  }

  get resumenInput() {
    return document.querySelector('#resumenArea');
  }
  set resumen(value) {
    this.resumenInput.value = value;
  }

  get stockInput() {
    return document.querySelector('#stockInput');
  }
  set stock(value) {
    this.stockInput.value = value;
  }

  get precioInput() {
    return document.querySelector('#precioInput');
  }
  set precio(value) {
    this.precioInput.value = value;
  }

  // Cargar los datos del libro en los campos del formulario
  async getLibroAsync() {
    try {
      return await proxy.getLibroPorId(this.id);  // Usar el proxy para obtener el libro
    } catch (e) {
      console.error('Error al obtener el libro:', e.message);
      return null;
    }
  }

  set libro(libro) {
    if (libro) {
      this.isbn = libro.isbn;
      this.titulo = libro.titulo;
      this.autores = libro.autores;
      this.resumen = libro.resumen;
      this.stock = libro.stock;
      this.precio = libro.precio;
    }
  }

  async refresh() {
    await super.refresh();
    const libro = await this.getLibroAsync();
    if (libro) {
      this.libro = libro;
    } else {
      console.error(`Libro con ID ${this.id} no encontrado`);
    }

    // Configura el evento submit para guardar modificaciones
    document.querySelector('#modificarLibroForm').onsubmit = (event) => this.modificarClick(event);
  }

  async modificarClick(event) {
    event.preventDefault();
    const libroModificado = {
      _id: this.id,
      isbn: this.isbnInput.value,
      titulo: this.tituloInput.value,
      autores: this.autoresInput.value,
      resumen: this.resumenInput.value,
      stock: parseInt(this.stockInput.value, 10),
      precio: parseFloat(this.precioInput.value)
    };
    try {
      await proxy.updateLibro(libroModificado);
      router.navigate('/libreria/admin-ver-libro.html?id=' + this.id); // Navega de vuelta a la vista del libro modificado
    } catch (e) {
      console.error('Error al modificar el libro:', e.message);
    }
  }
}
