import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { AdminCatalogoLibroPresenter } from "../admin-catalogo-libro/admin-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminHomePresenter extends Presenter {
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

  // Método refresh actualizado con proxy
  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    
    try {
      // Obtener los libros a través del proxy
      let libros = await proxy.getLibros();

      // Renderizar los libros utilizando AdminCatalogoLibroPresenter
      await Promise.all(libros.map(async (libro) => {
        return await new AdminCatalogoLibroPresenter(libro, 'admin-catalogo-libro', '#catalogo').refresh();
      }));
    } catch (error) {
      console.error("Error al obtener los libros:", error);
      this.mensajesPresenter.error('No se pudieron cargar los libros. Intenta nuevamente más tarde.');
      await this.mensajesPresenter.refresh();
    }

    this.salirLink.onclick = event => this.salirClick(event);
  }
}
