// ====== VARIABLES GLOBALES ======
let countriesData = null;
let selectedCountries = [];
let currentCountry = null;
let currentRound = 0;
let totalRounds = 10;
let correctAnswers = 0;
let wrongAnswers = 0;
let currentStreak = 0;
let bestStreak = 0;
let gameMode = 'easy';
let gameStarted = false;

// ====== CONFIGURACIÓN DE MODOS ======
const gameModes = {
    easy: { options: 4, name: 'Fácil' },
    medium: { options: 6, name: 'Medio' },
    hard: { options: 8, name: 'Difícil' }
};

// ====== ELEMENTOS DEL DOM ======
const flagImage = document.getElementById('flagImage');
const optionsContainer = document.getElementById('optionsContainer');
const resultContainer = document.getElementById('resultContainer');
const resultMessage = document.getElementById('resultMessage');
const resultDetails = document.getElementById('resultDetails');
const nextButton = document.getElementById('nextButton');
const restartButton = document.getElementById('restartButton');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const finalResults = document.getElementById('finalResults');
const loadingScreen = document.getElementById('loadingScreen');

// ====== ESTADÍSTICAS ======
const correctAnswersEl = document.getElementById('correctAnswers');
const wrongAnswersEl = document.getElementById('wrongAnswers');
const accuracyEl = document.getElementById('accuracy');
const streakEl = document.getElementById('streak');

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

// ====== CONFIGURACIÓN INICIAL ======
async function initializeGame() {
    try {
        await loadCountries();
        setupModeSelector();
        hideLoading();
        showWelcomeMessage();
    } catch (error) {
        console.error('Error al cargar países:', error);
        showError('Error al cargar los datos. Inténtalo de nuevo.');
    }
}

// ====== CARGA DE PAÍSES ======
async function loadCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=translations,flags,name');
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filtrar países con traducción al español
    countriesData = data.filter(country => 
        country.translations?.spa?.common && 
        country.flags?.svg
    );
    
    console.log(`Cargados ${countriesData.length} países`);
}

// ====== CONFIGURACIÓN DE SELECTOR DE MODO ======
function setupModeSelector() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            modeButtons.forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            btn.classList.add('active');
            
            // Actualizar modo de juego
            gameMode = btn.dataset.mode;
            
            // Si el juego ya empezó, preguntar si quiere reiniciar
            if (gameStarted) {
                if (confirm('¿Quieres cambiar el modo de juego? Se reiniciará la partida.')) {
                    startNewGame();
                } else {
                    // Revertir selección
                    const currentModeBtn = document.querySelector(`[data-mode="${gameMode}"]`);
                    currentModeBtn.classList.remove('active');
                    btn.classList.add('active');
                    gameMode = currentModeBtn.dataset.mode;
                }
            }
        });
    });
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    nextButton.addEventListener('click', nextRound);
    restartButton.addEventListener('click', startNewGame);
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '9') {
            const optionIndex = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option-btn:not(:disabled)');
            if (options[optionIndex]) {
                options[optionIndex].click();
            }
        }
        
        if (e.key === 'Enter' && !nextButton.disabled) {
            nextRound();
        }
        
        if (e.key === 'r' || e.key === 'R') {
            startNewGame();
        }
    });
}

// ====== INICIAR NUEVO JUEGO ======
function startNewGame() {
    // Resetear variables
    currentRound = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    currentStreak = 0;
    gameStarted = true;
    
    // Seleccionar países aleatorios
    selectedCountries = shuffleArray([...countriesData]).slice(0, totalRounds);
    
    // Actualizar estadísticas
    updateStats();
    
    // Ocultar resultados finales
    finalResults.classList.remove('show');
    
    // Iniciar primera ronda
    nextRound();
    
    // Mostrar notificación
    showNotification(`¡Nuevo juego iniciado en modo ${gameModes[gameMode].name}!`, 'info');
}

// ====== SIGUIENTE RONDA ======
function nextRound() {
    if (currentRound >= totalRounds) {
        endGame();
    return;
  }

    // Ocultar resultado anterior
    resultContainer.style.display = 'none';
    
    // Actualizar progreso
    updateProgress();
    
    // Obtener país actual
    currentCountry = selectedCountries[currentRound];
    
    // Mostrar bandera
    displayFlag();
    
    // Generar opciones
    generateOptions();
    
    // Habilitar opciones
    enableOptions();
    
    // Deshabilitar botón siguiente
    nextButton.disabled = true;
    
    currentRound++;
}

// ====== MOSTRAR BANDERA ======
function displayFlag() {
    flagImage.src = currentCountry.flags.svg;
    flagImage.alt = `Bandera de ${currentCountry.translations.spa.common}`;
    
    // Manejar errores de carga
    flagImage.onerror = () => {
        if (currentCountry.flags.png) {
            flagImage.src = currentCountry.flags.png;
        }
    };
}

// ====== GENERAR OPCIONES ======
function generateOptions() {
    const optionsCount = gameModes[gameMode].options;
    
    // Obtener opciones incorrectas
    const incorrectOptions = countriesData
        .filter(country => country.translations.spa.common !== currentCountry.translations.spa.common)
        .sort(() => Math.random() - 0.5)
        .slice(0, optionsCount - 1);
    
    // Añadir opción correcta y mezclar
    const allOptions = [...incorrectOptions, currentCountry];
    const shuffledOptions = shuffleArray(allOptions);
    
    // Limpiar contenedor
    optionsContainer.innerHTML = '';
    
    // Crear botones de opciones
    shuffledOptions.forEach((country, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.innerHTML = `
            <span class="option-number">${index + 1}</span>
            <span class="option-text">${country.translations.spa.common}</span>
        `;
        
        optionBtn.addEventListener('click', () => checkAnswer(country));
        optionsContainer.appendChild(optionBtn);
    });
}

// ====== VERIFICAR RESPUESTA ======
function checkAnswer(selectedCountry) {
    const isCorrect = selectedCountry.translations.spa.common === currentCountry.translations.spa.common;
    
    // Deshabilitar todas las opciones
    disableOptions();
    
    // Mostrar resultado
    showResult(isCorrect, selectedCountry);
    
    // Actualizar estadísticas
    updateGameStats(isCorrect);
    
    // Habilitar botón siguiente
    nextButton.disabled = false;
    
    // Efectos de sonido (simulados)
    if (isCorrect) {
        playCorrectSound();
    } else {
        playIncorrectSound();
    }
}

// ====== MOSTRAR RESULTADO ======
function showResult(isCorrect, selectedCountry) {
    resultContainer.style.display = 'flex';
    
    if (isCorrect) {
        resultMessage.textContent = '✅ ¡Correcto!';
        resultMessage.style.color = '#4facfe';
        resultDetails.textContent = `Has acertado la bandera de ${currentCountry.translations.spa.common}`;
    } else {
        resultMessage.textContent = '❌ Incorrecto';
        resultMessage.style.color = '#f5576c';
        resultDetails.textContent = `Era ${currentCountry.translations.spa.common}, no ${selectedCountry.translations.spa.common}`;
    }
    
    // Marcar opciones
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        const optionText = btn.querySelector('.option-text').textContent;
        
        if (optionText === currentCountry.translations.spa.common) {
            btn.classList.add('correct');
        } else if (optionText === selectedCountry.translations.spa.common && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
}

// ====== ACTUALIZAR ESTADÍSTICAS ======
function updateGameStats(isCorrect) {
    if (isCorrect) {
        correctAnswers++;
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
        }
    } else {
        wrongAnswers++;
        currentStreak = 0;
    }
    
    updateStats();
}

// ====== ACTUALIZAR ESTADÍSTICAS EN UI ======
function updateStats() {
    correctAnswersEl.textContent = correctAnswers;
    wrongAnswersEl.textContent = wrongAnswers;
    
    const total = correctAnswers + wrongAnswers;
    const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    accuracyEl.textContent = `${accuracy}%`;
    
    streakEl.textContent = currentStreak;
}

// ====== ACTUALIZAR PROGRESO ======
function updateProgress() {
    const progress = (currentRound / totalRounds) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Ronda ${currentRound + 1} de ${totalRounds}`;
}

// ====== FINALIZAR JUEGO ======
function endGame() {
    // Ocultar elementos del juego
    document.querySelector('.game-main').style.display = 'none';
    
    // Mostrar resultados finales
    showFinalResults();
}

// ====== MOSTRAR RESULTADOS FINALES ======
function showFinalResults() {
    const finalScore = document.getElementById('finalScore');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const finalStreak = document.getElementById('finalStreak');
    
    finalScore.textContent = `${correctAnswers}/${totalRounds}`;
    finalAccuracy.textContent = `${Math.round((correctAnswers / totalRounds) * 100)}%`;
    finalStreak.textContent = bestStreak;
    
    finalResults.classList.add('show');
    
    // Guardar estadísticas
    saveGameStats();
    
    // Mostrar mensaje según rendimiento
    let message = '';
    const accuracy = (correctAnswers / totalRounds) * 100;
    
    if (accuracy >= 90) {
        message = '🏆 ¡Excelente! Eres un experto en banderas';
    } else if (accuracy >= 70) {
        message = '🎯 ¡Muy bien! Tienes buenos conocimientos';
    } else if (accuracy >= 50) {
        message = '👍 ¡Bien! Sigue practicando';
  } else {
        message = '📚 ¡No te rindas! La práctica hace al maestro';
    }
    
    showNotification(message, 'success');
}

// ====== FUNCIONES DE UTILIDAD ======
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function enableOptions() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.disabled = false;
        option.classList.remove('correct', 'incorrect');
    });
}

function disableOptions() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.disabled = true;
    });
}

// ====== EFECTOS DE SONIDO (SIMULADOS) ======
function playCorrectSound() {
    // En una implementación real, aquí se reproduciría un sonido
    console.log('🔊 Sonido de acierto');
}

function playIncorrectSound() {
    // En una implementación real, aquí se reproduciría un sonido
    console.log('🔊 Sonido de error');
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
    }, 4000);
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

// ====== GESTIÓN DE ESTADÍSTICAS ======
function saveGameStats() {
    const stats = {
        date: new Date().toISOString(),
        mode: gameMode,
        score: correctAnswers,
        total: totalRounds,
        accuracy: Math.round((correctAnswers / totalRounds) * 100),
        bestStreak: bestStreak
    };
    
    let gameHistory = JSON.parse(localStorage.getItem('flagGameHistory') || '[]');
    gameHistory.push(stats);
    
    // Mantener solo los últimos 50 juegos
    if (gameHistory.length > 50) {
        gameHistory = gameHistory.slice(-50);
    }
    
    localStorage.setItem('flagGameHistory', JSON.stringify(gameHistory));
}

function showLeaderboard() {
    const gameHistory = JSON.parse(localStorage.getItem('flagGameHistory') || '[]');
    
    if (gameHistory.length === 0) {
        showNotification('No hay estadísticas disponibles aún', 'info');
        return;
    }
    
    // Calcular mejores puntuaciones
    const bestScores = gameHistory
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    
    let message = '🏆 Mejores puntuaciones:\n';
    bestScores.forEach((score, index) => {
        message += `${index + 1}. ${score.score}/${score.total} (${score.accuracy}%) - ${score.mode}\n`;
    });
    
    alert(message);
}

// ====== FUNCIONES DE UTILIDAD ======
function hideLoading() {
    loadingScreen.classList.add('hide');
}

function showError(message) {
    showNotification(message, 'error');
}

function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('¡Bienvenido al juego de banderas! Selecciona un modo y comienza a jugar.', 'info');
    }, 1000);
}

// ====== FUNCIONES GLOBALES ======
window.startNewGame = startNewGame;
window.showLeaderboard = showLeaderboard;
