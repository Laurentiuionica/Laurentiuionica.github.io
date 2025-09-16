// Juego: 10 rondas, 4 opciones
// Interfaz: referencias a elementos del DOM 
const interfaz = {
  bandera: document.getElementById('bandera'),
  opciones: document.getElementById('opciones'),
  mensaje: document.getElementById('mensaje'),
  siguiente: document.getElementById('siguiente'),
  reiniciar: document.getElementById('reiniciar'),
  ronda: document.getElementById('ronda'),
  total: document.getElementById('total'),
  aciertos: document.getElementById('aciertos'),
  tplOpcion: document.getElementById('tplOpcion')
};

// Estado del juego: datos y progreso actual
const estado = { paises: [], seleccion: [], ronda: 0, total: 10, aciertos: 0, actual: null };

document.addEventListener('DOMContentLoaded', () => {
  interfaz.total.textContent = estado.total;
  interfaz.reiniciar.addEventListener('click', iniciar);
  interfaz.siguiente.addEventListener('click', siguienteRonda);
  iniciar();
});

// Inicia o reinicia la partida
async function iniciar() {
  interfaz.siguiente.disabled = true;
  interfaz.mensaje.textContent = '';
  interfaz.opciones.innerHTML = '';
  estado.ronda = 0;
  estado.aciertos = 0;
  interfaz.aciertos.textContent = '0';

  if (!estado.paises.length) {
    await cargarPaises();
  }

  // Elegimos 10 países aleatorios para esta partida
  estado.seleccion = barajar([...estado.paises]).slice(0, estado.total);
  siguienteRonda();
}

// Descarga países (nombre en español y bandera) de la API pública
async function cargarPaises() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,translations,flags');
    const data = await res.json();
    estado.paises = data
      .filter(c => c?.translations?.spa?.common && (c?.flags?.svg || c?.flags?.png))
      .map(c => ({ nombre: c.translations.spa.common, bandera: c.flags.svg || c.flags.png }));
  } catch (e) {
    interfaz.mensaje.textContent = 'Error cargando países. Reintenta.';
  }
}

// Prepara la siguiente pregunta
function siguienteRonda() {
  if (estado.ronda >= estado.total) {
    interfaz.mensaje.textContent = `Fin: acertaste ${estado.aciertos}/${estado.total}`;
    interfaz.siguiente.disabled = true;
    return;
  }

  interfaz.siguiente.disabled = true;
  interfaz.mensaje.textContent = '';
  interfaz.opciones.innerHTML = '';
  interfaz.ronda.textContent = String(estado.ronda + 1);

  // País objetivo y bandera
  estado.actual = estado.seleccion[estado.ronda];
  interfaz.bandera.src = estado.actual.bandera;
  interfaz.bandera.alt = `Bandera de ${estado.actual.nombre}`;

  // Opciones: 1 correcta + 3 incorrectas mezcladas
  const incorrectas = barajar(estado.paises.filter(c => c.nombre !== estado.actual.nombre)).slice(0, 3);
  const opciones = barajar([estado.actual, ...incorrectas]);

  opciones.forEach(op => {
    const btn = interfaz.tplOpcion.content.firstElementChild.cloneNode(true);
    btn.textContent = op.nombre;
    btn.addEventListener('click', () => elegir(op, btn));
    interfaz.opciones.appendChild(btn);
  });

  estado.ronda++;
}

// Gestiona la respuesta del usuario
function elegir(opcion, boton) {
  const esCorrecta = opcion.nombre === estado.actual.nombre;
  if (esCorrecta) {
    boton.classList.add('correct');
    interfaz.mensaje.textContent = '¡Correcto!';
    estado.aciertos++;
    interfaz.aciertos.textContent = String(estado.aciertos);
  } else {
    boton.classList.add('wrong');
    interfaz.mensaje.textContent = `Incorrecto. Era ${estado.actual.nombre}`;
    // Marca la opción correcta para que se vea
    [...interfaz.opciones.children].forEach(b => {
      if (b.textContent === estado.actual.nombre) b.classList.add('correct');
    });
  }

  // Bloquea las opciones hasta pasar a la siguiente
  [...interfaz.opciones.children].forEach(b => b.disabled = true);
  interfaz.siguiente.disabled = false;
}

// Utilidad: barajar array (Fisher–Yates)
function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
} 