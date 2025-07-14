const rinput = document.getElementById('r');
const ginput = document.getElementById('g');
const binput = document.getElementById('b');
const boton = document.getElementById('button');



function botonColor() {
    console.log('Botón presionado');
    const r = rinput.value;
    const g = ginput.value;
    const b = binput.value;
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

