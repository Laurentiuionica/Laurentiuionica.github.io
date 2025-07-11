function mostrarLista() {
    const personas = JSON.parse(localStorage.getItem('personas')) || [];
    const tbody = document.getElementById('lista-personas');
    tbody.innerHTML = '';

    if (personas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay personas registradas</td></tr>';
        return;
    }

    personas.forEach((personaData, index) => {
        const persona = new Persona(
            personaData.nombre,
            personaData.apellidos,
            personaData.fechaNacimiento,
            personaData.localidad,
            personaData.direccion
        );

        const tr = document.createElement('tr');

        // Datos de la persona
        tr.innerHTML = `
            <td>${persona.nombreCompleto()}</td>
            <td>${persona.obtenerEdad()}</td>
            <td>${formatearFecha(persona.fechaNacimiento)}</td>
            <td>${persona.localidad}</td>
            <td>${persona.direccion}</td>
            <td>
                <button class="btn-editar" onclick="editarPersona(${index})">Editar</button>
                <button class="btn-borrar" onclick="borrarPersona(${index})">Borrar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editarPersona(id) {
    localStorage.setItem('personaEditando', id);
    window.location.href = 'formulario.html';
}

function borrarPersona(id) {
    if (confirm('¿Estás seguro de querer borrar esta persona?')) {
        let personas = JSON.parse(localStorage.getItem('personas'));
        personas = personas.filter((_, index) => index != id);
        localStorage.setItem('personas', JSON.stringify(personas));
        mostrarLista(); // Refrescar la lista
        alert('Persona eliminada correctamente');
    }
}

document.addEventListener('DOMContentLoaded', mostrarLista);