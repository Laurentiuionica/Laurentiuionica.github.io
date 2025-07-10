/* ------------------------------ Variables globales ------------------------------ */
let midatos        = null;      // array con todos los países (nombre ES + banderas)
let paises         = [];        // referencia a midatos (por comodidad)
let seleccionados  = [];        // 10 países para la partida
let correcto       = null;      // país correcto de la ronda actual

let rondaActual    = 0;
const maxRondas    = 10;
let puntuacion     = 0;

const btnSiguiente = document.getElementById("siguiente");
const btnReiniciar = document.getElementById("reiniciar");
btnReiniciar.addEventListener("click", reiniciarJuego);

/*Cargar paises*/
let respuesta = fetch("https://restcountries.com/v3.1/all?fields=translations,flags")
  .then(response =>response.json() 
   )
  .then(datos => {
    console.log(datos);
    midatos       = datos;
    paises        = midatos;                                          
    seleccionados = paises.sort(() => 0.5 - Math.random()).slice(0, maxRondas);

    btnSiguiente.disabled = false;
    iniciarJuego();
  })
  .catch(ex => console.log(ex));

/*Iniciar juego*/
function iniciarJuego() {
  btnSiguiente.addEventListener("click", nuevaRonda);
  nuevaRonda();
}

/* Nueva ronda */
function nuevaRonda() {
  const flagImg   = document.getElementById("bandera");
  const contOpts  = document.getElementById("opciones");
  const resultado = document.getElementById("resultado");
  const marcador  = document.getElementById("puntuacion");

  resultado.textContent = "";

  // Fin del juego
  if (rondaActual >= maxRondas) {
    flagImg.style.display = "none";
    contOpts.innerHTML    = "";
    resultado.textContent = `🎉 ¡Juego terminado! Aciertos: ${puntuacion} de ${maxRondas}.`;
    resultado.style.color = "#222";
    marcador.textContent  = `Puntuación final: ${puntuacion} / ${maxRondas}`;
    btnSiguiente.disabled = true;
    btnReiniciar.style.display = "inline-block";
    return;
  }

  // País actual
  const paisObjetivo = seleccionados[rondaActual];
  correcto = paisObjetivo;

  // 3 opciones incorrectas + 1 correcta
  const otras = paises
    .filter(p => p.translations.spa.common)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const opciones = [...otras, paisObjetivo].sort(() => 0.5 - Math.random());

  // Bandera
  flagImg.src   = paisObjetivo.flags.svg || paisObjetivo.flags.png;
  flagImg.alt   = "Bandera misteriosa";
  flagImg.onerror = () => (flagImg.src = paisObjetivo.flags.png);
  flagImg.style.display = "block";

  // Botones de opciones
  contOpts.innerHTML = "";
  opciones.forEach(pais => {
    const btn = document.createElement("button");
    btn.className   = "opcion";
    btn.textContent = pais.translations.spa.common;
    btn.onclick     = () => verificarRespuesta(pais);
    contOpts.appendChild(btn);
  });

  // Marcador
  marcador.textContent = `Puntuación: ${puntuacion} / ${rondaActual}`;
  rondaActual++;
}

/* ------------------------------ Verificar respuesta ------------------------------ */
function verificarRespuesta(paisElegido) {
  const resultado = document.getElementById("resultado");
  const marcador  = document.getElementById("puntuacion");

  if (paisElegido.translations.spa.common === correcto.translations.spa.common) {
    puntuacion++;
    resultado.textContent = "✅ ¡Correcto!";
    resultado.style.color = "green";
  } else {
    resultado.textContent = `❌ Incorrecto. Era ${correcto.translations.spa.common}.`;
    resultado.style.color = "red";
  }

  document.querySelectorAll(".opcion").forEach(b => (b.disabled = true));
  marcador.textContent = `Puntuación: ${puntuacion} / ${rondaActual}`;
}

/* ------------------------------- Reiniciar juego --------------------------------- */
function reiniciarJuego() {
  rondaActual   = 0;
  puntuacion    = 0;
  seleccionados = paises.sort(() => 0.5 - Math.random()).slice(0, maxRondas);

  btnSiguiente.disabled       = false;
  btnReiniciar.style.display  = "none";
  document.getElementById("resultado").textContent   = "";
  document.getElementById("puntuacion").textContent  = "Puntuación: 0 / 0";
  document.getElementById("bandera").style.display   = "block";

  nuevaRonda();
}
