document.addEventListener("DOMContentLoaded", () => {
    const palabras = ["gato", "perro", "sol", "luna", "casa"];
    const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];

    let letrasAdivinadas = [];
    let intentosRestantes = 6;

    const mostrarPalabra = document.getElementById("mostrar-palabra");
    const mensaje = document.getElementById("mensaje");
    const input = document.getElementById("input-letra");
    const intentos = document.getElementById("intentos");
    const boton = document.getElementById("probar-letra");
    const imagenAhorcado = document.getElementById("imagen-ahorcado");

    function actualizarPalabra() {
        let resultado = "";
        for (let letra of palabraSecreta) {
            if (letrasAdivinadas.includes(letra)) {
                resultado += letra + " ";
            } else {
                resultado += "_ ";
            }
        }
        mostrarPalabra.textContent = resultado.trim();
    }

    actualizarPalabra();

    boton.addEventListener("click", () => {
        const letra = input.value.toLowerCase();
        input.value = "";

        if (letra && !letrasAdivinadas.includes(letra)) {
            if (palabraSecreta.includes(letra)) {
                letrasAdivinadas.push(letra);
            } else {
                intentosRestantes--;
                intentos.textContent = `Intentos restantes: ${intentosRestantes}`;
                imagenAhorcado.src = `imagenes/ahorcado${6 - intentosRestantes}.png`;
            }

            actualizarPalabra();
            verificarEstado();
        }
    });

    function verificarEstado() {
        let ganaste = true;
        for (let letra of palabraSecreta) {
            if (!letrasAdivinadas.includes(letra)) {
                ganaste = false;
                break;
            }
        }

        if (ganaste) {
            mensaje.textContent = "✅ ¡Ganaste!";
            input.disabled = true;
            boton.disabled = true;
        } else if (intentosRestantes === 0) {
            mensaje.textContent = `💀 Perdiste. La palabra era: ${palabraSecreta}`;
            input.disabled = true;
            boton.disabled = true;
        }
    }


});
