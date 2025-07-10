// Configuration
const config = {
    autoPlay: true,
    autoPlayInterval: 3000,
    transitionType: 'fade', // fade, slide, zoom
    enableKeyboard: true,
    enableSwipe: true,
    showProgress: true
};

// DOM Elements
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelector('.indicators');
const progressFill = document.querySelector('.progress-fill');
const currentSlideEl = document.querySelector('.current');
const totalSlidesEl = document.querySelector('.total');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const playPauseBtn = document.querySelector('.play-pause');
const fullscreenBtn = document.querySelector('.fullscreen');
const settingsBtn = document.querySelector('.settings');
const settingsPanel = document.querySelector('.settings-panel');
const speedSlider = document.getElementById('speed');
const speedValue = document.querySelector('.speed-value');
const transitionSelect = document.getElementById('transition');
const closeSettingsBtn = document.querySelector('.close-settings');

// State
let currentIndex = 0;
let totalSlides = slides.length;
let autoPlayInterval;
let isPlaying = config.autoPlay;
let isFullscreen = false;
let progressInterval;

// Initialize
function init() {
    createIndicators();
    updateCounter();
    setupEventListeners();
    updateSlider();
    
    if (config.autoPlay) {
        startAutoPlay();
    }
    
    // Add loading animation
    setTimeout(() => {
        document.querySelector('.slider-container').style.opacity = '1';
    }, 100);
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

// Update slider
function updateSlider() {
    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Add active class to current slide
    slides[currentIndex].classList.add('active');
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
    
    // Update counter
    updateCounter();
    
    // Reset progress bar
    if (config.showProgress) {
        resetProgress();
    }
}

// Update counter
function updateCounter() {
    currentSlideEl.textContent = currentIndex + 1;
    totalSlidesEl.textContent = totalSlides;
}

// Navigation functions
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentIndex = index;
        updateSlider();
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

// Progress bar functionality
function resetProgress() {
    if (progressFill) {
        progressFill.style.width = '0%';
        
        if (progressInterval) clearInterval(progressInterval);
        
        if (isPlaying) {
            const duration = config.autoPlayInterval;
            const increment = 100 / (duration / 10);
            
            progressInterval = setInterval(() => {
                const currentWidth = parseFloat(progressFill.style.width) || 0;
                if (currentWidth < 100) {
                    progressFill.style.width = (currentWidth + increment) + '%';
                } else {
                    clearInterval(progressInterval);
                }
            }, 10);
        }
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const sliderContainer = document.querySelector('.slider-container');
    
    if (!isFullscreen) {
        if (sliderContainer.requestFullscreen) {
            sliderContainer.requestFullscreen();
        } else if (sliderContainer.webkitRequestFullscreen) {
            sliderContainer.webkitRequestFullscreen();
        } else if (sliderContainer.msRequestFullscreen) {
            sliderContainer.msRequestFullscreen();
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

// Settings functionality
function toggleSettings() {
    const isHidden = settingsPanel.hasAttribute('hidden');
    
    if (isHidden) {
        settingsPanel.removeAttribute('hidden');
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.setAttribute('hidden', '');
        settingsPanel.style.display = 'none';
    }
}

function updateSpeed() {
    const speed = speedSlider.value;
    config.autoPlayInterval = speed * 1000;
    speedValue.textContent = speed + 's';
    
    if (isPlaying) {
        resetAutoPlay();
    }
}

function updateTransition() {
    config.transitionType = transitionSelect.value;
    // You can add transition type logic here
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
    settingsBtn.addEventListener('click', toggleSettings);
    
    // Settings
    speedSlider.addEventListener('input', updateSpeed);
    transitionSelect.addEventListener('change', updateTransition);
    closeSettingsBtn.addEventListener('click', toggleSettings);
    
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
                case 'Escape':
                    if (!settingsPanel.hasAttribute('hidden')) {
                        toggleSettings();
                    }
                    break;
            }
        });
    }
    
    // Touch/swipe support
    if (config.enableSwipe) {
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
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
        setTimeout(updateSlider, 100);
    });
    
    // Click outside settings panel to close
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            if (!settingsPanel.hasAttribute('hidden')) {
                toggleSettings();
            }
        }
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
            if (slide.classList.contains('active')) {
                slide.style.transform = 'scale(1.02)';
            }
        });
        
        slide.addEventListener('mouseleave', () => {
            slide.style.transform = 'scale(1)';
        });
    });
    
    // Add loading animation for images
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('load', () => {
                slide.style.opacity = '1';
            });
        }
    });
});

