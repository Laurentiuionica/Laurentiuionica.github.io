
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: Arial, sans-serif;
    padding: 30px;
    background-color: #f0f0f0;
  }
  button {
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
  }
  #coords {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }
`;
document.head.appendChild(style);


const coordDiv = document.createElement('div');
coordDiv.id = 'coords';
coordDiv.textContent = 'Coordenadas: X - , Y - ';
document.body.appendChild(coordDiv);

document.addEventListener('click', function (evento) {
    console.log("evento", evento);
    const x = evento.clientX;
    const y = evento.clientY;
    coordDiv.textContent = `Coordenadas: X - ${x}, Y - ${y}`;
});

// ====== CLASE PRINCIPAL DEL DETECTOR DE COORDENADAS ======
class CoordinatesDetector {
    constructor() {
        this.history = [];
        this.captureMode = false;
        this.pointA = null;
        this.pointB = null;
        this.currentColor = '#000000';
        
        this.initializeElements();
        this.bindEvents();
        this.startTracking();
        this.updateDeviceInfo();
    }

    // ====== INICIALIZACIÓN ======
    initializeElements() {
        // Elementos de coordenadas
        this.clientCoords = document.getElementById('client-coords');
        this.pageCoords = document.getElementById('page-coords');
        this.screenCoords = document.getElementById('screen-coords');
        this.elementInfo = document.getElementById('element-info');
        
        // Información del dispositivo
        this.screenSize = document.getElementById('screen-size');
        this.viewportSize = document.getElementById('viewport-size');
        this.scrollPosition = document.getElementById('scroll-position');
        this.zoomLevel = document.getElementById('zoom-level');
        
        // Controles
        this.captureBtn = document.getElementById('capture-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.copyBtn = document.getElementById('copy-btn');
        
        // Overlay de captura
        this.captureOverlay = document.getElementById('capture-overlay');
        this.captureCoords = document.getElementById('capture-coords');
        this.captureCrosshair = document.querySelector('.capture-crosshair');
        
        // Historial
        this.historyList = document.getElementById('history-list');
        
        // Herramientas
        this.pointAElement = document.getElementById('point-a');
        this.pointBElement = document.getElementById('point-b');
        this.distanceValue = document.getElementById('distance-value');
        this.setPointABtn = document.getElementById('set-point-a');
        this.setPointBBtn = document.getElementById('set-point-b');
        this.clearPointsBtn = document.getElementById('clear-points');
        
        // Selector de color
        this.colorPreview = document.getElementById('color-preview');
        this.colorValue = document.getElementById('color-value');
        this.colorRgb = document.getElementById('color-rgb');
        this.colorSwatch = document.querySelector('.color-swatch');
        this.copyColorBtn = document.getElementById('copy-color');
        
        // Notificaciones
        this.notification = document.getElementById('notification');
    }

    // ====== EVENTOS ======
    bindEvents() {
        // Botones principales
        this.captureBtn.addEventListener('click', () => this.toggleCaptureMode());
        this.clearBtn.addEventListener('click', () => this.clearHistory());
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.copyBtn.addEventListener('click', () => this.copyHistory());
        
        // Overlay de captura
        this.captureOverlay.addEventListener('click', (e) => this.captureCoordinates(e));
        this.captureOverlay.addEventListener('mousemove', (e) => this.updateCaptureCoords(e));
        
        // Herramientas de distancia
        this.setPointABtn.addEventListener('click', () => this.setPoint('A'));
        this.setPointBBtn.addEventListener('click', () => this.setPoint('B'));
        this.clearPointsBtn.addEventListener('click', () => this.clearPoints());
        
        // Selector de color
        this.copyColorBtn.addEventListener('click', () => this.copyColor());
        
        // Eventos del documento
        document.addEventListener('mousemove', (e) => this.updateCoordinates(e));
        document.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('resize', () => this.updateDeviceInfo());
        window.addEventListener('scroll', () => this.updateDeviceInfo());
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // ====== SEGUIMIENTO DE COORDENADAS ======
    startTracking() {
        // Actualizar información del dispositivo cada segundo
        setInterval(() => {
            this.updateDeviceInfo();
        }, 1000);
    }

    updateCoordinates(event) {
        const clientX = event.clientX;
        const clientY = event.clientY;
        const pageX = event.pageX;
        const pageY = event.pageY;
        const screenX = event.screenX;
        const screenY = event.screenY;

        // Actualizar coordenadas en tiempo real
        this.clientCoords.textContent = `X: ${clientX}, Y: ${clientY}`;
        this.pageCoords.textContent = `X: ${pageX}, Y: ${pageY}`;
        this.screenCoords.textContent = `X: ${screenX}, Y: ${screenY}`;

        // Solo actualizar elemento bajo el cursor en modo de captura
        if (this.captureMode) {
            const element = document.elementFromPoint(clientX, clientY);
            if (element) {
                const tagName = element.tagName.toLowerCase();
                const className = element.className ? element.className.split(' ')[0] : '';
                const id = element.id || '';
                const elementText = `${tagName}${id ? '#' + id : ''}${className ? '.' + className : ''}`;
                this.elementInfo.textContent = elementText;
            } else {
                this.elementInfo.textContent = 'Ninguno';
            }
        }

        // Actualizar color bajo el cursor solo en modo de captura
        if (this.captureMode) {
            this.updateColorAtPoint(clientX, clientY);
        }
    }

    updateColorAtPoint(x, y) {
        // Crear un canvas temporal para obtener el color
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;
        
        // Capturar el color del punto (esto es una aproximación)
        // En un entorno real, necesitarías usar html2canvas o similar
        const randomColor = this.getRandomColor(); // Simulación
        this.currentColor = randomColor;
        
        this.colorValue.textContent = randomColor;
        this.colorRgb.textContent = this.hexToRgb(randomColor);
        this.colorSwatch.style.background = randomColor;
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `RGB(${r}, ${g}, ${b})`;
        }
        return 'RGB(0, 0, 0)';
    }

    // ====== MODO DE CAPTURA ======
    toggleCaptureMode() {
        this.captureMode = !this.captureMode;
        
        if (this.captureMode) {
            this.captureOverlay.classList.add('active');
            this.captureBtn.innerHTML = '<span class="btn-icon">⏹️</span><span class="btn-text">Cancelar</span>';
            document.body.style.cursor = 'crosshair';
        } else {
            this.captureOverlay.classList.remove('active');
            this.captureBtn.innerHTML = '<span class="btn-icon">📸</span><span class="btn-text">Capturar</span>';
            document.body.style.cursor = 'default';
        }
    }

    updateCaptureCoords(event) {
        if (!this.captureMode) return;
        
        const x = event.clientX;
        const y = event.clientY;
        this.captureCoords.textContent = `X: ${x}, Y: ${y}`;
        
        // Mover la mira
        this.captureCrosshair.style.left = (x - 10) + 'px';
        this.captureCrosshair.style.top = (y - 10) + 'px';
    }

    captureCoordinates(event) {
        if (!this.captureMode) return;
        
        const coords = {
            client: { x: event.clientX, y: event.clientY },
            page: { x: event.pageX, y: event.pageY },
            screen: { x: event.screenX, y: event.screenY },
            timestamp: new Date().toLocaleTimeString(),
            type: 'Captura'
        };
        
        this.addToHistory(coords);
        this.toggleCaptureMode();
        this.showNotification('Coordenadas capturadas correctamente');
    }

    handleClick(event) {
        if (this.captureMode) return;
        
        const coords = {
            client: { x: event.clientX, y: event.clientY },
            page: { x: event.pageX, y: event.pageY },
            screen: { x: event.screenX, y: event.screenY },
            timestamp: new Date().toLocaleTimeString(),
            type: 'Clic'
        };
        
        // Actualizar elemento bajo el cursor al hacer clic
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if (element) {
            const tagName = element.tagName.toLowerCase();
            const className = element.className ? element.className.split(' ')[0] : '';
            const id = element.id || '';
            const elementText = `${tagName}${id ? '#' + id : ''}${className ? '.' + className : ''}`;
            this.elementInfo.textContent = elementText;
        } else {
            this.elementInfo.textContent = 'Ninguno';
        }
        
        // Actualizar color al hacer clic
        this.updateColorAtPoint(event.clientX, event.clientY);
        
        this.addToHistory(coords);
    }

    // ====== HISTORIAL ======
    addToHistory(coords) {
        this.history.unshift(coords);
        
        // Limitar el historial a 50 elementos
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.updateHistoryDisplay();
        this.saveHistory();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item">
                <div class="history-coords">
                    Cliente: (${item.client.x}, ${item.client.y})
                </div>
                <div class="history-time">${item.timestamp}</div>
                <div class="history-type">${item.type}</div>
            </div>
        `).join('');
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryDisplay();
        this.saveHistory();
        this.showNotification('Historial limpiado');
    }

    // ====== HERRAMIENTAS ======
    setPoint(point) {
        const coords = {
            client: { x: parseInt(this.clientCoords.textContent.match(/X: (\d+), Y: (\d+)/).slice(1)) },
            timestamp: new Date().toLocaleTimeString()
        };
        
        if (point === 'A') {
            this.pointA = coords;
            this.pointAElement.textContent = `(${coords.client.x}, ${coords.client.y})`;
        } else {
            this.pointB = coords;
            this.pointBElement.textContent = `(${coords.client.x}, ${coords.client.y})`;
        }
        
        this.calculateDistance();
        this.showNotification(`Punto ${point} establecido`);
    }

    calculateDistance() {
        if (this.pointA && this.pointB) {
            const dx = this.pointB.client.x - this.pointA.client.x;
            const dy = this.pointB.client.y - this.pointA.client.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.distanceValue.textContent = `${Math.round(distance)}px`;
        }
    }

    clearPoints() {
        this.pointA = null;
        this.pointB = null;
        this.pointAElement.textContent = 'No seleccionado';
        this.pointBElement.textContent = 'No seleccionado';
        this.distanceValue.textContent = '-';
        this.showNotification('Puntos limpiados');
    }

    // ====== INFORMACIÓN DEL DISPOSITIVO ======
    updateDeviceInfo() {
        // Tamaño de pantalla
        this.screenSize.textContent = `${screen.width} x ${screen.height}`;
        
        // Tamaño del viewport
        this.viewportSize.textContent = `${window.innerWidth} x ${window.innerHeight}`;
        
        // Posición del scroll
        this.scrollPosition.textContent = `X: ${window.pageXOffset}, Y: ${window.pageYOffset}`;
        
        // Nivel de zoom (aproximado)
        const zoom = Math.round(window.devicePixelRatio * 100);
        this.zoomLevel.textContent = `${zoom}%`;
    }

    // ====== EXPORTACIÓN Y COPIA ======
    exportData() {
        const data = {
            coordinates: this.history,
            deviceInfo: {
                screenSize: this.screenSize.textContent,
                viewportSize: this.viewportSize.textContent,
                timestamp: new Date().toISOString()
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coordinates-${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Datos exportados correctamente');
    }

    copyHistory() {
        const text = this.history.map(item => 
            `${item.type} - Cliente: (${item.client.x}, ${item.client.y}) - ${item.timestamp}`
        ).join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Historial copiado al portapapeles');
        });
    }

    copyColor() {
        navigator.clipboard.writeText(this.currentColor).then(() => {
            this.showNotification('Color copiado al portapapeles');
        });
    }

    // ====== TECLADO ======
    handleKeyboard(event) {
        switch(event.key) {
            case 'Escape':
                if (this.captureMode) {
                    this.toggleCaptureMode();
                }
                break;
            case 'c':
                if (event.ctrlKey) {
                    this.copyHistory();
                }
                break;
            case 'e':
                if (event.ctrlKey) {
                    this.exportData();
                }
                break;
            case 'a':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.setPoint('A');
                }
                break;
            case 'b':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.setPoint('B');
                }
                break;
        }
    }

    // ====== NOTIFICACIONES ======
    showNotification(message) {
        const notificationText = this.notification.querySelector('.notification-text');
        notificationText.textContent = message;
        
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    // ====== PERSISTENCIA ======
    saveHistory() {
        localStorage.setItem('coordinates-history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('coordinates-history');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }
}

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    const detector = new CoordinatesDetector();
    detector.loadHistory();
    
    // Hacer el detector global para debugging
    window.coordinatesDetector = detector;
});
