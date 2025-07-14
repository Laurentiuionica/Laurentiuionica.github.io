// ====== VARIABLES GLOBALES ======
const API_BASE_URL = 'https://api.github.com/search/repositories';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let searchCache = new Map();
let currentSearch = '';

// ====== ELEMENTOS DEL DOM ======
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const languageFilter = document.getElementById('languageFilter');
const sortFilter = document.getElementById('sortFilter');
const resultsContainer = document.getElementById('results');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const resultTemplate = document.getElementById('resultTemplate');

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    showWelcomeMessage();
});

// ====== CONFIGURACIÓN INICIAL ======
function initializeApp() {
    // Cargar búsquedas recientes del localStorage
    loadRecentSearches();
    
    // Mostrar sugerencias de búsqueda
    showSearchSuggestions();
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Búsqueda con Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Búsqueda con botón
    searchButton.addEventListener('click', performSearch);

    // Búsqueda instantánea (con debounce)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (e.target.value.length >= 3) {
                performSearch();
            } else if (e.target.value.length === 0) {
                clearResults();
            }
        }, 500);
    });

    // Filtros
    languageFilter.addEventListener('change', () => {
        if (currentSearch) {
            performSearch();
        }
    });

    sortFilter.addEventListener('change', () => {
        if (currentSearch) {
            performSearch();
        }
    });

    // Focus en el input al cargar
    searchInput.focus();
}

// ====== FUNCIÓN PRINCIPAL DE BÚSQUEDA ======
async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('Por favor, introduce un término de búsqueda', 'warning');
        return;
    }

    currentSearch = query;
    showLoading(true);
    hideNoResults();
    
    try {
        const results = await searchRepositories(query);
        displayResults(results);
        saveRecentSearch(query);
        showNotification(`Encontrados ${results.length} repositorios`, 'success');
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showNotification('Error al buscar repositorios. Inténtalo de nuevo.', 'error');
        hideLoading();
    }
}

// ====== BÚSQUEDA DE REPOSITORIOS ======
async function searchRepositories(query) {
    const cacheKey = generateCacheKey(query);
    
    // Verificar cache
    if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
    }

    // Construir URL con filtros
    const params = new URLSearchParams({
        q: query,
        sort: sortFilter.value,
        order: 'desc',
        per_page: 30
    });

    if (languageFilter.value) {
        params.set('q', `${query} language:${languageFilter.value}`);
    }

    const response = await fetch(`${API_BASE_URL}?${params}`);
    
    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('Límite de API excedido. Inténtalo más tarde.');
        }
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Guardar en cache
    searchCache.set(cacheKey, {
        data: data.items,
        timestamp: Date.now()
    });

    return data.items;
}

// ====== MOSTRAR RESULTADOS ======
function displayResults(repositories) {
    hideLoading();
    
    if (!repositories || repositories.length === 0) {
        showNoResults();
        return;
    }

    // Actualizar título y contador
    resultsTitle.textContent = `Resultados para "${currentSearch}"`;
    resultsCount.textContent = `${repositories.length} repositorios encontrados`;

    // Limpiar resultados anteriores
    resultsContainer.innerHTML = '';

    // Crear y mostrar tarjetas
    repositories.forEach((repo, index) => {
        const card = createResultCard(repo, index);
        resultsContainer.appendChild(card);
    });

    // Animar entrada de tarjetas
    animateCards();
}

// ====== CREAR TARJETA DE RESULTADO ======
function createResultCard(repo, index) {
    const template = resultTemplate.content.cloneNode(true);
    const card = template.querySelector('.result-card');
    
    // Configurar datos
    card.querySelector('.repo-name').textContent = repo.full_name;
    card.querySelector('.repo-description').textContent = 
        repo.description || 'Sin descripción disponible';
    card.querySelector('.stat.stars .stat-value').textContent = 
        formatNumber(repo.stargazers_count);
    card.querySelector('.stat.forks .stat-value').textContent = 
        formatNumber(repo.forks_count);
    card.querySelector('.language-badge').textContent = 
        repo.language || 'Sin especificar';
    card.querySelector('.last-updated').textContent = 
        `Actualizado ${formatDate(repo.updated_at)}`;
    card.querySelector('.view-btn').href = repo.html_url;

    // Configurar color del lenguaje
    const languageBadge = card.querySelector('.language-badge');
    languageBadge.style.background = getLanguageColor(repo.language);

    // Añadir delay para animación
    card.style.animationDelay = `${index * 0.1}s`;

    return card;
}

// ====== ANIMACIONES ======
function animateCards() {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ====== FUNCIONES DE UTILIDAD ======
function generateCacheKey(query) {
    return `${query}-${languageFilter.value}-${sortFilter.value}`;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'hoy';
    } else if (diffDays < 7) {
        return `hace ${diffDays} días`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)',
        'Python': 'linear-gradient(135deg, #3776ab 0%, #ffde57 100%)',
        'Java': 'linear-gradient(135deg, #007396 0%, #ed8b00 100%)',
        'C++': 'linear-gradient(135deg, #00599c 0%, #004482 100%)',
        'C#': 'linear-gradient(135deg, #178600 0%, #5c2d91 100%)',
        'PHP': 'linear-gradient(135deg, #777bb4 0%, #4f5d95 100%)',
        'Ruby': 'linear-gradient(135deg, #cc342d 0%, #a02c2c 100%)',
        'Go': 'linear-gradient(135deg, #00add8 0%, #007d9c 100%)',
        'Rust': 'linear-gradient(135deg, #ce422b 0%, #a73e3e 100%)',
        'Swift': 'linear-gradient(135deg, #ffac45 0%, #ff6b35 100%)'
    };
    
    return colors[language] || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
}

// ====== GESTIÓN DE ESTADOS ======
function showLoading(show) {
    if (show) {
        loadingElement.classList.add('show');
    } else {
        loadingElement.classList.remove('show');
    }
}

function hideLoading() {
    loadingElement.classList.remove('show');
}

function showNoResults() {
    noResultsElement.classList.add('show');
    resultsTitle.textContent = `No se encontraron resultados para "${currentSearch}"`;
    resultsCount.textContent = '0 repositorios encontrados';
}

function hideNoResults() {
    noResultsElement.classList.remove('show');
}

function clearResults() {
    resultsContainer.innerHTML = '';
    resultsTitle.textContent = 'Resultados de búsqueda';
    resultsCount.textContent = '';
    hideNoResults();
    currentSearch = '';
}

// ====== NOTIFICACIONES ======
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;

    // Añadir estilos
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

    // Añadir al DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Configurar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
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

// ====== BÚSQUEDAS RECIENTES ======
function saveRecentSearch(query) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentSearches = recentSearches.filter(search => search !== query);
    recentSearches.unshift(query);
    recentSearches = recentSearches.slice(0, 5); // Mantener solo 5
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    return recentSearches;
}

// ====== SUGERENCIAS DE BÚSQUEDA ======
function showSearchSuggestions() {
    const suggestions = [
        'react',
        'vue.js',
        'angular',
        'node.js',
        'python',
        'machine learning',
        'web development',
        'mobile app',
        'game development',
        'data science'
    ];

    // Crear sugerencias si no hay búsquedas recientes
    if (loadRecentSearches().length === 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.innerHTML = `
            <h3>💡 Sugerencias de búsqueda</h3>
            <div class="suggestions-grid">
                ${suggestions.map(suggestion => 
                    `<button class="suggestion-btn" onclick="searchInput.value='${suggestion}';performSearch()">${suggestion}</button>`
                ).join('')}
            </div>
        `;

        // Insertar después del header
        const header = document.querySelector('.app-header');
        header.parentNode.insertBefore(suggestionsContainer, header.nextSibling);
    }
}

// ====== MENSAJE DE BIENVENIDA ======
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('¡Bienvenido! Busca repositorios, frameworks o cualquier tecnología que te interese.', 'info');
    }, 1000);
}

// ====== LIMPIEZA DE CACHE ======
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of searchCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            searchCache.delete(key);
        }
    }
}, 60000); // Limpiar cada minuto
