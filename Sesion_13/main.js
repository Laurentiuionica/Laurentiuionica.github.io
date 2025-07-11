let slides = Array.from(document.querySelectorAll('.item'));
let index = 0;
let anterior = 0;


for (let i = 0; i < slides.length; i++) {
  slides[i].hidden = i !== 0; //inicializar todos los elementos a hiden excepto el primero.
}


function verSlide(i) {
  slides[anterior].hidden = true;  // ocultar el anterior
  slides[i].hidden = false;        // mostrar el nuevo
  anterior = i;                    // guardar nuevo índice como anterior
}



setInterval(() => {
  index = (index + 1) % slides.length;
  verSlide(index);
}, 2000);

