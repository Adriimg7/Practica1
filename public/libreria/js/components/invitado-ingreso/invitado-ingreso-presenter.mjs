import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { ROL } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié la importación de 'model' a 'proxy'

export class InvitadoIngresoPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get ingresoButton() { return document.querySelector('#ingresarInput'); }
  get emailInput() { return document.querySelector('#emailInput'); }
  get emailText() { return this.emailInput.value.trim(); }
  get passwordInput() { return document.querySelector('#passwordInput'); }
  get passwordText() { return this.passwordInput.value.trim(); }
  get rolSelect() { return document.querySelector('#rolSelect'); }
  get rolText() { return this.rolSelect.value; }

  get usuarioObject() {
    return { 
      email: this.emailText, 
      password: this.passwordText, 
      rol: this.rolText 
    };
  }

  // Función para validar los datos antes de enviarlos.
  validateUsuario(usuario) {
    if (!usuario.email || !usuario.password || !usuario.rol) {
      throw new Error('Todos los campos son obligatorios.');
    }
    if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      throw new Error('El correo electrónico no es válido.');
    }
    if (usuario.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    if (!['CLIENTE', 'ADMIN'].includes(usuario.rol)) {
      throw new Error('Rol no válido. Debe ser "CLIENTE" o "ADMIN".');
    }
  }

  async ingresoClick(event) {
    event.preventDefault();
    try {
      const usuario = this.usuarioObject;
      console.log("Datos del usuario antes de enviar:", usuario); // Verifica los datos
      this.validateUsuario(usuario);  // Validar los datos ingresados

      // Llamada al proxy para autenticar al usuario
      const usuarioAutenticado = await proxy.autenticar(usuario);
      console.log("Usuario autenticado:", usuarioAutenticado); // Verifica la respuesta

      libreriaSession.ingreso(usuarioAutenticado); // Guardar la sesión

      this.mensajesPresenter.mensaje(`Bienvenido ${usuarioAutenticado.nombre} ${usuarioAutenticado.apellidos}!`);
      
      // Redirigir según el rol del usuario
      if (libreriaSession.esCliente()) {
        await router.navigate('/libreria/cliente-home.html');
      } else if (libreriaSession.esAdmin()) {
        await router.navigate('/libreria/admin-home.html');
      } else {
        throw new Error('Rol no identificado');
      }
    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message); // Mostrar el error
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.ingresoButton.onclick = (event) => this.ingresoClick(event); // Asignar el evento de clic
  }
}
