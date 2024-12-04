import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié la importación del model a proxy

export class InvitadoRegistroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get registroButton() { return document.querySelector('#registroInput'); }
  get dniInput() { return document.querySelector('#dniInput'); }
  get dniText() { return this.dniInput.value.trim(); }
  get nombreInput() { return document.querySelector('#nombreInput'); }
  get nombreText() { return this.nombreInput.value.trim(); }
  get apellidosInput() { return document.querySelector('#apellidosInput'); }
  get apellidosText() { return this.apellidosInput.value.trim(); }
  get direccionInput() { return document.querySelector('#direccionInput'); }
  get direccionText() { return this.direccionInput.value.trim(); }
  get emailInput() { return document.querySelector('#emailInput'); }
  get emailText() { return this.emailInput.value.trim(); }
  get passwordInput() { return document.querySelector('#passwordInput'); }
  get passwordText() { return this.passwordInput.value.trim(); }
  get rolSelect() { return document.querySelector('#rolSelect'); }
  get rolText() { return this.rolSelect.value; }

  get usuarioObject() {
    return {
      dni: this.dniText,
      email: this.emailText,
      password: this.passwordText,
      rol: this.rolText,
      nombre: this.nombreText,
      apellidos: this.apellidosText,
      direccion: this.direccionText
    };
  }

  // Función para validar los datos antes de enviarlos.
  validateUsuario(usuario) {
    if (!usuario.dni || !usuario.email || !usuario.password || !usuario.rol) {
      throw new Error('Todos los campos son obligatorios.');
    }
    if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      throw new Error('El correo electrónico no es válido.');
    }
    if (usuario.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
  }

  async registroClick(event) {
    event.preventDefault();
    try {
      const usuario = this.usuarioObject;
      this.validateUsuario(usuario);  // Validar antes de enviar

      // Utilizar el proxy para agregar el usuario
      await proxy.addUsuario(usuario);

      // Mostrar mensaje de éxito
      this.mensajesPresenter.mensaje('Usuario agregado correctamente.');
      
      // Redirigir al home después de un registro exitoso
      router.navigate('./home.html');
    } catch (err) {
      console.log(err);
      this.mensajesPresenter.error(err.message);
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.registroButton.onclick = (event) => this.registroClick(event);
  }
}
