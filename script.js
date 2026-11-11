// Obtener elementos del DOM
const userForm = document.getElementById('user-form');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputClave = document.getElementById('clave');
const formMessage = document.getElementById('form-message');
const tableBody = document.getElementById('table-body');
const userCount = document.getElementById('user-count');
const searchInput = document.getElementById('search-input');

// Cargar usuarios desde localStorage o iniciar array vacío
let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];

// Renderizar la tabla y el contador al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    renderizarTabla(usuarios);
});

// Evento para agregar un nuevo usuario
userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const clave = inputClave.value.trim();

    // 1. VALIDACIONES DE DATOS
    // - No permitir nombres vacíos
    if (nombre === '') {
        mostrarMensaje('El nombre no puede estar vacío.', 'error');
        return;
    }

    // - Validar el formato del correo (debe contener '@' y un punto)
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        mostrarMensaje('Por favor, introduce un correo electrónico válido.', 'error');
        return;
    }

    // - Exigir una clave ficticia de al menos 6 caracteres
    if (clave.length < 6) {
        mostrarMensaje('La clave ficticia debe tener al menos 6 caracteres.', 'error');
        return;
    }

    // Crear objeto del usuario
    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        clave: clave
    };

    // Guardar en el array y actualizar LocalStorage
    usuarios.push(nuevoUsuario);
    localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));

    // Actualizar interfaz
    mostrarMensaje('¡Usuario registrado y guardado correctamente!', 'success');
    userForm.reset();
    renderizarTabla(usuarios);
    searchInput.value = ''; // Limpiar búsqueda al agregar
});

// BUSCAR USUARIOS (Utilizando operadores lógicos/condicionales tipo AND)
searchInput.addEventListener('input', (e) => {
    const terminoBusqueda = e.target.value.toLowerCase().trim();

    // Filtrar usando condiciones lógicas (AND implícito en la búsqueda de texto)
    const usuariosFiltrados = usuarios.filter(user => {
        return user && user.nombre.toLowerCase().includes(terminoBusqueda);
    });

    renderizarTabla(usuariosFiltrados);
});

// Función para renderizar la tabla y actualizar la cantidad usando .length
function renderizarTabla(lista) {
    tableBody.innerHTML = '';

    // Mostrar cantidad de usuarios utilizando .length
    userCount.textContent = lista.length;

    if (lista.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #6b7280;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    // Recorrer el array y pintar las filas en la tabla
    lista.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(user.nombre)}</td>
            <td>${escapeHtml(user.correo)}</td>
            <td>••••••</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Mostrar mensajes de error o éxito
function mostrarMensaje(texto, tipo) {
    formMessage.textContent = texto;
    formMessage.className = `message ${tipo}`;
    setTimeout(() => {
        formMessage.className = 'message';
    }, 3500);
}

// Función auxiliar para seguridad básica de texto (XSS)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}