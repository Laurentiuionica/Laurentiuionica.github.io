function calcularMedia(array) {
  let suma = 0;

  for (let i = 0; i < array.length; i++) {
    suma += array[i]; // vamos acumulando la suma
  }

  const media = suma / array.length; // dividimos por la cantidad de elementos

  return media; // devolvemos la media
}

// Prueba:
const numeros = [1,4,6,8,0,2,4,5,6,8];
let resultado = calcularMedia(numeros);
console.log(calcularMedia(numeros)); 
