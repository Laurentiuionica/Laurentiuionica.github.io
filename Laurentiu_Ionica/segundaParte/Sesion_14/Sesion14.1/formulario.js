document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('miFormulario');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const personaId = localStorage.getItem('personaEditando');
    const isEditing = !!personaId;

    // Actualizar título y botón según si es edición o creación
    if (isEditing) {
        document.getElementById('form-title').textContent = 'Editar Persona';
        document.querySelector('.form-subtitle').textContent = 'Modifica los datos de la persona';
        document.querySelector('.btn-submit span').textContent = 'Actualizar Registro';
        document.querySelector('.btn-submit i').className = 'fas fa-edit';
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

    // Función para mostrar loading
    function showLoading() {
        loadingOverlay.classList.add('show');
    }

    // Función para ocultar loading
    function hideLoading() {
        loadingOverlay.classList.remove('show');
    }

    // Función para validar campos
    function validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const localidad = document.getElementById('localidad').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        // Validar nombre
        if (nombre.length < 2) {
            showError('El nombre debe tener al menos 2 caracteres');
            return false;
        }

        // Validar apellidos
        if (apellidos.length < 2) {
            showError('Los apellidos deben tener al menos 2 caracteres');
            return false;
        }

        // Validar fecha de nacimiento
        if (!fechaNacimiento) {
            showError('Debe seleccionar una fecha de nacimiento');
            return false;
        }

        // Validar que la fecha no sea futura
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        if (fechaNac > hoy) {
            showError('La fecha de nacimiento no puede ser futura');
            return false;
        }

        // Validar localidad
        if (localidad.length < 2) {
            showError('La localidad debe tener al menos 2 caracteres');
            return false;
        }

        // Validar dirección
        if (direccion.length < 5) {
            showError('La dirección debe tener al menos 5 caracteres');
            return false;
        }

        return true;
    }

    // Función para mostrar errores
    function showError(message) {
        // Crear notificación de error
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Función para mostrar éxito
    function showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
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

        if (!validateForm()) {
            return;
        }

        showLoading();

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
                showSuccess('Persona actualizada correctamente');
            } else {
                // Añadir nuevo
                personas.push(nuevaPersona);
                showSuccess('Persona añadida correctamente');
            }

            localStorage.setItem('personas', JSON.stringify(personas));
            
            hideLoading();
            
            // Redirigir después de mostrar el mensaje de éxito
            setTimeout(() => {
                window.location.href = 'lista.html';
            }, 1000);
        }, 1500);
    });

    // Añadir efectos de focus a los inputs
    const inputs = document.querySelectorAll('#miFormulario input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
});

// Estilos CSS para las notificaciones (se añaden dinámicamente)
const notificationStyles = `
    .error-notification,
    .success-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .error-notification {
        background: linear-gradient(135deg, #f56565, #e53e3e);
    }

    .success-notification {
        background: linear-gradient(135deg, #48bb78, #38a169);
    }

    .error-notification button,
    .success-notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.3s;
    }

    .error-notification button:hover,
    .success-notification button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .input-wrapper.focused {
        transform: scale(1.02);
    }

    #miFormulario input.has-value {
        border-color: #48bb78;
        background: #f0fff4;
    }
`;

// Añadir estilos al head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);