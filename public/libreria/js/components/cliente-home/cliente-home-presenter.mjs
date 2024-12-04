import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteHomePresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get catalogo() {
    return document.querySelector('catalogo');
  }

  get salirLink() {
    return document.querySelector('#salirLink');
  }

  async salirClick(event) {
    event.preventDefault();
    libreriaSession.salir();
    this.mensajesPresenter.mensaje('Ha salido con éxito');
    router.navigate('./index.html');
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    try {
      // Obtener los libros desde el proxy en lugar del modelo
      let libros = await proxy.getLibros();

      // Crear un Presenter para cada libro y actualizar el catálogo
      await Promise.all(libros.map(async (libro) => {
        const presenter = new ClienteCatalogoLibroPresenter(libro, 'cliente-catalogo-libro', '#catalogo');
        await presenter.refresh();
      }));

    } catch (error) {
      console.error('Error al obtener los libros:', error);
      this.mensajesPresenter.error('No se pudieron cargar los libros. Intenta nuevamente más tarde.');
      await this.mensajesPresenter.refresh();
    }

    this.salirLink.onclick = event => this.salirClick(event);
  }
}
