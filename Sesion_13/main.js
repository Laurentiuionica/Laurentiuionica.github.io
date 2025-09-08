// Referencias a elementos del DOM
const elementos = {
  foto: document.getElementById('photo'),
  titulo: document.getElementById('title'),
  descripcion: document.getElementById('desc'),
  anterior: document.getElementById('anterior'),
  siguiente: document.getElementById('siguiente'),
  miniaturas: document.getElementById('miniaturas'),
  reproducir: document.getElementById('reproducir'),
  velocidad: document.getElementById('velocidad')
};

// Listado de imágenes a mostrar
const imagenes = [
  { src: 'imagenes/img07.jpg', titulo: 'Imagen 1', descripcion: 'Imagen personalizada 1' },
  { src: 'imagenes/img7.jpg', titulo: 'Imagen 2', descripcion: 'Imagen personalizada 2' },
  { src: 'imagenes/img77.jpg', titulo: 'Imagen 3', descripcion: 'Imagen personalizada 3' },
  { src: 'imagenes/img777.jpg', titulo: 'Imagen 4', descripcion: 'Imagen personalizada 4' },
  { src: 'imagenes/img7777.webp', titulo: 'Imagen 5', descripcion: 'Imagen personalizada 5' },
  { src: 'imagenes/img77777.jpg_large', titulo: 'Imagen 6', descripcion: 'Imagen personalizada 6' }
];

// Estado de la galería
let indice = 0;
let reproduciendo = false;
let temporizador = null;

iniciar();

function iniciar() {
  construirMiniaturas();
  enlazarEventos();
  mostrar(0);
}

// Eventos de botones y teclado
function enlazarEventos() {
  elementos.anterior.addEventListener('click', irAnterior);
  elementos.siguiente.addEventListener('click', irSiguiente);
  elementos.reproducir.addEventListener('click', alternarReproduccion);
  elementos.velocidad.addEventListener('input', reiniciarAutoplay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') irAnterior();
    if (e.key === 'ArrowRight') irSiguiente();
    if (e.key === ' ') alternarReproduccion();
  });
}

// Crea las miniaturas clicables
function construirMiniaturas() {
  elementos.miniaturas.innerHTML = '';
  imagenes.forEach((item, idx) => {
    const boton = document.createElement('button');
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.titulo;
    boton.appendChild(img);
    boton.addEventListener('click', () => mostrar(idx));
    elementos.miniaturas.appendChild(boton);
  });
}

// Muestra la imagen actual
function mostrar(idx) {
  indice = (idx + imagenes.length) % imagenes.length;
  elementos.foto.src = imagenes[indice].src;
  elementos.foto.alt = imagenes[indice].titulo;
  elementos.titulo.textContent = imagenes[indice].titulo;
  elementos.descripcion.textContent = imagenes[indice].descripcion;
  actualizarMiniaturaActiva();
}

// Marca visualmente la miniatura activa
function actualizarMiniaturaActiva() {
  [...elementos.miniaturas.children].forEach((b, i) => b.classList.toggle('active', i === indice));
}

function irAnterior() { mostrar(indice - 1); }
function irSiguiente() { mostrar(indice + 1); }

// Reproduce automáticamente pasando de imagen cada X segundos
function alternarReproduccion() {
  reproduciendo = !reproduciendo;
  elementos.reproducir.textContent = reproduciendo ? 'Pausar' : 'Reproducir';
  reiniciarAutoplay();
}

function reiniciarAutoplay() {
  if (temporizador) clearInterval(temporizador);
  if (reproduciendo) {
    const ms = parseInt(elementos.velocidad.value, 10) * 1000;
    temporizador = setInterval(irSiguiente, ms);
  }
}

// Limpieza del temporizador al cerrar
window.addEventListener('beforeunload', () => { if (temporizador) clearInterval(temporizador); });

