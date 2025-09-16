// Coordenadas del Ratón - versión simple en español
(function () {
    "use strict";

    // Elementos de la interfaz
    const zona = document.getElementById("zona");
    const punto = document.getElementById("punto");
    const guiaX = document.getElementById("guia-x");
    const guiaY = document.getElementById("guia-y");
    const tooltip = document.getElementById("tooltip");

    const elX = document.getElementById("x");
    const elY = document.getElementById("y");
    const elPag = document.getElementById("pag");
    const elVent = document.getElementById("vent");

    const btnLimpiar = document.getElementById("btn-limpiar");
    const btnCopiar = document.getElementById("btn-copiar");

    let puntoFijado = null; // {x, y} relativo a la zona

    function obtenerPosicionDesdeEvento(e) {
        // Soporte ratón y táctil
        let pageX, pageY, clientX, clientY;
        if (e.touches && e.touches[0]) {
            const t = e.touches[0];
            pageX = t.pageX; pageY = t.pageY; clientX = t.clientX; clientY = t.clientY;
        } else {
            pageX = e.pageX; pageY = e.pageY; clientX = e.clientX; clientY = e.clientY;
        }
        const rect = zona.getBoundingClientRect();
        const relativoZonaX = Math.round(clientX - rect.left);
        const relativoZonaY = Math.round(clientY - rect.top);
        return { relativoZonaX, relativoZonaY, pageX: Math.round(pageX), pageY: Math.round(pageY), clientX: Math.round(clientX), clientY: Math.round(clientY), rect };
    }

    function actualizarUI(pos) {
        // Limita dentro de la zona para dibujar
        const x = Math.max(0, Math.min(pos.relativoZonaX, pos.rect.width));
        const y = Math.max(0, Math.min(pos.relativoZonaY, pos.rect.height));

        // Mover guías
        guiaX.style.top = y + "px";
        guiaY.style.left = x + "px";

        // Mover punto y tooltip
        punto.style.left = x + "px";
        punto.style.top = y + "px";
        tooltip.style.left = x + "px";
        tooltip.style.top = y + "px";

        // Mostrar valores
        elX.textContent = x;
        elY.textContent = y;
        elPag.textContent = `( ${pos.pageX}, ${pos.pageY} )`;
        elVent.textContent = `( ${pos.clientX}, ${pos.clientY} )`;

        tooltip.textContent = `(${x}, ${y})`;

        // Asegurar visibles
        punto.classList.remove("oculto");
        tooltip.classList.remove("oculto");
    }

    function mover(e) {
        const pos = obtenerPosicionDesdeEvento(e);
        if (!puntoFijado) {
            actualizarUI(pos);
        }
    }

    function fijar(e) {
        const pos = obtenerPosicionDesdeEvento(e);
        puntoFijado = { x: Math.max(0, Math.min(pos.relativoZonaX, pos.rect.width)), y: Math.max(0, Math.min(pos.relativoZonaY, pos.rect.height)) };
        actualizarUI(pos);
    }

    function limpiar() {
        puntoFijado = null;
        punto.classList.add("oculto");
        tooltip.classList.add("oculto");
        elX.textContent = "";
        elY.textContent = "";
        elPag.textContent = "";
        elVent.textContent = "";
    }

    function copiar() {
        const x = elX.textContent;
        const y = elY.textContent;
        if (!x || !y) return;
        const texto = `(${x}, ${y})`;
        navigator.clipboard?.writeText(texto);
        btnCopiar.textContent = "Copiado";
        setTimeout(() => { btnCopiar.textContent = "Copiar (x, y)"; }, 1000);
    }

    // Eventos
    zona.addEventListener("mousemove", mover);
    zona.addEventListener("touchmove", (e) => { mover(e); }, { passive: true });

    zona.addEventListener("click", fijar);
    zona.addEventListener("touchstart", (e) => { fijar(e); }, { passive: true });

    btnLimpiar.addEventListener("click", limpiar);
    btnCopiar.addEventListener("click", copiar);

    // Accesibilidad: teclado (flechas) cuando la zona tiene foco
    zona.addEventListener("keydown", (e) => {
        if (!puntoFijado) return;
        let dx = 0, dy = 0;
        if (e.key === "ArrowLeft") dx = -1;
        else if (e.key === "ArrowRight") dx = 1;
        else if (e.key === "ArrowUp") dy = -1;
        else if (e.key === "ArrowDown") dy = 1;
        else return;
        e.preventDefault();
        const rect = zona.getBoundingClientRect();
        const nuevo = {
            relativoZonaX: Math.max(0, Math.min(puntoFijado.x + dx, rect.width)),
            relativoZonaY: Math.max(0, Math.min(puntoFijado.y + dy, rect.height)),
            pageX: 0, pageY: 0, clientX: 0, clientY: 0, rect
        };
        puntoFijado.x = nuevo.relativoZonaX;
        puntoFijado.y = nuevo.relativoZonaY;
        actualizarUI(nuevo);
    });

    // Estado inicial
    limpiar();
})();
