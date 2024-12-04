import { libreriaSession } from "../../commons/libreria-session.mjs";
import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { proxy } from "../../model/proxy.mjs";  // Cambié 'model' por 'proxy'
import { ClienteCatalogoLibroPresenter } from "../cliente-catalogo-libro/cliente-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class ClienteFacturasPresenter extends Presenter {
    constructor(model, view) {
        super(model, view);
        this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
    }

    // Obtener todas las facturas de un cliente desde el proxy
    async obtenerFacturas() {
        try {
            const clienteId = libreriaSession.getUsuarioId();  // Obtener el ID del usuario actual
            const facturas = await proxy.getFacturasPorCliente(clienteId);  // Obtener las facturas desde el proxy
            if (facturas && facturas.length > 0) {
                this.mensajesPresenter.mensaje('Facturas obtenidas correctamente.');
                return facturas;
            } else {
                throw new Error('No se encontraron facturas para este cliente.');
            }
        } catch (error) {
            console.error("Error al obtener las facturas:", error);
            this.mensajesPresenter.error('No se pudieron obtener las facturas. Intenta nuevamente más tarde.');
            await this.mensajesPresenter.refresh();
            return [];
        }
    }

    // Mostrar las facturas en la interfaz
    async mostrarFacturas() {
        const facturas = await this.obtenerFacturas();
        if (facturas.length > 0) {
            const catalogo = document.querySelector('#facturasCatalogo');  // Contenedor donde mostrar las facturas
            facturas.forEach(factura => {
                const facturaPresenter = new ClienteCatalogoLibroPresenter(factura, 'factura-view', catalogo);
                facturaPresenter.refresh();
            });
        }
    }

    // Refrescar la vista de facturas
    async refresh() {
        await super.refresh();
        await this.mensajesPresenter.refresh();
        await this.mostrarFacturas();  // Llamar para mostrar las facturas en la vista
    }
}
