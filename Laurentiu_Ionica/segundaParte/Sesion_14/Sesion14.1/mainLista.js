function renderLista() {
    const personas = JSON.parse(localStorage.getItem('personas')) || [];
    const tbody = document.getElementById('lista-personas');
    tbody.innerHTML = '';

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
                <button class="btn-editar" data-id="${index}">Editar</button>
                <button class="btn-borrar" data-id="${index}">Borrar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Event listeners para los botones
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            localStorage.setItem('personaEditando', id);
            window.location.href = 'formulario.html';
        });
    });

    document.querySelectorAll('.btn-borrar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            borrarPersona(id);
        });
    });
}

function borrarPersona(id) {
    if (confirm('¿Estás seguro de querer borrar esta persona?')) {
        let personas = JSON.parse(localStorage.getItem('personas'));
        personas = personas.filter((_, index) => index != id);
        localStorage.setItem('personas', JSON.stringify(personas));
        renderLista(); // Refrescar la lista
        alert('Persona eliminada correctamente');
    }
}

document.addEventListener('DOMContentLoaded', renderLista);