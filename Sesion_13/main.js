
// ====== VARIABLES GLOBALES ======
let currentIndex = 0;
let isPlaying = true;
let autoplayInterval;
let autoplaySpeed = 3000; // 3 segundos por defecto

// ====== DATOS DE LAS IMÁGENES ======
const images = [
    {
        src: "imagenes/img07.jpg",
        title: "Imagen 1",
        description: "Imagen personalizada 1."
    },
    {
        src: "imagenes/img7.jpg",
        title: "Imagen 2",
        description: "Imagen personalizada 2."
    },
    {
        src: "imagenes/img77.jpg",
        title: "Imagen 3",
        description: "Imagen personalizada 3."
    },
    {
        src: "imagenes/img777.jpg",
        title: "Imagen 4",
        description: "Imagen personalizada 4."
    },
    {
        src: "imagenes/img7777.webp",
        title: "Imagen 5",
        description: "Imagen personalizada 5."
    },
    {
        src: "imagenes/img77777.jpg_large",
        title: "Imagen 6",
        description: "Imagen personalizada 6."
    }
];

// ====== ELEMENTOS DEL DOM ======
const currentImage = document.getElementById('currentImage');
const slideTitle = document.getElementById('slideTitle');
const slideDescription = document.getElementById('slideDescription');
const currentSlideEl = document.getElementById('currentSlide');
const totalSlidesEl = document.getElementById('totalSlides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');
const thumbnailsGrid = document.getElementById('thumbnailsGrid');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenClose = document.getElementById('fullscreenClose');
const fullscreenPrev = document.getElementById('fullscreenPrev');
const fullscreenNext = document.getElementById('fullscreenNext');

// Información de la imagen
const imageResolution = document.getElementById('imageResolution');
const imageSize = document.getElementById('imageSize');
const imageFormat = document.getElementById('imageFormat');

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    setupEventListeners();
    startAutoplay();
});

// ====== CONFIGURACIÓN INICIAL ======
function initializeGallery() {
    // Configurar total de slides
    totalSlidesEl.textContent = images.length;
    
    // Cargar primera imagen
    loadImage(0);
    
    // Crear miniaturas
    createThumbnails();
    
    // Actualizar información de la imagen
    updateImageInfo();
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Controles principales
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Controles de velocidad
    speedSlider.addEventListener('input', updateSpeed);
    
    // Navegación en la imagen
    navLeft.addEventListener('click', previousSlide);
    navRight.addEventListener('click', nextSlide);
    
    // Pantalla completa
    fullscreenClose.addEventListener('click', closeFullscreen);
    fullscreenPrev.addEventListener('click', () => {
        previousSlide();
        updateFullscreenImage();
    });
    fullscreenNext.addEventListener('click', () => {
        nextSlide();
        updateFullscreenImage();
    });
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', handleKeyboard);
    
    // Doble clic en imagen para pantalla completa
    currentImage.addEventListener('dblclick', openFullscreen);
    
    // Cerrar pantalla completa con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('show')) {
            closeFullscreen();
        }
    });
}

// ====== FUNCIONES DE NAVEGACIÓN ======
function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    loadImage(currentIndex);
    updateThumbnails();
}

function previousSlide() {
    currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    loadImage(currentIndex);
    updateThumbnails();
}

function goToSlide(index) {
    if (index >= 0 && index < images.length) {
        currentIndex = index;
        loadImage(currentIndex);
        updateThumbnails();
    }
}

// ====== CARGAR IMAGEN ======
function loadImage(index) {
    const image = images[index];
    
    // Aplicar animación de salida
    currentImage.style.animation = 'slideOut 0.3s ease-out';
    
    setTimeout(() => {
        // Cambiar imagen
        currentImage.src = image.src;
        slideTitle.textContent = image.title;
        slideDescription.textContent = image.description;
        currentSlideEl.textContent = index + 1;
        
        // Aplicar animación de entrada
        currentImage.style.animation = 'slideIn 0.3s ease-out';
        
        // Actualizar información
        updateImageInfo();
        
        // Limpiar animación
        setTimeout(() => {
            currentImage.style.animation = '';
        }, 300);
    }, 150);
}

// ====== CREAR MINIATURAS ======
function createThumbnails() {
    thumbnailsGrid.innerHTML = '';
    
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item';
        thumbnail.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="thumbnail-number">${index + 1}</div>
        `;
        
        thumbnail.addEventListener('click', () => goToSlide(index));
        thumbnailsGrid.appendChild(thumbnail);
    });
    
    updateThumbnails();
}

// ====== ACTUALIZAR MINIATURAS ======
function updateThumbnails() {
    const thumbnails = thumbnailsGrid.querySelectorAll('.thumbnail-item');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === currentIndex);
    });
}

// ====== CONTROL DE AUTOPLAY ======
function startAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
    
    autoplayInterval = setInterval(() => {
        if (isPlaying) {
            nextSlide();
        }
    }, autoplaySpeed);
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    
    const icon = playPauseBtn.querySelector('.btn-icon');
    const text = playPauseBtn.querySelector('.btn-text');
    
    if (isPlaying) {
        icon.textContent = '⏸️';
        text.textContent = 'Pausar';
        startAutoplay();
    } else {
        icon.textContent = '▶️';
        text.textContent = 'Reproducir';
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
}

// ====== CONTROL DE VELOCIDAD ======
function updateSpeed() {
    const speed = parseInt(speedSlider.value);
    autoplaySpeed = speed * 1000; // Convertir a milisegundos
    speedValue.textContent = `${speed}s`;
    
    if (isPlaying) {
        startAutoplay(); // Reiniciar con nueva velocidad
    }
}

// ====== PANTALLA COMPLETA ======
function openFullscreen() {
    fullscreenImage.src = currentImage.src;
    fullscreenOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    fullscreenOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

function updateFullscreenImage() {
    fullscreenImage.src = currentImage.src;
}

// ====== TECLADO ======
function handleKeyboard(e) {
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousSlide();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            break;
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            if (fullscreenOverlay.classList.contains('show')) {
                closeFullscreen();
            } else {
                openFullscreen();
            }
            break;
    }
}

// ====== INFORMACIÓN DE LA IMAGEN ======
function updateImageInfo() {
    const img = new Image();
    img.onload = function() {
        imageResolution.textContent = `${this.naturalWidth} × ${this.naturalHeight}`;
        
        // Calcular tamaño aproximado (simulado)
        const sizeKB = Math.round((this.naturalWidth * this.naturalHeight * 3) / 1024);
        imageSize.textContent = sizeKB > 1024 ? 
            `${(sizeKB / 1024).toFixed(1)} MB` : 
            `${sizeKB} KB`;
        
        // Detectar formato
        const format = getImageFormat(this.src);
        imageFormat.textContent = format.toUpperCase();
    };
    img.src = currentImage.src;
}

function getImageFormat(src) {
    const extension = src.split('.').pop().split('?')[0];
    const formatMap = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG',
        'png': 'PNG',
        'gif': 'GIF',
        'webp': 'WebP',
        'svg': 'SVG'
    };
    return formatMap[extension] || 'Desconocido';
}

// ====== EFECTOS VISUALES ======
function addSlideEffect() {
    const container = currentImage.parentElement;
    container.style.transform = 'scale(1.02)';
    container.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 300);
}

// ====== NOTIFICACIONES ======
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 1rem;
        box-shadow: var(--shadow);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });

    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// ====== FUNCIONES DE UTILIDAD ======
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ====== LIMPIEZA ======
window.addEventListener('beforeunload', () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
});

// ====== MENSAJE DE BIENVENIDA ======
setTimeout(() => {
    showNotification('¡Bienvenido a mi galería de proyectos! Usa las flechas o haz doble clic en las imágenes.', 'info');
}, 1000);

