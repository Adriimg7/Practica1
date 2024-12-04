import { Presenter } from "../../commons/presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { InvitadoCatalogoLibroPresenter } from "../invitado-catalogo-libro/invitado-catalogo-libro-presenter.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié la importación de 'model' a 'proxy'

export class InvitadoHomePresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get catalogo() {
    return document.querySelector('catalogo');
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    try {
      // Obtener los libros desde el proxy.
      let libros = await proxy.getLibros();

      // Crear un Presenter para cada libro y actualizar el catálogo.
      await Promise.all(
        libros.map(async (libro) => {
          const presenter = new InvitadoCatalogoLibroPresenter(libro, 'invitado-catalogo-libro', '#catalogo');
          await presenter.refresh();
        })
      );
    } catch (error) {
      console.error('Error al cargar los libros:', error);
      this.mensajesPresenter.error('No se pudieron cargar los libros. Intenta nuevamente más tarde.');
      await this.mensajesPresenter.refresh();
    }
  }
}
