import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClienteVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
  }

  // Acceso a los parámetros de búsqueda en la URL
  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  // Obtiene el id del libro desde la URL
  get id() {
    return this.searchParams.get('id');
  }

  // Obtiene el libro usando el id desde el modelo
  getLibro() {
    return model.getLibroPorId(this.id);
  }

  // Acceso a los elementos del DOM y setters para actualizar contenido
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

  // Setter para llenar el contenido de la vista con los datos del libro
  set libro(libro) {
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
  }

  // Agrega el libro al carrito después de verificar las condiciones
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

    // Crear el item con todas las propiedades necesarias para identificación única
    const item = {
      id: libro._id,
      titulo: libro.titulo,
      precio: libro.precio,
      cantidad: 1 // Añadimos uno por cada vez que se llame a agregarAlCarrito
    };

    libreriaSession.agregarAlCarrito(item); // Agregar el libro al carrito
    alert(`El libro "${libro.titulo}" ha sido agregado al carrito.`);
    console.log("Carrito después de agregar:", libreriaSession.getCarrito());

    // Redirigir a la página del carrito
    window.location.href = 'cliente-carro.html';
  }

  // Actualiza la vista con la información del libro
  async refresh() {
    await super.refresh();
    const libro = this.getLibro();
    if (libro) {
      this.libro = libro;
    } else {
      console.error(`Libro ${this.id} no encontrado!`);
    }

    // Asocia el evento de clic para agregar el libro al carrito
    document.querySelector('#agregarCarritoButton').onclick = (event) => this.agregarAlCarrito(event);
  }
}
