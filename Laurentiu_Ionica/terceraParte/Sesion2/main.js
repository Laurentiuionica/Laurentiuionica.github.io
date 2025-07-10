document.getElementById('searchButton').addEventListener('click', async function() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() === "") {
        alert("Por favor ingresa un término de búsqueda.");
        return;
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    
    const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error al realizar la solicitud a GitHub. Código: ${response.status}`);
        }

        const data = await response.json();

        if (data.items.length === 0) {
            resultsContainer.innerHTML = "<li>No se encontraron resultados.</li>";
        } else {
            data.items.forEach(item => {
                const link = document.createElement('a');
                link.href = item.html_url;  // Link al repositorio en GitHub
                link.target = "_blank";
                link.textContent = item.name;  // Nombre del repositorio

                const listItem = document.createElement('li');
                listItem.appendChild(link);
                resultsContainer.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error("Error al obtener los resultados:", error);
        resultsContainer.innerHTML = "<li>Error al obtener resultados. Intenta de nuevo.</li>";
    }
});
