// ====== VARIABLES GLOBALES ======
let totalPrimesFound = 0;
let calculationStartTime = 0;

// ====== ELEMENTOS DEL DOM ======
const numberInput = document.getElementById('numberInput');
const checkButton = document.getElementById('checkButton');
const individualResult = document.getElementById('individualResult');
const currentNumberEl = document.getElementById('currentNumber');
const isPrimeResultEl = document.getElementById('isPrimeResult');
const totalPrimesEl = document.getElementById('totalPrimes');
const calculationTimeEl = document.getElementById('calculationTime');

// Rango de primos
const rangeStart = document.getElementById('rangeStart');
const rangeEnd = document.getElementById('rangeEnd');
const generateRangeButton = document.getElementById('generateRangeButton');
const rangeResults = document.getElementById('rangeResults');
const primesCount = document.getElementById('primesCount');
const primesGrid = document.getElementById('primesGrid');
const copyResults = document.getElementById('copyResults');

// Calculadora avanzada
const factorInput = document.getElementById('factorInput');
const factorizeButton = document.getElementById('factorizeButton');
const factorizationResult = document.getElementById('factorizationResult');
const nextPrimeInput = document.getElementById('nextPrimeInput');
const nextPrimeButton = document.getElementById('nextPrimeButton');
const nextPrimeResult = document.getElementById('nextPrimeResult');
const twinPrimesInput = document.getElementById('twinPrimesInput');
const twinPrimesButton = document.getElementById('twinPrimesButton');
const twinPrimesResult = document.getElementById('twinPrimesResult');

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showWelcomeMessage();
});

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Verificador individual
    checkButton.addEventListener('click', checkIndividualNumber);
    numberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkIndividualNumber();
        }
    });

    // Generador de rangos
    generateRangeButton.addEventListener('click', generatePrimeRange);
    copyResults.addEventListener('click', copyPrimesToClipboard);

    // Calculadora avanzada
    factorizeButton.addEventListener('click', factorizeNumber);
    nextPrimeButton.addEventListener('click', findNextPrime);
    twinPrimesButton.addEventListener('click', findTwinPrimes);

    // Eventos de teclado para inputs avanzados
    factorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') factorizeNumber();
    });
    nextPrimeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') findNextPrime();
    });
    twinPrimesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') findTwinPrimes();
    });

    // Focus en el input principal
    numberInput.focus();
}

// ====== FUNCIÓN PRINCIPAL DE VERIFICACIÓN ======
function checkIndividualNumber() {
    const number = parseInt(numberInput.value);
    
    if (!number || number < 1) {
        showNotification('Por favor, introduce un número válido mayor que 0', 'warning');
        return;
    }

    if (number > 999999999) {
        showNotification('El número es demasiado grande. Máximo 999,999,999', 'warning');
        return;
    }

    // Iniciar medición de tiempo
    calculationStartTime = performance.now();
    
    // Verificar si es primo
    const isPrime = isPrimeOptimized(number);
    
    // Calcular tiempo de ejecución
    const calculationTime = performance.now() - calculationStartTime;
    
    // Actualizar estadísticas
    currentNumberEl.textContent = number.toLocaleString();
    isPrimeResultEl.textContent = isPrime ? 'Sí' : 'No';
    calculationTimeEl.textContent = `${calculationTime.toFixed(2)}ms`;
    
    // Mostrar resultado
    showIndividualResult(number, isPrime);
    
    // Efecto de sonido (simulado)
    if (isPrime) {
        playSuccessSound();
    } else {
        playErrorSound();
    }
}

// ====== ALGORITMO OPTIMIZADO PARA VERIFICAR PRIMOS ======
function isPrimeOptimized(n) {
    // Casos especiales
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    // Verificar divisores impares hasta la raíz cuadrada
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }
    
    return true;
}

// ====== MOSTRAR RESULTADO INDIVIDUAL ======
function showIndividualResult(number, isPrime) {
    const resultIcon = individualResult.querySelector('.result-icon');
    const resultText = individualResult.querySelector('.result-text');
    
    // Remover clases anteriores
    individualResult.classList.remove('prime', 'not-prime');
    
    if (isPrime) {
        resultIcon.textContent = '✅';
        resultText.textContent = `${number} es un número primo`;
        individualResult.classList.add('prime');
    } else {
        resultIcon.textContent = '❌';
        resultText.textContent = `${number} no es un número primo`;
        individualResult.classList.add('not-prime');
    }
    
    // Animación
    individualResult.style.animation = 'pulse 0.6s ease';
    setTimeout(() => {
        individualResult.style.animation = '';
    }, 600);
}

// ====== GENERAR RANGO DE PRIMOS ======
function generatePrimeRange() {
    const start = parseInt(rangeStart.value) || 1;
    const end = parseInt(rangeEnd.value) || 100;
    
    if (start < 1 || end < 1) {
        showNotification('Los números deben ser mayores que 0', 'warning');
        return;
    }
    
    if (start > end) {
        showNotification('El número inicial debe ser menor que el final', 'warning');
        return;
    }
    
    if (end - start > 10000) {
        showNotification('El rango es demasiado grande. Máximo 10,000 números', 'warning');
        return;
    }
    
    // Mostrar loading
    generateRangeButton.disabled = true;
    generateRangeButton.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Calculando...</span>';
    
    // Usar setTimeout para no bloquear la UI
    setTimeout(() => {
        const startTime = performance.now();
        const primes = findPrimesInRange(start, end);
        const endTime = performance.now();
        
        displayPrimeRange(primes, start, end, endTime - startTime);
        
        // Restaurar botón
        generateRangeButton.disabled = false;
        generateRangeButton.innerHTML = '<span class="btn-icon">📊</span><span class="btn-text">Generar Primos</span>';
    }, 10);
}

// ====== ENCONTRAR PRIMOS EN RANGO ======
function findPrimesInRange(start, end) {
    const primes = [];
    
    for (let i = start; i <= end; i++) {
        if (isPrimeOptimized(i)) {
            primes.push(i);
        }
    }
    
    return primes;
}

// ====== MOSTRAR RANGO DE PRIMOS ======
function displayPrimeRange(primes, start, end, calculationTime) {
    totalPrimesFound = primes.length;
    totalPrimesEl.textContent = totalPrimesFound;
    
    primesCount.textContent = totalPrimesFound;
    
    // Limpiar grid anterior
    primesGrid.innerHTML = '';
    
    // Crear elementos para cada primo
    primes.forEach((prime, index) => {
        const primeElement = document.createElement('div');
        primeElement.className = 'prime-number';
        primeElement.textContent = prime;
        primeElement.style.animationDelay = `${index * 0.05}s`;
        primesGrid.appendChild(primeElement);
    });
    
    // Mostrar resultados
    rangeResults.classList.add('show');
    
    // Mostrar notificación
    showNotification(
        `Encontrados ${totalPrimesFound} primos entre ${start} y ${end} en ${calculationTime.toFixed(2)}ms`,
        'success'
    );
}

// ====== COPIAR PRIMOS AL PORTAPAPELES ======
function copyPrimesToClipboard() {
    const primeElements = primesGrid.querySelectorAll('.prime-number');
    const primes = Array.from(primeElements).map(el => el.textContent);
    
    if (primes.length === 0) {
        showNotification('No hay primos para copiar', 'warning');
        return;
    }
    
    const text = primes.join(', ');
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Primos copiados al portapapeles', 'success');
        
        // Efecto visual en el botón
        copyResults.innerHTML = '✅ Copiado';
        setTimeout(() => {
            copyResults.innerHTML = '📋 Copiar';
        }, 2000);
    }).catch(() => {
        showNotification('Error al copiar al portapapeles', 'error');
    });
}

// ====== FACTORIZACIÓN DE NÚMEROS ======
function factorizeNumber() {
    const number = parseInt(factorInput.value);
    
    if (!number || number < 2) {
        showNotification('Introduce un número mayor que 1', 'warning');
        return;
    }
    
    if (number > 999999) {
        showNotification('El número es demasiado grande para factorizar', 'warning');
        return;
    }
    
    const startTime = performance.now();
    const factors = getPrimeFactors(number);
    const endTime = performance.now();
    
    displayFactorization(number, factors, endTime - startTime);
}

// ====== OBTENER FACTORES PRIMOS ======
function getPrimeFactors(n) {
    const factors = [];
    let divisor = 2;
    
    while (n > 1) {
        while (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
        }
        divisor++;
    }
    
    return factors;
}

// ====== MOSTRAR FACTORIZACIÓN ======
function displayFactorization(number, factors, calculationTime) {
    factorizationResult.innerHTML = '';
    
    if (factors.length === 1) {
        factorizationResult.innerHTML = `
            <div><strong>${number}</strong> es un número primo</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                Tiempo: ${calculationTime.toFixed(2)}ms
            </div>
        `;
    } else {
        const factorElements = factors.map(factor => 
            `<span class="factor-item">${factor}</span>`
        ).join(' × ');
        
        factorizationResult.innerHTML = `
            <div><strong>${number}</strong> = ${factorElements}</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                Tiempo: ${calculationTime.toFixed(2)}ms
            </div>
        `;
    }
    
    factorizationResult.classList.add('show');
}

// ====== ENCONTRAR SIGUIENTE PRIMO ======
function findNextPrime() {
    const number = parseInt(nextPrimeInput.value);
    
    if (!number || number < 1) {
        showNotification('Introduce un número válido', 'warning');
        return;
    }
    
    if (number > 999999999) {
        showNotification('El número es demasiado grande', 'warning');
        return;
    }
    
    const startTime = performance.now();
    const nextPrime = findNextPrimeNumber(number);
    const endTime = performance.now();
    
    displayNextPrime(number, nextPrime, endTime - startTime);
}

// ====== ALGORITMO PARA ENCONTRAR SIGUIENTE PRIMO ======
function findNextPrimeNumber(n) {
    let candidate = n + 1;
    
    // Si n es par, empezar con el siguiente impar
    if (candidate % 2 === 0) candidate++;
    
    while (!isPrimeOptimized(candidate)) {
        candidate += 2;
    }
    
    return candidate;
}

// ====== MOSTRAR SIGUIENTE PRIMO ======
function displayNextPrime(number, nextPrime, calculationTime) {
    nextPrimeResult.innerHTML = `
        <div>El siguiente primo después de <strong>${number}</strong> es <strong>${nextPrime}</strong></div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
            Tiempo: ${calculationTime.toFixed(2)}ms
        </div>
    `;
    
    nextPrimeResult.classList.add('show');
}

// ====== ENCONTRAR PRIMOS GEMELOS ======
function findTwinPrimes() {
    const limit = parseInt(twinPrimesInput.value);
    
    if (!limit || limit < 5) {
        showNotification('Introduce un límite mayor que 4', 'warning');
        return;
    }
    
    if (limit > 100000) {
        showNotification('El límite es demasiado grande. Máximo 100,000', 'warning');
        return;
    }
    
    const startTime = performance.now();
    const twinPrimes = findTwinPrimesUpTo(limit);
    const endTime = performance.now();
    
    displayTwinPrimes(twinPrimes, limit, endTime - startTime);
}

// ====== ALGORITMO PARA ENCONTRAR PRIMOS GEMELOS ======
function findTwinPrimesUpTo(limit) {
    const twins = [];
    
    for (let i = 3; i <= limit - 2; i += 2) {
        if (isPrimeOptimized(i) && isPrimeOptimized(i + 2)) {
            twins.push([i, i + 2]);
        }
    }
    
    return twins;
}

// ====== MOSTRAR PRIMOS GEMELOS ======
function displayTwinPrimes(twins, limit, calculationTime) {
    if (twins.length === 0) {
        twinPrimesResult.innerHTML = `
            <div>No se encontraron primos gemelos hasta ${limit}</div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                Tiempo: ${calculationTime.toFixed(2)}ms
            </div>
        `;
    } else {
        const twinElements = twins.slice(0, 10).map(twin => 
            `<span class="twin-pair">(${twin[0]}, ${twin[1]})</span>`
        ).join(' ');
        
        const moreText = twins.length > 10 ? 
            `<div style="margin-top: 0.5rem; color: var(--text-secondary);">... y ${twins.length - 10} más</div>` : '';
        
        twinPrimesResult.innerHTML = `
            <div>Primos gemelos hasta ${limit}:</div>
            <div style="margin-top: 0.5rem;">${twinElements}</div>
            ${moreText}
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                Total: ${twins.length} pares • Tiempo: ${calculationTime.toFixed(2)}ms
            </div>
        `;
    }
    
    twinPrimesResult.classList.add('show');
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

// ====== EFECTOS DE SONIDO (SIMULADOS) ======
function playSuccessSound() {
    console.log('🔊 Sonido de éxito');
}

function playErrorSound() {
    console.log('🔊 Sonido de error');
}

// ====== MENSAJE DE BIENVENIDA ======
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('¡Bienvenido! Explora todas las herramientas para trabajar con números primos.', 'info');
    }, 1000);
} 