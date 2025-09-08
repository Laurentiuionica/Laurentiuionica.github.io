// Comprobador de Número Primo 
(function () {
    "use strict";

    // Referencias a la interfaz
    const elNumero = document.getElementById("numero");
    const btnComprobar = document.getElementById("btn-comprobar");
    const btnLimpiar = document.getElementById("btn-limpiar");
    const elResultado = document.getElementById("resultado");
    const elDetalle = document.getElementById("detalle");

    // Devuelve true si n es primo, false si no
    function esPrimo(n) {
        if (!Number.isInteger(n) || n <= 1) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        const limite = Math.floor(Math.sqrt(n));
        for (let i = 3; i <= limite; i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    // Maneja el click en "Comprobar"
    function comprobar() {
        const valor = elNumero.value.trim();
        if (valor === "") {
            mostrar("Por favor, escribe un número.", "", "");
            elNumero.focus();
            return;
        }
        const n = Number(valor);
        if (!Number.isFinite(n)) {
            mostrar("Entrada no válida.", "", "");
            return;
        }

        // Casos especiales claros
        if (!Number.isInteger(n)) {
            mostrar(`${n} no es un entero.`, "ko", "Introduce un número entero.");
            return;
        }
        if (n === 0) {
            mostrar("0 no es un número primo.", "ko", "0 es divisible por cualquier número distinto de 0.");
            return;
        }
        if (n <= 1) {
            mostrar(`${n} no es un número primo.`, "ko", "Por definición, los números <= 1 no son primos.");
            return;
        }

        const primo = esPrimo(n);
        if (primo) {
            mostrar(`${n} es un número primo.`, "ok", "Solo es divisible por 1 y por sí mismo.");
        } else {
            // Busca un par de divisores sencillo (d y n/d)
            let divisor = (n % 2 === 0) ? 2 : null;
            if (!divisor) {
                const limite = Math.floor(Math.sqrt(n));
                for (let i = 3; i <= limite; i += 2) {
                    if (n % i === 0) { divisor = i; break; }
                }
            }
            const detalle = divisor ? `Es divisible, por ejemplo, por ${divisor} y ${n / divisor}.` : "No es primo.";
            mostrar(`${n} no es un número primo.`, "ko", detalle);
        }
    }

    function mostrar(texto, clase, detalle) {
        elResultado.textContent = texto;
        elResultado.className = `resultado${clase ? " " + clase : ""}`;
        elDetalle.textContent = detalle || "";
    }

    function limpiar() {
        elNumero.value = "";
        mostrar("", "", "");
        elNumero.focus();
    }

    // Eventos
    btnComprobar.addEventListener("click", comprobar);
    btnLimpiar.addEventListener("click", limpiar);
    elNumero.addEventListener("keydown", (e) => {
        if (e.key === "Enter") comprobar();
    });

    // Estado inicial
    limpiar();
})(); 