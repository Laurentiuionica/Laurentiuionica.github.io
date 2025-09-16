document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('miFormulario');
    const loadingMessage = document.getElementById('loadingMessage');
    const personaId = localStorage.getItem('personaEditando');
    const isEditing = !!personaId;

    // Actualizar título y botón según si es edición o creación
    if (isEditing) {
        document.getElementById('form-title').textContent = 'Editar Persona';
        document.querySelector('.form-subtitle').textContent = 'Modifica los datos de la persona';
        document.getElementById('btn-text').textContent = 'Actualizar Registro';
    }

    // Cargar datos si estamos editando
    if (personaId) {
        const personas = JSON.parse(localStorage.getItem('personas')) || [];
        const persona = personas[personaId];

        if (persona) {
            document.getElementById('nombre').value = persona.nombre || '';
            document.getElementById('apellidos').value = persona.apellidos || '';
            document.getElementById('fechaNacimiento').value = persona.fechaNacimiento.split('T')[0] || '';
            document.getElementById('localidad').value = persona.localidad || '';
            document.getElementById('direccion').value = persona.direccion || '';
        }
    }

    // Función para mostrar mensaje de carga
    function mostrarCarga() {
        loadingMessage.style.display = 'block';
    }

    // Función para ocultar mensaje de carga
    function ocultarCarga() {
        loadingMessage.style.display = 'none';
    }

    // Función para validar campos
    function validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const localidad = document.getElementById('localidad').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        // Validar nombre
        if (nombre.length < 2) {
            alert('El nombre debe tener al menos 2 caracteres');
            return false;
        }

        // Validar apellidos
        if (apellidos.length < 2) {
            alert('Los apellidos deben tener al menos 2 caracteres');
            return false;
        }

        // Validar fecha de nacimiento
        if (!fechaNacimiento) {
            alert('Debe seleccionar una fecha de nacimiento');
            return false;
        }

        // Validar que la fecha no sea futura
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        if (fechaNac > hoy) {
            alert('La fecha de nacimiento no puede ser futura');
            return false;
        }

        // Validar localidad
        if (localidad.length < 2) {
            alert('La localidad debe tener al menos 2 caracteres');
            return false;
        }

        // Validar dirección
        if (direccion.length < 5) {
            alert('La dirección debe tener al menos 5 caracteres');
            return false;
        }

        return true;
    }

    // Función para calcular edad
    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        return edad;
    }

    // Event listener para el formulario
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        mostrarCarga();

        // Simular delay para mejor UX
        setTimeout(() => {
            const nuevaPersona = {
                nombre: document.getElementById('nombre').value.trim(),
                apellidos: document.getElementById('apellidos').value.trim(),
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                localidad: document.getElementById('localidad').value.trim(),
                direccion: document.getElementById('direccion').value.trim()
            };

            // Calcular edad
            nuevaPersona.edad = calcularEdad(nuevaPersona.fechaNacimiento);

            let personas = JSON.parse(localStorage.getItem('personas')) || [];

            if (personaId) {
                // Editar existente
                personas[personaId] = nuevaPersona;
                localStorage.removeItem('personaEditando');
                alert('Persona actualizada correctamente');
            } else {
                // Añadir nuevo
                personas.push(nuevaPersona);
                alert('Persona añadida correctamente');
            }

            localStorage.setItem('personas', JSON.stringify(personas));
            
            ocultarCarga();
            
            // Redirigir después de mostrar el mensaje
            setTimeout(() => {
                window.location.href = 'lista.html';
            }, 500);
        }, 1000);
    });
});