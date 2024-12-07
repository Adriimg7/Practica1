import { Presenter } from "../../commons/presenter.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { router } from "../../commons/router.mjs";

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

  // Cargar los datos del libro en los campos del formulario usando el proxy
  get libro() {
    return proxy.getLibroPorId(this.id);  // Usamos el proxy para obtener el libro
  }

  set libro(libro) {
    if (libro) {
        if (this.isbnInput) this.isbn = libro.isbn;
        if (this.tituloInput) this.titulo = libro.titulo;
        if (this.autoresInput) this.autores = libro.autores;
        if (this.resumenInput) this.resumen = libro.resumen;
        if (this.stockInput) this.stock = libro.stock;
        if (this.precioInput) this.precio = libro.precio;
    } else {
        console.error("No se pudo cargar el libro. Verifica el ID:", this.id);
    }
}


  // async refresh() {
  //   super.refresh();
  //   const libro = this.libro;
  //   if (libro) {
  //     this.libro = libro;
  //   } else {
  //     console.error(`Libro con ID ${this.id} no encontrado`);
  //   }

  //   // Configura el evento submit para guardar modificaciones
  //   document.querySelector('#modificarLibroForm').onsubmit = (event) => this.modificarClick(event);
  // }
  async refresh() {
    super.refresh();
    try {
        const libro = await proxy.getLibroPorId(this.id); // Asegúrate de esperar la promesa
        if (libro) {
            this.libro = libro; // Llena el formulario con los datos del libro
        } else {
            console.error(`Libro con ID ${this.id} no encontrado`);
        }
    } catch (error) {
        console.error("Error al obtener el libro:", error.message);
    }

    // Configurar el evento de envío
    const form = document.querySelector('#modificarLibroForm');
    if (form) {
        form.onsubmit = (event) => this.modificarClick(event);
    } else {
        console.error("Formulario no encontrado");
    }
}


  modificarClick(event) {
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
      // Usamos el proxy para actualizar el libro
      proxy.updateLibro(libroModificado);  // Enviar los datos del libro al servidor a través del proxy
      router.navigate('/libreria/admin-ver-libro.html?id=' + this.id); // Navega de vuelta a la vista del libro modificado
    } catch (e) {
      console.error('Error al modificar el libro:', e.message);
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const presenter = new AdminModificarLibroPresenter(model, view);
    presenter.refresh();
  }, 0); // Asegura que el DOM esté completamente cargado
});


