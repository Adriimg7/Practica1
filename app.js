document.addEventListener("DOMContentLoaded", function() {
    navigateTo('home'); // Cargar la página de inicio al abrir la web
});

function navigateTo(page) {
    const app = document.getElementById("app");

    switch(page) {
        case 'home':
            app.innerHTML = `
                <h2>Catálogo de Libros</h2>
                <div>
                    <p>Aquí se mostrará el catálogo de libros.</p>
                </div>
            `;
            break;
        case 'login':
            app.innerHTML = `
                <h2>Iniciar Sesión</h2>
                <form>
                    <label for="username">Usuario:</label>
                    <input type="text" id="username"><br><br>
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password"><br><br>
                    <button type="submit">Ingresar</button>
                </form>
            `;
            break;
        case 'register':
            app.innerHTML = `
                <h2>Registro</h2>
                <form>
                    <label for="username">Usuario:</label>
                    <input type="text" id="username"><br><br>
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password"><br><br>
                    <button type="submit">Registrarse</button>
                </form>
            `;
            break;
        default:
            app.innerHTML = `<h2>Página no encontrada</h2>`;
            break;
    }
}
