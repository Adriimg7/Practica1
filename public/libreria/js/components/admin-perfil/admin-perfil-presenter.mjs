import { Presenter } from "../../commons/presenter.mjs";
import { model } from "../../model/model.mjs";
import { router } from "../../commons/router.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminPerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  // Obtener elementos del formulario
  get dniInput() { return document.querySelector('#dniInput'); }
  get nombreInput() { return document.querySelector('#nombreInput'); }
  get apellidosInput() { return document.querySelector('#apellidosInput'); }
  get direccionInput() { return document.querySelector('#direccionInput'); }
  get emailInput() { return document.querySelector('#emailInput'); }
  get contrasenaInput() { return document.querySelector('#contrasenaInput'); }
  get modificarButton() { return document.querySelector('#modificarInput'); }

  // Valores actuales de los inputs
  get dniText() { return this.dniInput.value; }
  get nombreText() { return this.nombreInput.value; }
  get apellidosText() { return this.apellidosInput.value; }
  get direccionText() { return this.direccionInput.value; }
  get emailText() { return this.emailInput.value; }
  get contrasenaText() { return this.contrasenaInput.value; }

  // Cargar datos del administrador desde el modelo o sessionStorage
  cargarDatosAdmin() {
    const adminId = libreriaSession.getUsuarioId();
    const admin = model.getUsuarioPorId(adminId) || JSON.parse(sessionStorage.getItem('adminDatos'));

    if (admin) {
      this.dniInput.value = admin.dni;
      this.nombreInput.value = admin.nombre;
      this.apellidosInput.value = admin.apellidos;
      this.direccionInput.value = admin.direccion;
      this.emailInput.value = admin.email;
      this.contrasenaInput.value = admin.password;
    } else {
      console.error("Administrador no encontrado en el modelo");
    }
  }

  // Crear objeto actualizado para enviar al modelo
  get datosActualizadosAdmin() {
    return {
      _id: libreriaSession.getUsuarioId(),
      dni: this.dniText,
      nombre: this.nombreText,
      apellidos: this.apellidosText,
      direccion: this.direccionText,
      email: this.emailText,
      password: this.contrasenaText,
    };
  }

  // Guardar cambios realizados en el perfil del administrador
  async guardarPerfil(event) {
    event.preventDefault();

    try {
      const datosActualizados = this.datosActualizadosAdmin;
      model.updateUsuario(datosActualizados);

      // Guardar en sessionStorage para que persista tras recargar
      sessionStorage.setItem('adminDatos', JSON.stringify(datosActualizados));

      this.mensajesPresenter.mensaje('Perfil actualizado correctamente');
      router.navigate('/libreria/admin-home.html');
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      this.mensajesPresenter.error('No se pudo actualizar el perfil');
      await this.mensajesPresenter.refresh();
    }
  }

  // Refrescar la vista
  async refresh() {
    await super.refresh();
    this.cargarDatosAdmin();
    this.modificarButton.onclick = (event) => this.guardarPerfil(event);
    await this.mensajesPresenter.refresh();
  }
}