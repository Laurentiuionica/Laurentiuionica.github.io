// Configuration
const config = {
    autoPlay: true,
    autoPlayInterval: 4000,
    transitionDuration: 600,
    enableKeyboard: true,
    enableSwipe: true
};

// Image array
const images = [
    './img/img0.jpeg',
    './img/img1.jpg',
    './img/img2.jpg',
    './img/img3.jpeg'
];

// DOM Elements
const track = document.querySelector('.carousel-track');
const indicators = document.querySelector('.indicators');
const currentSlideEl = document.querySelector('.current-slide');
const totalSlidesEl = document.querySelector('.total-slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const playPauseBtn = document.querySelector('.play-pause');
const fullscreenBtn = document.querySelector('.fullscreen');

// State
let currentIndex = 0;
let slides = [];
let totalSlides = images.length;
let autoPlayInterval;
let isPlaying = config.autoPlay;
let isFullscreen = false;

// Initialize
function init() {
    createSlides();
    createIndicators();
    updateCounter();
    setupEventListeners();
    updateCarousel();
    
    if (config.autoPlay) {
        startAutoPlay();
    }
    
    // Add loading animation
    setTimeout(() => {
        document.querySelector('.carousel').style.opacity = '1';
    }, 100);
}

// Create slides
function createSlides() {
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('slide');
        img.setAttribute('data-index', index);
        img.setAttribute('alt', `Slide ${index + 1}`);
        
        // Add loading animation
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        track.appendChild(img);
    });
    
    slides = document.querySelectorAll('.slide');
}

// Create indicators
function createIndicators() {
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicator.setAttribute('data-index', i);
        
        indicator.addEventListener('click', () => {
            goToSlide(i);
        });
        
        indicators.appendChild(indicator);
    }
}

// Update carousel position
function updateCarousel() {
    const width = track.clientWidth;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
    
    // Update counter
    updateCounter();
    
    // Add slide transition effect
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.style.transform = 'scale(1)';
        } else {
            slide.style.transform = 'scale(0.95)';
        }
    });
}

// Update slide counter
function updateCounter() {
    currentSlideEl.textContent = currentIndex + 1;
    totalSlidesEl.textContent = totalSlides;
}

// Navigation functions
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }
}

// Auto-play functionality
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    
    autoPlayInterval = setInterval(() => {
        if (isPlaying) {
            nextSlide();
        }
    }, config.autoPlayInterval);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    if (isPlaying) {
        stopAutoPlay();
        startAutoPlay();
    }
}

function toggleAutoPlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        startAutoPlay();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playPauseBtn.classList.add('active');
    } else {
        stopAutoPlay();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        playPauseBtn.classList.remove('active');
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const carousel = document.querySelector('.carousel');
    
    if (!isFullscreen) {
        if (carousel.requestFullscreen) {
            carousel.requestFullscreen();
        } else if (carousel.webkitRequestFullscreen) {
            carousel.webkitRequestFullscreen();
        } else if (carousel.msRequestFullscreen) {
            carousel.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Event listeners
function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    // Control buttons
    playPauseBtn.addEventListener('click', toggleAutoPlay);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Keyboard navigation
    if (config.enableKeyboard) {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    resetAutoPlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    resetAutoPlay();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
            }
        });
    }
    
    // Touch/swipe support
    if (config.enableSwipe) {
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        }
    }
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('msfullscreenchange', updateFullscreenState);
    
    // Window resize
    window.addEventListener('resize', () => {
        setTimeout(updateCarousel, 100);
    });
}

function updateFullscreenState() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    
    if (isFullscreen) {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        fullscreenBtn.classList.add('active');
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.classList.remove('active');
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

// Add some nice effects
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover effects to slides
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slide.style.transform = 'scale(1.05)';
        });
        
        slide.addEventListener('mouseleave', () => {
            if (slides[currentIndex] !== slide) {
                slide.style.transform = 'scale(0.95)';
            }
        });
    });
});



