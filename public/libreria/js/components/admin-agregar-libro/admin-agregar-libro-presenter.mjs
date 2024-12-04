import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminAgregarLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get isbnInput() {
    return document.querySelector('#isbnInput');
  }

  get isbnInputText() {
    return this.isbnInput.value;
  }

  get tituloArea() {
    return document.querySelector('#tituloArea');
  }

  get tituloAreaText() {
    return this.tituloArea.value; // Cambié .textContent por .value
  }

  get autoresArea() {
    return document.querySelector('#autoresArea');
  }

  get autoresAreaText() {
    return this.autoresArea.value; // Cambié .textContent por .value
  }

  get resumenArea() {
    return document.querySelector('#resumenArea');
  }

  get resumenAreaText() {
    return this.resumenArea.value; // Cambié .textContent por .value
  }

  get stockInput() {
    return document.querySelector('#stockInput');
  }

  get stockInputText() {
    return this.stockInput.value;
  }

  get precioInput() {
    return document.querySelector('#precioInput');
  }

  get precioInputText() {
    return this.precioInput.value;
  }

  get agregarInput() {
    return document.querySelector('#agregarInput');
  }

  // Agregar un libro usando el proxy
  async agregarClick(event) {
    event.preventDefault();
    console.log('Prevented!', event);

    // Crear objeto con los datos del formulario
    let obj = {
      isbn: this.isbnInputText,
      titulo: this.tituloAreaText,
      autores: this.autoresAreaText,
      resumen: this.resumenAreaText,
      stock: parseInt(this.stockInputText, 10),  // Aseguramos que stock sea un número
      precio: parseFloat(this.precioInputText)  // Aseguramos que precio sea un número
    };

    try {
      // Usamos el proxy para agregar el libro
      await proxy.addLibro(obj);
      this.mensajesPresenter.mensaje('Libro agregado!');
      router.navigate('/libreria/admin-home.html');
    } catch (err) {
      console.log(err);
      this.mensajesPresenter.error('Error al agregar el libro');
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    // Asegúrate de que el método de agregar esté correctamente asignado
    this.agregarInput.onclick = (event) => this.agregarClick(event);
  }
}
