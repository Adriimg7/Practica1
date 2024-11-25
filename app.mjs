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
        const { isbn, titulo } = req.query; // Obtener los parámetros de consulta

        if (isbn) { // Si se pasa el ISBN
            const libro = model.getLibroPorIsbn(isbn);
            if (!libro) {
                return res.status(404).json({ error: `No se encontró ningún libro con ISBN ${isbn}` });
            }
            return res.json(libro); // Devuelve el libro encontrado por ISBN
        }

        if (titulo) { // Si se pasa el título
            const libro = model.getLibroPorTitulo(titulo);
            if (!libro) {
                return res.status(404).json({ error: 'Libro no encontrado' });
            }
            return res.json(libro); // Devuelve el libro encontrado por título
        }

        const libros = model.getLibros(); // Si no se pasa ningún parámetro, devuelve todos los libros
        res.json(libros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Establecer los libros (actualizar toda la lista de libros)
app.put('/api/libros', (req, res) => {
    try {
        const libros = req.body;

        // Verificar si el cuerpo es un array
        if (!Array.isArray(libros)) {
            return res.status(400).json({ error: "Se esperaba un array de libros" });
        }

        // Asegurarnos de que cada libro tenga las propiedades necesarias
        libros.forEach(libro => {
            if (!libro.id || !libro.isbn || !libro.titulo || !libro.autor || !libro.precio) {
                return res.status(400).json({ error: "El libro debe contener id, isbn, titulo, autor y precio" });
            }
        });

        // Si todo está bien, actualizamos los libros en el modelo
        model.setLibros(libros);
        res.status(200).json(libros);  // Devuelve los libros actualizados
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/libros - Eliminar todos los libros
app.delete('/api/libros', (req, res) => {
    try {
        const librosEliminados = model.removeLibros(); // Llama a removeLibros para eliminar todos los libros
        res.status(200).json(librosEliminados); // Devuelve los libros eliminados
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

// Ruta para obtener un libro por su ID
app.get('/api/libros/:id', (req, res) => {
    try {
        const libroId = req.params.id; // ID pasado en la URL
        const libro = model.getLibroPorId(libroId); // Busca el libro por el ID

        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json(libro); // Si se encuentra el libro, lo devuelve
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

app.put('/api/libros/:id', (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del libro desde la URL
        const data = req.body; // Obtener los datos a actualizar del cuerpo de la solicitud

        if (!id) {
            return res.status(400).json({ error: 'El ID es obligatorio' }); // Validación del ID
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Los datos de actualización son obligatorios' }); // Validación de datos
        }

        const libroActualizado = model.updateLibro(Number(id), data); // Llamada al modelo

        res.json(libroActualizado); // Respuesta con el libro actualizado
    } catch (err) {
        console.error('Error al actualizar el libro:', err.message);
        if (err.message.includes('No se encontró')) {
            return res.status(404).json({ error: err.message }); // Error si el libro no existe
        }
        res.status(500).json({ error: 'Error interno del servidor' }); // Error genérico
    }
});


// ------------------- RUTAS PARA CLIENTES -------------------

// Obtener todos los clientes o buscar por email o DNI
app.get('/api/clientes', (req, res) => {
    const { email, dni } = req.query;
    console.log("Parámetros de consulta:", req.query); // Ver qué parámetros están llegando
  
    try {
        if (email) { // Si se pasa el email
            const cliente = model.getClientePorEmail(email);
            console.log("Cliente encontrado:", cliente); // Ver qué cliente se encuentra
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            return res.json(cliente); // Devuelve el cliente encontrado por email
        }

        if (dni) { // Si se pasa el DNI
            const cliente = model.getClientePorDni(dni);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            return res.json(cliente); // Devuelve el cliente encontrado por DNI
        }

        const clientes = model.getClientes(); // Si no se pasa ningún parámetro, devuelve todos los clientes
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Establecer los clientes (actualizar toda la lista de clientes)
app.put('/api/clientes', (req, res) => {
    try {
        const arrayClientes = req.body; // Obtener el array de clientes desde el cuerpo de la solicitud

        if (!arrayClientes || !Array.isArray(arrayClientes)) {
            return res.status(400).json({ error: 'El cuerpo debe contener un array de clientes' });
        }

        // Llamar al método setClientes para actualizar la lista
        const clientesActualizados = model.setClientes(arrayClientes);

        res.json(clientesActualizados); // Responder con la lista de clientes actualizada
    } catch (err) {
        console.error('Error al actualizar los clientes:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de errores
    }
});


app.delete('/api/clientes', (req, res) => {
    try {
        // Llamamos al método removeClientes para eliminar todos los clientes
        const resultado = model.removeClientes(); 

        // Devolvemos la respuesta con los clientes eliminados
        res.json(resultado); 
    } catch (err) {
        console.error('Error al eliminar los clientes:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' }); // Error en el servidor
    }
});


app.post('/api/clientes', (req, res) => {
    try {
        // Obtener el objeto del cliente desde el cuerpo de la solicitud
        const nuevoCliente = model.addCliente(req.body);
        res.status(201).json(nuevoCliente); // Devuelve el cliente recién creado con estado 201 (Creado)
    } catch (err) {
        res.status(400).json({ error: err.message }); // Si ocurre un error, se devuelve el mensaje de error
    }
});



app.get('/api/clientes/:id', (req, res) => {
    try {
        const clienteId = req.params.id; // Obtener el ID del cliente desde la URL
        const cliente = model.getClientePorId(clienteId); // Llamar al método del modelo

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' }); // Si el cliente no existe
        }

        res.json(cliente); // Si se encuentra el cliente, lo devolvemos
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejo de errores generales
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
