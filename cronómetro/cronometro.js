// Variables globales
let segundos = 0;
let intervalo = null;
let vueltas = [];
let tiempoUltimaVuelta = 0;

// Elementos del DOM
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const lapsCount = document.getElementById('laps-count');
const avgLap = document.getElementById('avg-lap');
const bestLap = document.getElementById('best-lap');

// Función para iniciar/pausar el cronómetro
function toggleCronometro() {
    if (intervalo === null) {
        // Iniciar cronómetro
        intervalo = setInterval(() => {
            segundos++;
            actualizarDisplay();
        }, 10); // Actualizar cada 10ms para centésimas
        
        startBtn.textContent = 'Pausar';
        startBtn.className = 'btn btn-start';
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    } else {
        // Pausar cronómetro
        clearInterval(intervalo);
        intervalo = null;
        
        startBtn.textContent = 'Continuar';
        lapBtn.disabled = true;
    }
}

// Función para registrar una vuelta
function registrarVuelta() {
    if (intervalo !== null) {
        const tiempoVuelta = segundos - tiempoUltimaVuelta;
        vueltas.push({
            numero: vueltas.length + 1,
            tiempo: tiempoVuelta
        });
        
        tiempoUltimaVuelta = segundos;
        actualizarListaVueltas();
        actualizarEstadisticas();
    }
}

// Función para reiniciar el cronómetro
function reiniciar() {
    clearInterval(intervalo);
    intervalo = null;
    segundos = 0;
    vueltas = [];
    tiempoUltimaVuelta = 0;
    
    actualizarDisplay();
    actualizarListaVueltas();
    actualizarEstadisticas();
    
    startBtn.textContent = 'Iniciar';
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

// Función para actualizar el display del tiempo
function actualizarDisplay() {
    const tiempo = formatearTiempo(segundos);
    display.textContent = tiempo;
}

// Función para formatear el tiempo
function formatearTiempo(millisegundos) {
    const horas = Math.floor(millisegundos / 360000);
    const minutos = Math.floor((millisegundos % 360000) / 6000);
    const segundos = Math.floor((millisegundos % 6000) / 100);
    const centesimas = Math.floor((millisegundos % 100) / 10);
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${centesimas.toString().padStart(1, '0')}`;
}

// Función para formatear tiempo de vuelta
function formatearTiempoVuelta(millisegundos) {
    const minutos = Math.floor(millisegundos / 6000);
    const segundos = Math.floor((millisegundos % 6000) / 100);
    const centesimas = Math.floor((millisegundos % 100) / 10);
    
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}.${centesimas.toString().padStart(1, '0')}`;
}

// Función para actualizar la lista de vueltas
function actualizarListaVueltas() {
    lapsList.innerHTML = '';
    
    if (vueltas.length === 0) {
        lapsList.innerHTML = '<p style="text-align: center; color: #666;">No hay vueltas registradas</p>';
        return;
    }
    
    vueltas.forEach(vuelta => {
        const vueltaElement = document.createElement('div');
        vueltaElement.className = 'lap-item';
        vueltaElement.innerHTML = `
            <div class="lap-number">Vuelta ${vuelta.numero}</div>
            <div class="lap-time">${formatearTiempoVuelta(vuelta.tiempo)}</div>
        `;
        lapsList.appendChild(vueltaElement);
    });
}

// Función para actualizar las estadísticas
function actualizarEstadisticas() {
    lapsCount.textContent = vueltas.length;
    
    if (vueltas.length > 0) {
        // Calcular promedio
        const tiempoTotal = vueltas.reduce((sum, vuelta) => sum + vuelta.tiempo, 0);
        const promedio = tiempoTotal / vueltas.length;
        avgLap.textContent = formatearTiempoVuelta(promedio);
        
        // Calcular mejor vuelta
        const mejorTiempo = Math.min(...vueltas.map(vuelta => vuelta.tiempo));
        bestLap.textContent = formatearTiempoVuelta(mejorTiempo);
    } else {
        avgLap.textContent = '00:00.0';
        bestLap.textContent = '00:00.0';
    }
}

// Event listeners
startBtn.addEventListener('click', toggleCronometro);
lapBtn.addEventListener('click', registrarVuelta);
resetBtn.addEventListener('click', reiniciar);

// Atajos de teclado
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        toggleCronometro();
    } else if (event.code === 'KeyL' && intervalo !== null) {
        registrarVuelta();
    } else if (event.code === 'KeyR') {
        reiniciar();
    }
});

// Inicializar
actualizarDisplay();
actualizarListaVueltas();
actualizarEstadisticas();
