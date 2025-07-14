
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: Arial, sans-serif;
    padding: 30px;
    background-color: #f0f0f0;
  }
  button {
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
  }
  #coords {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }
`;
document.head.appendChild(style);


const coordDiv = document.createElement('div');
coordDiv.id = 'coords';
coordDiv.textContent = 'Coordenadas: X - , Y - ';
document.body.appendChild(coordDiv);

document.addEventListener('click', function (evento) {
    console.log("evento", evento);
    const x = evento.clientX;
    const y = evento.clientY;
    coordDiv.textContent = `Coordenadas: X - ${x}, Y - ${y}`;
});
