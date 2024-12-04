import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteVerCompraPresenter extends Presenter {
    constructor(model, view) {
        super(model, view);
        this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
    }

    // Método para obtener los detalles de la compra usando el proxy
    async obtenerCompra(idCompra) {
        try {
            // Obtener los detalles de la compra desde el proxy
            const compra = await proxy.getCompraPorId(idCompra);
            if (compra) {
                this.mensajesPresenter.mensaje('Compra obtenida correctamente.');
                // Aquí puedes manipular los datos de la compra si es necesario.
                return compra;
            } else {
                throw new Error('No se pudo encontrar la compra.');
            }
        } catch (error) {
            console.error('Error al obtener la compra:', error);
            this.mensajesPresenter.error(error.message);
            await this.mensajesPresenter.refresh();
            return null;
        }
    }

    // Método para procesar la compra, como finalizarla o confirmar
    async procesarCompra(idCompra) {
        try {
            const compra = await this.obtenerCompra(idCompra);
            if (compra) {
                // Aquí puedes realizar acciones con la compra obtenida, como confirmar la compra
                await proxy.finalizarCompra(idCompra);  // Suponiendo que tenemos un método 'finalizarCompra' en el proxy
                this.mensajesPresenter.mensaje('Compra procesada con éxito.');
                await this.mensajesPresenter.refresh();
                // Redirigir a la página de compra confirmada o detalles
                router.navigate('/cliente/compra-confirmada.html');
            }
        } catch (error) {
            this.mensajesPresenter.error('Hubo un error al procesar la compra.');
            await this.mensajesPresenter.refresh();
        }
    }

    // Método refresh, actualiza la vista y asocia eventos
    async refresh() {
        await super.refresh();
        await this.mensajesPresenter.refresh();
        
        // Suponiendo que obtendrás el id de la compra desde la URL o algún otro lugar
        const idCompra = this.searchParams.get('idCompra'); // Parámetro de URL para obtener el id de la compra
        if (idCompra) {
            await this.obtenerCompra(idCompra);
            // Aquí puedes asociar algún evento de confirmación de compra, si es necesario
            document.querySelector('#confirmarCompraButton').onclick = () => this.procesarCompra(idCompra);
        } else {
            this.mensajesPresenter.error('No se ha proporcionado un ID de compra válido.');
            await this.mensajesPresenter.refresh();
        }
    }
}
