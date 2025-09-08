// Juego del Ahorcado 
(function () {
    "use strict";

    // Lista de palabras con su pista
    const listaPalabras = [
        { texto: "javascript", pista: "Lenguaje de la web" },
        { texto: "navegador", pista: "Donde ejecutas páginas web" },
        { texto: "computadora", pista: "Máquina para programar" },
        { texto: "teclado", pista: "Sirve para escribir" },
        { texto: "monitor", pista: "Pantalla del ordenador" },
        { texto: "algoritmo", pista: "Conjunto de pasos" },
        { texto: "variable", pista: "Guarda un valor" },
        { texto: "funcion", pista: "Bloque reutilizable" },
        { texto: "objeto", pista: "Colección de pares clave-valor" },
        { texto: "modulo", pista: "Agrupa código" }
    ];

    const maximosFallos = 6; // cabeza, tronco, 2 brazos, 2 piernas

    // Referencias a elementos de la página
    const elPalabra = document.getElementById("palabra");
    const elPista = document.getElementById("pista");
    const elEntrada = document.getElementById("letra");
    const btnProbar = document.getElementById("btn-probar");
    const btnNueva = document.getElementById("btn-nueva");
    const elLetrasUsadas = document.getElementById("letras-usadas");
    const elEstado = document.getElementById("estado");

    const partesCuerpo = [
        document.getElementById("parte-cabeza"),
        document.getElementById("parte-tronco"),
        document.getElementById("parte-brazo-izq"),
        document.getElementById("parte-brazo-der"),
        document.getElementById("parte-pierna-izq"),
        document.getElementById("parte-pierna-der"),
    ];

    let palabraSecreta = "";
    let textoPista = "";
    let letrasAdivinadas = new Set();
    let letrasErroneas = new Set();

    // Escoge una palabra al azar
    function escogerPalabra() {
        const seleccion = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
        palabraSecreta = (seleccion.texto || "").toLowerCase();
        textoPista = seleccion.pista || "";
    }

    // Dibuja la palabra con casillas
    function pintarPalabra() {
        elPalabra.innerHTML = "";
        for (const caracter of palabraSecreta) {
            const casilla = document.createElement("span");
            casilla.className = "casilla";
            casilla.textContent = caracter === " " ? "" : (letrasAdivinadas.has(caracter) ? caracter.toUpperCase() : "");
            elPalabra.appendChild(casilla);
        }
    }

    function pintarPista() {
        elPista.textContent = textoPista ? `Pista: ${textoPista}` : "";
    }

    function pintarLetrasUsadas() {
        elLetrasUsadas.innerHTML = "";
        const todas = Array.from(letrasAdivinadas).concat(Array.from(letrasErroneas));
        for (const letra of todas.sort()) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "etiqueta";
            etiqueta.textContent = letra.toUpperCase();
            elLetrasUsadas.appendChild(etiqueta);
        }
    }

    function pintarFallos() {
        const fallos = letrasErroneas.size;
        partesCuerpo.forEach((elemento, indice) => {
            if (!elemento) return;
            elemento.classList.toggle("oculto", indice >= fallos);
        });
    }

    function mostrarEstado(mensaje, tipo) {
        elEstado.textContent = mensaje || "";
        elEstado.className = `estado${tipo ? " " + tipo : ""}`;
    }

    function haGanado() {
        for (const c of palabraSecreta) {
            if (c === " ") continue;
            if (!letrasAdivinadas.has(c)) return false;
        }
        return true;
    }

    function haPerdido() {
        return letrasErroneas.size >= maximosFallos;
    }

    // Intenta una letra
    function probarLetra(entrada) {
        if (!entrada) return;
        const letra = limpiarLetra(entrada);
        if (!letra) return;
        if (letrasAdivinadas.has(letra) || letrasErroneas.has(letra)) return;

        if (palabraSecreta.includes(letra)) {
            letrasAdivinadas.add(letra);
            pintarPalabra();
            pintarLetrasUsadas();
            mostrarEstado("¡Bien!", "ganas");
            if (haGanado()) {
                mostrarEstado("¡Has ganado!", "ganas");
                bloquearEntrada(true);
            }
        } else {
            letrasErroneas.add(letra);
            pintarLetrasUsadas();
            pintarFallos();
            mostrarEstado("Fallaste", "pierdes");
            if (haPerdido()) {
                mostrarEstado(`Perdiste. Era: ${palabraSecreta.toUpperCase()}`, "pierdes");
                revelarPalabra();
                bloquearEntrada(true);
            }
        }
    }

    // Convierte a minúscula y quita tildes; valida que sea 1 letra
    function limpiarLetra(valor) {
        const s = valor.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        const m = s.match(/^[a-zñ]$/);
        return m ? m[0] : "";
    }

    function revelarPalabra() {
        letrasAdivinadas = new Set(palabraSecreta.replace(/ /g, "").split(""));
        pintarPalabra();
    }

    function bloquearEntrada(bloquear) {
        elEntrada.disabled = bloquear;
        btnProbar.disabled = bloquear;
    }

    // Comienza o reinicia el juego
    function reiniciar() {
        letrasAdivinadas.clear();
        letrasErroneas.clear();
        partesCuerpo.forEach(e => e && e.classList.add("oculto"));
        escogerPalabra();
        pintarPalabra();
        pintarPista();
        pintarLetrasUsadas();
        pintarFallos();
        mostrarEstado("");
        elEntrada.value = "";
        bloquearEntrada(false);
        elEntrada.focus();
    }

    // Eventos
    btnProbar.addEventListener("click", () => {
        probarLetra(elEntrada.value.trim());
        elEntrada.value = "";
        elEntrada.focus();
    });

    elEntrada.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            btnProbar.click();
        }
    });

    btnNueva.addEventListener("click", reiniciar);

    // Inicio
    reiniciar();
})();
