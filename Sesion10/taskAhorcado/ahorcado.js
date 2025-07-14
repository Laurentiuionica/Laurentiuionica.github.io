// ====== CONFIGURACIÓN DEL JUEGO ======
const GAME_CONFIG = {
    maxAttempts: 6,
    baseScore: 100,
    bonusPerAttempt: 10,
    hintPenalty: 20
};

// ====== BASE DE DATOS DE PALABRAS ======
const WORDS_DATABASE = {
    animales: {
        name: "Animales",
        words: [
            { word: "elefante", hint: "Mamífero muy grande con trompa" },
            { word: "jirafa", hint: "Animal con cuello muy largo" },
            { word: "leon", hint: "Rey de la selva" },
            { word: "tigre", hint: "Felino con rayas naranjas" },
            { word: "delfin", hint: "Mamífero marino muy inteligente" },
            { word: "pinguino", hint: "Ave que no vuela pero nada" },
            { word: "koala", hint: "Mamífero que come eucalipto" },
            { word: "canguro", hint: "Animal que salta con bolsa" },
            { word: "panda", hint: "Oso blanco y negro" },
            { word: "tortuga", hint: "Reptil con caparazón" }
        ]
    },
    paises: {
        name: "Países",
        words: [
            { word: "españa", hint: "País de la paella y el flamenco" },
            { word: "francia", hint: "País de la torre eiffel" },
            { word: "italia", hint: "País de la pizza y la pasta" },
            { word: "alemania", hint: "País de la cerveza y los castillos" },
            { word: "japon", hint: "País del sol naciente" },
            { word: "brasil", hint: "País del carnaval y el fútbol" },
            { word: "mexico", hint: "País de los tacos y el tequila" },
            { word: "canada", hint: "País del sirope de arce" },
            { word: "australia", hint: "País de los canguros" },
            { word: "egipto", hint: "País de las pirámides" }
        ]
    },
    deportes: {
        name: "Deportes",
        words: [
            { word: "futbol", hint: "Deporte con balón y porterías" },
            { word: "baloncesto", hint: "Deporte con canasta y aros" },
            { word: "tenis", hint: "Deporte con raqueta y red" },
            { word: "natacion", hint: "Deporte en el agua" },
            { word: "atletismo", hint: "Deporte de velocidad y resistencia" },
            { word: "boxeo", hint: "Deporte de combate con guantes" },
            { word: "golf", hint: "Deporte con palos y hoyos" },
            { word: "esqui", hint: "Deporte en la nieve" },
            { word: "surf", hint: "Deporte sobre olas" },
            { word: "ciclismo", hint: "Deporte con bicicleta" }
        ]
    },
    tecnologia: {
        name: "Tecnología",
        words: [
            { word: "ordenador", hint: "Máquina para procesar información" },
            { word: "internet", hint: "Red mundial de comunicación" },
            { word: "smartphone", hint: "Teléfono inteligente" },
            { word: "tablet", hint: "Dispositivo táctil plano" },
            { word: "robot", hint: "Máquina que puede hacer tareas" },
            { word: "satelite", hint: "Objeto que orbita la Tierra" },
            { word: "drone", hint: "Aeronave no tripulada" },
            { word: "virtual", hint: "Realidad simulada por ordenador" },
            { word: "artificial", hint: "Inteligencia creada por máquinas" },
            { word: "blockchain", hint: "Tecnología de cadena de bloques" }
        ]
    }
};

// ====== CLASE PRINCIPAL DEL JUEGO ======
class HangmanGame {
    constructor() {
        this.currentWord = null;
        this.currentCategory = null;
        this.guessedLetters = new Set();
        this.attemptsLeft = GAME_CONFIG.maxAttempts;
        this.gameState = 'playing'; // 'playing', 'won', 'lost'
        this.score = 0;
        this.streak = 0;
        this.gamesPlayed = 0;
        this.hintsUsed = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadStats();
        this.startNewGame();
    }

    // ====== INICIALIZACIÓN ======
    initializeElements() {
        // Elementos del juego
        this.wordDisplay = document.getElementById('word-display');
        this.wordHint = document.getElementById('word-hint');
        this.attemptsDisplay = document.getElementById('attempts');
        this.categoryDisplay = document.getElementById('category-name');
        this.messageDisplay = document.getElementById('game-message');
        this.usedLettersDisplay = document.querySelector('.used-letters-display');
        
        // Estadísticas
        this.scoreDisplay = document.getElementById('score');
        this.streakDisplay = document.getElementById('streak');
        this.gamesDisplay = document.getElementById('games');
        
        // Controles
        this.newGameBtn = document.getElementById('new-game-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        
        // Modal
        this.modal = document.getElementById('result-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalIcon = document.getElementById('result-icon');
        this.modalScore = document.getElementById('modal-score');
        this.modalWord = document.getElementById('modal-word');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        
        // Teclado virtual
        this.keys = document.querySelectorAll('.key');
    }

    // ====== EVENTOS ======
    bindEvents() {
        // Botones de control
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.hintBtn.addEventListener('click', () => this.useHint());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Modal
        this.playAgainBtn.addEventListener('click', () => {
            this.hideModal();
            this.startNewGame();
        });
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        
        // Teclado virtual
        this.keys.forEach(key => {
            key.addEventListener('click', () => {
                const letter = key.dataset.letter;
                this.guessLetter(letter);
            });
        });
        
        // Teclado físico
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                const letter = e.key.toLowerCase();
                if (/^[a-zñ]$/.test(letter)) {
                    this.guessLetter(letter);
                }
            }
        });
    }

    // ====== LÓGICA DEL JUEGO ======
    startNewGame() {
        // Seleccionar categoría y palabra aleatoria
        const categories = Object.keys(WORDS_DATABASE);
        this.currentCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = WORDS_DATABASE[this.currentCategory].words;
        this.currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        // Reiniciar estado del juego
        this.guessedLetters.clear();
        this.attemptsLeft = GAME_CONFIG.maxAttempts;
        this.gameState = 'playing';
        this.hintsUsed = 0;
        
        // Actualizar interfaz
        this.updateDisplay();
        this.updateKeyboard();
        this.clearMessage();
        this.enableControls();
        
        // Animación de inicio
        this.animateNewGame();
    }

    guessLetter(letter) {
        if (this.gameState !== 'playing' || this.guessedLetters.has(letter)) {
            return;
        }

        this.guessedLetters.add(letter);
        const keyElement = document.querySelector(`[data-letter="${letter}"]`);
        
        if (this.currentWord.word.includes(letter)) {
            // Letra correcta
            keyElement.classList.add('correct');
            this.showMessage('¡Correcto! 🎉', 'success');
            this.animateCorrectLetter(letter);
        } else {
            // Letra incorrecta
            this.attemptsLeft--;
            keyElement.disabled = true;
            this.showMessage('¡Incorrecto! 💀', 'error');
            this.animateWrongLetter(letter);
        }

        this.updateDisplay();
        this.updateKeyboard();
        this.checkGameEnd();
    }

    useHint() {
        if (this.hintsUsed >= 2 || this.gameState !== 'playing') {
            return;
        }

        this.hintsUsed++;
        const unusedLetters = this.currentWord.word
            .split('')
            .filter(letter => !this.guessedLetters.has(letter));
        
        if (unusedLetters.length > 0) {
            const randomLetter = unusedLetters[Math.floor(Math.random() * unusedLetters.length)];
            this.guessedLetters.add(randomLetter);
            this.showMessage(`Pista: La palabra contiene la letra "${randomLetter.toUpperCase()}" 💡`, 'success');
            this.updateDisplay();
            this.updateKeyboard();
            this.checkGameEnd();
        }
    }

    checkGameEnd() {
        const isWordComplete = this.currentWord.word
            .split('')
            .every(letter => this.guessedLetters.has(letter));

        if (isWordComplete) {
            this.gameWon();
        } else if (this.attemptsLeft === 0) {
            this.gameLost();
        }
    }

    gameWon() {
        this.gameState = 'won';
        this.streak++;
        this.gamesPlayed++;
        
        const baseScore = GAME_CONFIG.baseScore;
        const attemptBonus = this.attemptsLeft * GAME_CONFIG.bonusPerAttempt;
        const hintPenalty = this.hintsUsed * GAME_CONFIG.hintPenalty;
        const streakBonus = Math.floor(this.streak * 10);
        
        const roundScore = Math.max(0, baseScore + attemptBonus - hintPenalty + streakBonus);
        this.score += roundScore;
        
        this.showResultModal('¡Victoria! 🎉', '¡Has adivinado la palabra!', '🎊', roundScore);
        this.saveStats();
    }

    gameLost() {
        this.gameState = 'lost';
        this.streak = 0;
        this.gamesPlayed++;
        
        this.showResultModal('¡Derrota! 💀', 'Se te acabaron los intentos', '😢', 0);
        this.saveStats();
    }

    // ====== INTERFAZ DE USUARIO ======
    updateDisplay() {
        // Actualizar palabra
        this.wordDisplay.innerHTML = this.currentWord.word
            .split('')
            .map(letter => {
                if (letter === ' ') {
                    return '<span class="letter space"></span>';
                }
                const isGuessed = this.guessedLetters.has(letter);
                return `<span class="letter ${isGuessed ? 'revealed' : ''}">${isGuessed ? letter.toUpperCase() : ''}</span>`;
            })
            .join('');

        // Actualizar pista
        this.wordHint.textContent = this.currentWord.hint;
        
        // Actualizar intentos
        this.attemptsDisplay.textContent = this.attemptsLeft;
        
        // Actualizar categoría
        this.categoryDisplay.textContent = WORDS_DATABASE[this.currentCategory].name;
        
        // Actualizar letras usadas
        this.updateUsedLetters();
        
        // Actualizar estadísticas
        this.updateStats();
    }

    updateKeyboard() {
        this.keys.forEach(key => {
            const letter = key.dataset.letter;
            if (this.guessedLetters.has(letter)) {
                key.disabled = true;
                if (this.currentWord.word.includes(letter)) {
                    key.classList.add('correct');
                }
            } else {
                key.disabled = false;
                key.classList.remove('correct');
            }
        });
    }

    updateUsedLetters() {
        const usedLetters = Array.from(this.guessedLetters)
            .filter(letter => !this.currentWord.word.includes(letter))
            .map(letter => `<span class="used-letter">${letter.toUpperCase()}</span>`)
            .join('');
        
        this.usedLettersDisplay.innerHTML = usedLetters;
    }

    updateStats() {
        this.scoreDisplay.textContent = this.score;
        this.streakDisplay.textContent = this.streak;
        this.gamesDisplay.textContent = this.gamesPlayed;
    }

    showMessage(message, type = '') {
        this.messageDisplay.textContent = message;
        this.messageDisplay.className = `message ${type}`;
        
        setTimeout(() => {
            this.clearMessage();
        }, 3000);
    }

    clearMessage() {
        this.messageDisplay.textContent = '';
        this.messageDisplay.className = 'message';
    }

    showResultModal(title, message, icon, score) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modalIcon.textContent = icon;
        this.modalScore.textContent = score;
        this.modalWord.textContent = this.currentWord.word.toUpperCase();
        
        this.modal.classList.add('show');
        this.disableControls();
    }

    hideModal() {
        this.modal.classList.remove('show');
    }

    enableControls() {
        this.newGameBtn.disabled = false;
        this.hintBtn.disabled = false;
        this.keys.forEach(key => key.disabled = false);
    }

    disableControls() {
        this.newGameBtn.disabled = true;
        this.hintBtn.disabled = true;
        this.keys.forEach(key => key.disabled = true);
    }

    // ====== ANIMACIONES ======
    animateNewGame() {
        this.wordDisplay.style.opacity = '0';
        setTimeout(() => {
            this.wordDisplay.style.opacity = '1';
        }, 100);
    }

    animateCorrectLetter(letter) {
        const letterElements = document.querySelectorAll(`.letter.revealed`);
        letterElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    animateWrongLetter(letter) {
        const keyElement = document.querySelector(`[data-letter="${letter}"]`);
        keyElement.style.animation = 'none';
        setTimeout(() => {
            keyElement.style.animation = 'messageShake 0.5s ease-out';
        }, 10);
    }

    // ====== TEMA ======
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        this.themeToggle.textContent = isLight ? '🌙' : '☀️';
        this.saveTheme();
    }

    // ====== PERSISTENCIA ======
    saveStats() {
        localStorage.setItem('hangman-stats', JSON.stringify({
            score: this.score,
            streak: this.streak,
            gamesPlayed: this.gamesPlayed
        }));
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('hangman-stats') || '{}');
        this.score = stats.score || 0;
        this.streak = stats.streak || 0;
        this.gamesPlayed = stats.gamesPlayed || 0;
        this.updateStats();
    }

    saveTheme() {
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('hangman-theme', isLight ? 'light' : 'dark');
    }

    loadTheme() {
        const theme = localStorage.getItem('hangman-theme') || 'dark';
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            this.themeToggle.textContent = '🌙';
        }
    }
}

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    const game = new HangmanGame();
    game.loadTheme();
});
