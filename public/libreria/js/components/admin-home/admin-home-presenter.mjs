import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { AdminCatalogoLibroPresenter } from "../admin-catalogo-libro/admin-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import {proxy} from "../../commons/proxy.mjs";

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
    // await this.mensajesPresenter.refresh();
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    try {
      // Usar el proxy para obtener los libros
      let libros = await proxy.getLibros();  // Suponiendo que `proxy.getLibros()` es una función que devuelve los libros

      // Ahora, refrescamos cada libro usando los presentadores
      const presentadores = libros.map((libro) => {
        const presenter = new AdminCatalogoLibroPresenter(libro, 'admin-catalogo-libro', '#catalogo');
        return presenter.refresh();
      });

      // Esperar que todos los presentadores se hayan refrescado
      await Promise.all(presentadores);
    } catch (error) {
      console.error('Error al obtener los libros:', error);
      this.mensajesPresenter.error('No se pudieron cargar los libros');
      await this.mensajesPresenter.refresh();
    }
    this.salirLink.onclick = event => this.salirClick(event);
  }

}