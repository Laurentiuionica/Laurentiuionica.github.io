class Cronometro {
    constructor() {
        this.milliseconds = 0;
        this.interval = null;
        this.isRunning = false;
        this.laps = [];
        this.startTime = 0;
        this.lastLapTime = 0;
        
        // Elementos del DOM
        this.display = document.getElementById('display');
        this.startBtn = document.getElementById('startBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapsList = document.getElementById('lapsList');
        this.lapsCount = document.getElementById('laps-count');
        this.avgLap = document.getElementById('avg-lap');
        this.bestLap = document.getElementById('best-lap');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.code === 'KeyL' && this.isRunning) {
                this.recordLap();
            } else if (e.code === 'KeyR') {
                this.reset();
            }
        });
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.milliseconds;
            this.interval = setInterval(() => {
                this.milliseconds = Date.now() - this.startTime;
                this.updateDisplay();
            }, 10); // Actualizar cada 10ms para mayor precisión
            
            this.startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            this.startBtn.classList.remove('btn-primary');
            this.startBtn.classList.add('btn-secondary');
            this.lapBtn.disabled = false;
            this.resetBtn.disabled = false;
            
            // Animación de pulso en el display
            this.display.parentElement.classList.add('pulse');
        }
    }
    
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.interval = null;
            
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
            this.startBtn.classList.remove('btn-secondary');
            this.startBtn.classList.add('btn-primary');
            this.lapBtn.disabled = true;
            
            // Detener animación de pulso
            this.display.parentElement.classList.remove('pulse');
        }
    }
    
    reset() {
        this.stop();
        this.milliseconds = 0;
        this.laps = [];
        this.lastLapTime = 0;
        this.updateDisplay();
        this.updateLapsList();
        this.updateStats();
        
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
        this.resetBtn.disabled = true;
        this.lapBtn.disabled = true;
    }
    
    recordLap() {
        if (this.isRunning) {
            const currentTime = this.milliseconds;
            const lapTime = currentTime - this.lastLapTime;
            
            this.laps.push({
                number: this.laps.length + 1,
                totalTime: currentTime,
                lapTime: lapTime
            });
            
            this.lastLapTime = currentTime;
            this.updateLapsList();
            this.updateStats();
            
            // Efecto visual para la nueva vuelta
            this.showLapEffect();
        }
    }
    
    showLapEffect() {
        const lapItem = this.lapsList.lastElementChild;
        if (lapItem) {
            lapItem.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                lapItem.style.animation = '';
            }, 500);
        }
    }
    
    updateDisplay() {
        const time = this.formatTime(this.milliseconds);
        this.display.innerHTML = time;
    }
    
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        const mainTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const msTime = `${centiseconds.toString().padStart(2, '0')}`;
        
        return `${mainTime}<span class="milliseconds">.${msTime}</span>`;
    }
    
    formatLapTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        const mainTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const msTime = `${centiseconds.toString().padStart(2, '0')}`;
        
        return `${mainTime}<span class="milliseconds">.${msTime}</span>`;
    }
    
    updateLapsList() {
        this.lapsList.innerHTML = '';
        
        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<div style="text-align: center; color: #666; padding: 1rem;">No hay vueltas registradas</div>';
            return;
        }
        
        this.laps.forEach((lap, index) => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-item';
            
            const isBestLap = this.laps.length > 0 && lap.lapTime === Math.min(...this.laps.map(l => l.lapTime));
            const isWorstLap = this.laps.length > 0 && lap.lapTime === Math.max(...this.laps.map(l => l.lapTime));
            
            if (isBestLap) {
                lapElement.style.background = 'rgba(76, 175, 80, 0.1)';
                lapElement.style.border = '1px solid rgba(76, 175, 80, 0.3)';
            } else if (isWorstLap) {
                lapElement.style.background = 'rgba(244, 67, 54, 0.1)';
                lapElement.style.border = '1px solid rgba(244, 67, 54, 0.3)';
            }
            
            lapElement.innerHTML = `
                <div class="lap-number">Vuelta ${lap.number}</div>
                <div class="lap-time">${this.formatLapTime(lap.lapTime)}</div>
            `;
            
            this.lapsList.appendChild(lapElement);
        });
    }
    
    updateStats() {
        this.lapsCount.textContent = this.laps.length;
        
        if (this.laps.length > 0) {
            const avgLapTime = this.laps.reduce((sum, lap) => sum + lap.lapTime, 0) / this.laps.length;
            this.avgLap.innerHTML = this.formatLapTime(avgLapTime);
            
            const bestLapTime = Math.min(...this.laps.map(lap => lap.lapTime));
            this.bestLap.innerHTML = this.formatLapTime(bestLapTime);
        } else {
            this.avgLap.innerHTML = '00:00<span class="milliseconds">.00</span>';
            this.bestLap.innerHTML = '00:00<span class="milliseconds">.00</span>';
        }
    }
    
    // Método para exportar datos
    exportData() {
        return {
            totalTime: this.milliseconds,
            laps: this.laps,
            timestamp: new Date().toISOString()
        };
    }
    
    // Método para importar datos
    importData(data) {
        if (data.laps && Array.isArray(data.laps)) {
            this.laps = data.laps;
            this.updateLapsList();
            this.updateStats();
        }
    }
}

// Inicializar el cronómetro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const cronometro = new Cronometro();
    
    // Agregar funcionalidad de guardado automático
    window.addEventListener('beforeunload', () => {
        const data = cronometro.exportData();
        localStorage.setItem('cronometroData', JSON.stringify(data));
    });
    
    // Cargar datos guardados al iniciar
    const savedData = localStorage.getItem('cronometroData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            cronometro.importData(data);
        } catch (e) {
            console.log('No se pudieron cargar los datos guardados');
        }
    }
    
    // Hacer el cronómetro disponible globalmente para debugging
    window.cronometro = cronometro;
});

// Agregar efectos de sonido (opcional)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = type === 'lap' ? 800 : 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silenciar errores de audio
    }
}
