import express from 'express';
import path from 'path';
import url from 'url';
import { model } from './model/model.mjs'; // Asegúrate de que model.mjs esté correctamente importado
import { seed } from './model/seeder.mjs'; // Datos de prueba

seed(); // Inicializa los datos

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url)); // Ruta base de archivos estáticos
const PORT = 3000; // Puerto para el servidor
const app = express(); // Instancia del servidor

// Middleware para parsear JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- RUTAS PARA LIBROS -------------------

// Obtener todos los libros
app.get('/api/libros', (req, res) => {
    try {
        const libros = model.getLibros();
        res.json(libros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Establecer los libros (actualizar toda la lista de libros)
app.put('/api/libros', (req, res) => {
    try {
        const libros = req.body;
        model.setLibros(libros); // Asignamos el array de libros
        res.status(200).json(libros);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar todos los libros
app.delete('/api/libros', (req, res) => {
    try {
        const librosEliminados = model.removeLibros();
        res.json(librosEliminados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo libro
app.post('/api/libros', (req, res) => {
    try {
        const nuevoLibro = model.addLibro(req.body);
        res.status(201).json(nuevoLibro);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener un libro por ID
app.get('/api/libros/:id', (req, res) => {
    try {
        const libro = model.getLibroPorId(req.params.id);
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar un libro por ISBN
app.get('/api/libros', (req, res) => {
    const { isbn } = req.query;
    try {
        const libro = model.getLibroPorIsbn(isbn);
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar un libro por título
app.get('/api/libros', (req, res) => {
    const { titulo } = req.query;
    try {
        const libro = model.getLibroPorTitulo(titulo);
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un libro por ID
app.delete('/api/libros/:id', (req, res) => {
    try {
        const eliminado = model.removeLibro(req.params.id);
        res.json(eliminado);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Actualizar un libro por ID
app.put('/api/libros/:id', (req, res) => {
    try {
        const libro = model.getLibroPorId(req.params.id);
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

        Object.assign(libro, req.body);
        model.updateLibro(libro);
        res.json(libro);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ------------------- RUTAS PARA CLIENTES -------------------

// Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    try {
        const clientes = model.getClientes();
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Establecer los clientes (actualizar toda la lista de clientes)
app.put('/api/clientes', (req, res) => {
    try {
        const clientes = req.body;
        model.setClientes(clientes); // Asignamos el array de clientes
        res.status(200).json(clientes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Eliminar todos los clientes
app.delete('/api/clientes', (req, res) => {
    try {
        const clientesEliminados = model.removeClientes();
        res.json(clientesEliminados);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo cliente
app.post('/api/clientes', (req, res) => {
    try {
        const nuevoCliente = model.addCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener un cliente por ID
app.get('/api/clientes/:id', (req, res) => {
    try {
        const cliente = model.getClientePorId(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar cliente por email
app.get('/api/clientes', (req, res) => {
    const { email } = req.query;
    try {
        const cliente = model.getClientePorEmail(email);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buscar cliente por DNI
app.get('/api/clientes', (req, res) => {
    const { dni } = req.query;
    try {
        const cliente = model.getClientePorDni(dni);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un cliente por ID
app.delete('/api/clientes/:id', (req, res) => {
    try {
        const eliminado = model.removeCliente(req.params.id);
        res.json(eliminado);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Actualizar un cliente
app.put('/api/clientes/:id', (req, res) => {
    try {
        const cliente = model.getClientePorId(req.params.id);
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

        Object.assign(cliente, req.body);
        model.updateCliente(cliente);
        res.json(cliente);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Autenticar cliente
app.post('/api/clientes/autenticar', (req, res) => {
    try {
        const usuario = model.autenticar(req.body);
        res.json(usuario);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// ------------------- RUTAS PARA ADMINISTRADORES -------------------

// Obtener todos los administradores
app.get('/api/admins', (req, res) => {
    try {
        const admins = model.getAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un nuevo administrador
app.post('/api/admins', (req, res) => {
    try {
        const nuevoAdmin = model.addAdmin(req.body);
        res.status(201).json(nuevoAdmin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Autenticar administrador
app.post('/api/admins/autenticar', (req, res) => {
    try {
        const admin = model.autenticar(req.body);
        res.json(admin);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// ------------------- RUTAS PARA FACTURAS -------------------

// Obtener todas las facturas
app.get('/api/facturas', (req, res) => {
    try {
        const facturas = model.getFacturas();
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una factura
app.post('/api/facturas', (req, res) => {
    try {
        const nuevaFactura = model.facturarCompraCliente(req.body);
        res.status(201).json(nuevaFactura);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener una factura por ID
app.get('/api/facturas/:id', (req, res) => {
    try {
        const factura = model.getFacturaPorId(req.params.id);
        if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(factura);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
