import express from 'express';
import path from 'path';
import url from 'url';
import { model } from './model/model.mjs'; // Asegúrate de que model.mjs esté correctamente importado
import { seed } from './model/seeder.mjs'; // Datos de prueba

import { ROL } from './model/model.mjs';

seed(); // Inicializa los datos

const STATIC_DIR = url.fileURLToPath(new URL('.', import.meta.url)); // Ruta base de archivos estáticos
const PORT = 3000; // Puerto para el servidor
const app = express(); // Instancia del servidor
app.use('/', express.static(path.join(STATIC_DIR, 'public')));
// Middleware para parsear JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- RUTAS PARA LIBROS -------------------
app.use('/libreria*', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'public/libreria/index.html'));
  });
  
 
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

app.put('/api/libros', (req, res) => {
    try {
        const libros = req.body;
        if (!Array.isArray(libros)) {
            return res.status(400).json({ error: "Se esperaba un array de libros" });
        }
        model.setLibros(libros); // Already handles resetting the library
        res.status(200).json(libros);
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
    
  
    try {
        if (email) { // Si se pasa el email
            const cliente = model.getClientePorEmail(email);
            
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

app.put('/api/clientes', async (req, res) => {
    try {
        const clientes = req.body;
        if (!Array.isArray(clientes)) {
            return res.status(400).json({ error: "Se esperaba un array de clientes" });
        }
        await model.setClientes(clientes); // Método que guarda o reemplaza la lista completa
        res.status(200).json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

app.put('/api/clientes/:id', (req, res) => {
    try {
      const id = req.params.id; // Obtener el ID del cliente de la URL
      const data = req.body; // Obtener los datos que quieres actualizar desde el cuerpo de la solicitud
      const clienteActualizado = model.updateCliente(id, data); // Llamar al método updateCliente
      res.json(clienteActualizado); // Devolver el cliente actualizado como respuesta
    } catch (error) {
      res.status(400).json({ error: error.message }); // Si hay algún error, devolver un mensaje de error
    }
  });
  

  app.post('/api/clientes/autenticar', (req, res) => {
    try {
        const { email, password, rol } = req.body; // Obtener los datos del cliente desde el cuerpo de la solicitud

        if (!email || !password || !rol) {
            return res.status(400).json({ error: 'Correo, contraseña y rol son obligatorios' });
        }

        // Llamar al método autenticar del modelo
        const clienteAutenticado = model.autenticar({ email, password, rol });
        res.json(clienteAutenticado); // Devolver el cliente autenticado como respuesta
    } catch (error) {
        res.status(400).json({ error: error.message }); // Si ocurre algún error, devolverlo
    }
});
app.post('/api/clientes/signin', (req, res) => {
    try {
        const { email, password, rol } = req.body; // Obtener los datos del cliente desde el cuerpo de la solicitud

        if (!email || !password || !rol) {
            return res.status(400).json({ error: 'Correo, contraseña y rol son obligatorios' });
        }

        // Llamar al método autenticar del modelo
        const clienteAutenticado = model.autenticar({ email, password, rol });
        res.json(clienteAutenticado); // Devolver el cliente autenticado como respuesta
    } catch (error) {
        res.status(400).json({ error: error.message }); // Si ocurre algún error, devolverlo
    }
});
// ------------------- RUTA PARA OBTENER EL CARRO DE UN CLIENTE -------------------
app.get('/api/clientes/:id/carro', (req, res) => {
    const clienteId = req.params.id;  // Obtener el ID del cliente de la URL
    
    try {
        // Llamada a la función que obtiene el carro del cliente desde el modelo
        const carro = model.getCarroCliente(clienteId);
        
        if (!carro) {
            return res.status(404).json({ error: 'Carro no encontrado para este cliente' });
        }
        
        // Si se encuentra el carro, se devuelve en la respuesta
        res.json(carro);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejo de errores en caso de excepción
    }
});
// ------------------- RUTA PARA AGREGAR UN ITEM AL CARRO DE UN CLIENTE -------------------
app.post('/api/clientes/:id/carro/items', (req, res) => {
    const clienteId = parseInt(req.params.id); // Obtener el ID del cliente desde la URL
    const nuevoItem = req.body; // Obtener el item del cuerpo de la solicitud

    try {
        // Verificar que el item contiene el ID del libro
        if (!nuevoItem || !nuevoItem.libro) {
            return res.status(400).json({ error: 'El item debe contener un ID de libro' });
        }

        // Obtener el libro por su ID
        const libro = model.getLibroPorId(nuevoItem.libro);
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        // Llamamos al modelo para agregar el item al carro del cliente
        const itemActualizado = model.addClienteCarroItem(clienteId, nuevoItem);

        if (!itemActualizado) {
            return res.status(404).json({ error: 'No se encontró el cliente o el carro no existe' });
        }

        // Si todo está bien, devolvemos el item actualizado
        res.status(201).json(itemActualizado); // Estado 201 indica que se ha creado un recurso
    } catch (error) {
        res.status(500).json({ error: error.message }); // Error general en el servidor
    }
});

app.put('/api/clientes/:id/carro/items/:index', (req, res) => {
    const clienteId = parseInt(req.params.id); // ID del cliente desde la URL
    const itemIndex = parseInt(req.params.index); // Índice del ítem en el carro
    const { cantidad } = req.body; // Nueva cantidad desde el cuerpo de la solicitud

    try {
        // Validar que la cantidad sea un número válido y mayor que 0
        if (isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número mayor que 0' });
        }

        // Llamar al método del modelo para actualizar la cantidad del ítem
        const itemActualizado = model.setClienteCarroItemCantidad(clienteId, itemIndex, cantidad);

        

        // Devolver el ítem actualizado como respuesta
        res.json(itemActualizado);
    } catch (error) {
        console.error('Error al actualizar el ítem en el carro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// ------------------- RUTAS PARA ADMINISTRADORES -------------------

// Obtener todos los administradores o buscar por email o DNI
app.get('/api/admins', (req, res) => {
    const { email, dni } = req.query;
    

    try {
        // Si se pasa el email, buscamos el administrador por email
        if (email) {
            const admin = model.getAdministradorPorEmail(email);
            
            if (!admin) {
                return res.status(404).json({ error: 'Administrador no encontrado' });
            }
            return res.json(admin); // Devuelve el administrador encontrado por email
        }

        // Si se pasa el DNI, buscamos el administrador por DNI
        if (dni) {
            const admin = model.getAdministradorPorDni(dni);
            if (!admin) {
                return res.status(404).json({ error: 'Administrador no encontrado' });
            }
            return res.json(admin); // Devuelve el administrador encontrado por DNI
        }

        // Si no se pasa ningún parámetro, devuelve todos los administradores
        const admins = model.getAdmins(); // Función que obtiene todos los administradores
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/admins/:id', (req, res) => {
    try {
        const adminId = req.params.id; // Obtener el ID del administrador desde la URL
        const admin = model.getAdminPorId(adminId); // Llamar al método getAdminPorId

        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' }); // Si el administrador no existe
        }

        res.json(admin); // Si se encuentra el administrador, lo devolvemos
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejo de errores generales
    }
});


app.put('/api/admins/', (req, res) => {
    try {
        const arrayAdministradores = req.body; // Obtener el array de administradores desde el cuerpo de la solicitud

        if (!arrayAdministradores || !Array.isArray(arrayAdministradores)) {
            return res.status(400).json({ error: 'El cuerpo debe contener un array de administradores' });
        }

        // Llamar al método setAdministradores para actualizar la lista
        const administradoresActualizados = model.setAdministradores(arrayAdministradores);

        res.json(administradoresActualizados); // Responder con la lista de administradores actualizada
    } catch (err) {
        console.error('Error al actualizar los administradores:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de errores
    }
});
app.delete('/api/admins', (req, res) => {
    try {
        // Llamamos al método removeAdmins para eliminar todos los administradores
        const resultado = model.removeAdmins(); 

        // Devolvemos la respuesta con los administradores eliminados
        res.json(resultado); 
    } catch (err) {
        console.error('Error al eliminar los administradores:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' }); // Error en el servidor
    }
});


app.post('/api/admins', (req, res) => {
    try {
        // Obtener el objeto del administrador desde el cuerpo de la solicitud
        const nuevoAdmin = model.addAdmin(req.body);
        res.status(201).json(nuevoAdmin); // Devuelve el administrador recién creado con estado 201 (Creado)
    } catch (err) {
        res.status(400).json({ error: err.message }); // Si ocurre un error, se devuelve el mensaje de error
    }
});
app.delete('/api/admins/:id', async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la URL

  try {
    // Buscar y eliminar el administrador por ID
    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    // Devolver el ID del administrador eliminado
    res.status(200).json({ _id: admin._id });
  } catch (error) {
    // Si ocurre un error, devolver un error 500
    res.status(500).json({ error: error.message });
  }
});

  
app.put('/api/admins/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Los datos para actualizar
  
    try {
      // Buscar el administrador y actualizarlo
      const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!admin) {
        return res.status(404).json({ error: 'Administrador no encontrado' });
      }
  
      // Devolver el administrador actualizado
      res.status(200).json(admin);
    } catch (error) {
      // Si hay algún error, devolver un error 500
      res.status(500).json({ error: error.message });
    }
  });
  

app.post('/api/admins/autenticar', (req, res) => {
    try {
        const { email, password } = req.body; // Obtener email y contraseña del cuerpo de la solicitud

        // Validar que los campos necesarios están presentes
        if (!email || !password) {
            return res.status(400).json({ error: 'El correo y la contraseña son obligatorios' });
        }

        // Autenticar el administrador usando el método del modelo
        const admin = model.autenticar({ email, password, rol: ROL.ADMIN });

        // Devolver el administrador autenticado
        res.status(200).json({
            message: 'Autenticación exitosa',
            admin,
        });
    } catch (error) {
        // Manejar errores y devolver un mensaje adecuado
        res.status(401).json({ error: error.message });
    }
});
app.post('/api/admins/signin', (req, res) => {
    try {
        const { email, password } = req.body; // Obtener email y contraseña del cuerpo de la solicitud

        // Validar que los campos necesarios están presentes
        if (!email || !password) {
            return res.status(400).json({ error: 'El correo y la contraseña son obligatorios' });
        }

        // Autenticar el administrador usando el método del modelo
        const admin = model.autenticar({ email, password, rol: ROL.ADMIN });

        // Devolver el administrador autenticado
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            admin,
        });
    } catch (error) {
        // Manejar errores y devolver un mensaje adecuado
        res.status(401).json({ error: error.message });
    }
});

// ------------------- RUTAS PARA FACTURAS -------------------

// Obtener todas las facturas o buscar por número o cliente
app.get('/api/facturas', (req, res) => {
    try {
        const { numero, cliente } = req.query; // Obtener los parámetros de consulta

        if (numero) { // Si se pasa el número de factura
            const factura = model.getFacturaPorNumero(numero);
            if (!factura || factura.length === 0) {
                return res.status(404).json({ error: `No se encontró ninguna factura con número ${numero}` });
            }
            return res.json(factura); // Devuelve la(s) factura(s) encontrada(s) por número
        }

        if (cliente) { // Si se pasa el ID del cliente
            const facturas = model.getFacturasPorCliente(cliente);
            if (!facturas || facturas.length === 0) {
                return res.status(404).json({ error: `No se encontraron facturas para el cliente con ID ${cliente}` });
            }
            return res.json(facturas); // Devuelve las facturas encontradas para el cliente
        }

        const facturas = model.getFacturas(); // Si no se pasa ningún parámetro, devuelve todas las facturas
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una factura por su ID
app.get('/api/facturas/:id', (req, res) => {
    try {
        const facturaId = req.params.id; // ID pasado en la URL
        const factura = model.getFacturaPorId(facturaId); // Busca la factura por el ID

        if (!factura || factura.length === 0) {
            return res.status(404).json({ error: `No se encontró ninguna factura con ID ${facturaId}` });
        }

        res.json(factura); // Si se encuentra la factura, la devuelve
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
// Ruta para reemplazar todas las facturas
app.put('/api/facturas', (req, res) => {
    try {
        const facturas = req.body; // Obtener el array de facturas del cuerpo de la solicitud

        // Validar que el cuerpo contiene un array
        if (!Array.isArray(facturas)) {
            return res.status(400).json({ error: "Se esperaba un array de facturas" });
        }

        // Llamar al método setFacturas del modelo
        const facturasActualizadas = model.setFacturas(facturas);
        res.status(200).json(facturasActualizadas); // Responder con las facturas actualizadas
    } catch (err) {
        res.status(400).json({ error: err.message }); // Manejo de errores
    }
});

app.delete('/api/facturas', (req, res) => {
    try {
        const facturasEliminadas = model.removeFacturas(); // Llama al método del modelo
        res.status(200).json(facturasEliminadas); // Responder con las facturas eliminadas
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejo de errores
    }
});
// Ruta para crear una nueva factura
app.post('/api/facturas', (req, res) => {
    try {
        const { cliente } = req.body; // Extraer el cliente del cuerpo de la solicitud

        if (!cliente) {
            return res.status(400).json({ error: "El ID del cliente es obligatorio" });
        }

        // Llamar al método del modelo para crear una factura
        const nuevaFactura = model.facturarCompraCliente(req.body);
        res.status(201).json(nuevaFactura); // Responder con la factura creada
    } catch (err) {
        res.status(400).json({ error: err.message }); // Manejo de errores
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
// Exporta la aplicación para que pueda ser utilizada en tus pruebas
export { app };