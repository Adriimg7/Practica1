import express from 'express'; // Framework para gestionar HTTP
import path from 'path'; // Para manejar rutas de archivos
import url from 'url'; // Para trabajar con URLs en ES Modules
import { model } from './model/model.mjs'; // Importar el modelo
import { seed } from './model/seeder.mjs'; // Datos iniciales para pruebas

seed(); // Inicializa los datos (libros, clientes, etc.)

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url)); // Directorio base
const PORT = 3000; // Puerto para el servidor
const app = express(); // Crear instancia del servidor Express

app.use(express.json()); // Middleware para manejar JSON en requests
app.use(express.urlencoded({ extended: true })); // Middleware para formularios

// ------------------- RUTAS PARA LIBROS -------------------

// GET /api/libros - Obtener todos los libros
app.get('/api/libros', (req, res) => {
    try {
        const libros = model.getLibros(); // Llama al modelo para obtener los libros
        res.json(libros); // Devuelve la lista de libros en JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/libros/:id - Obtener un libro por ID
app.get('/api/libros/:id', (req, res) => {
    try {
        const libro = model.getLibroPorId(req.params.id); // Obtiene el libro por ID
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libro);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/libros - Crear un nuevo libro
app.post('/api/libros', (req, res) => {
    try {
        const nuevoLibro = model.addLibro(req.body); // Agrega un nuevo libro
        res.status(201).json(nuevoLibro); // Devuelve el libro creado
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/libros/:id - Actualizar un libro existente
app.put('/api/libros/:id', (req, res) => {
    try {
        const libro = model.getLibroPorId(req.params.id); // Busca el libro por ID
        if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

        Object.assign(libro, req.body); // Actualiza el libro con los datos del request
        model.updateLibro(libro); // Guarda los cambios en el modelo
        res.json(libro); // Devuelve el libro actualizado
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/libros/:id - Eliminar un libro
app.delete('/api/libros/:id', (req, res) => {
    try {
        const eliminado = model.removeLibro(req.params.id); // Elimina el libro
        res.json(eliminado); // Devuelve el libro eliminado
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// ------------------- RUTAS PARA CLIENTES -------------------

// GET /api/clientes - Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
    try {
        const clientes = model.getClientes(); // Llama al modelo para obtener clientes
        res.json(clientes); // Devuelve la lista de clientes
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/clientes - Crear un nuevo cliente
app.post('/api/clientes', (req, res) => {
    try {
        const nuevoCliente = model.addCliente(req.body); // Agrega un cliente
        res.status(201).json(nuevoCliente); // Devuelve el cliente creado
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ------------------- CONFIGURAR ARCHIVOS ESTÁTICOS -------------------

app.use('/', express.static(path.join(STATIC_DIR, 'public'))); // Archivos estáticos

// Manejo de rutas no encontradas
app.all('*', (req, res) => {
    res.status(404).send('<html><body><h1>Ruta no encontrada</h1></body></html>');
});

// ------------------- INICIAR SERVIDOR -------------------

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
