const texto = "La tortuga ninja es Donatello, el mejor";
const container = document.getElementById("vertical");
console.log(container);
 
let contenido = "";
 
for (let i = 0; i < texto.length; i++) {
  contenido += texto[i] + "<br>";
}
 
container.innerHTML = contenido;

