import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteFacturasPresenter extends Presenter {
    constructor(model, view) {
      super(model, view);
      this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
    }
}