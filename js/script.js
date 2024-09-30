document.addEventListener("DOMContentLoaded", function() {
    let peliculas = [];

    // Cargar la información 
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            localStorage.setItem('peliculas', JSON.stringify(data));
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Botón de búsqueda
    document.getElementById('btnBuscar').addEventListener('click', function() {
        const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
        if (query) {
            const resultados = peliculas.filter(pelicula =>
                pelicula.title.toLowerCase().includes(query) ||
                pelicula.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
                (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query)) ||
                (pelicula.overview && pelicula.overview.toLowerCase().includes(query))
            );
            mostrarPeliculas(resultados);
        }
    });

    // Películas filtradas
    function mostrarPeliculas(movies) {
        const lista = document.getElementById('lista');
        lista.innerHTML = ''; // Limpiar los resultados anteriores

        if (movies.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2');
            noResultsItem.textContent = 'No se encontraron resultados';
            lista.appendChild(noResultsItem);
        } else {
            movies.forEach(movie => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2');
                listItem.innerHTML = `
                    <h5>${movie.title}</h5>
                    <p>${movie.tagline || 'Sin descripción'}</p>
                    <p>${generarEstrellas(movie.vote_average)}</p>
                `;

                listItem.addEventListener('click', () => {
                    mostrarDetallesPelicula(movie);
                });

                lista.appendChild(listItem);
            });
        }
    }

    // Detalles de una película en el offcanvas
    function mostrarDetallesPelicula(movie) {
        const offcanvasLabel = document.getElementById('offcanvasPeliculaLabel');
        const peliculaOverview = document.getElementById('peliculaOverview');
        const peliculaGenres = document.getElementById('peliculaGenres');
        const peliculaAnio = document.getElementById('peliculaAnio');
        const peliculaDuracion = document.getElementById('peliculaDuracion');
        const peliculaPresupuesto = document.getElementById('peliculaPresupuesto');
        const peliculaGanancias = document.getElementById('peliculaGanancias');

        // Asignar los valores a los elementos del offcanvas
        offcanvasLabel.textContent = movie.title;
        peliculaOverview.textContent = movie.overview || 'No hay descripción disponible';
        
        peliculaGenres.innerHTML = '';
        movie.genres.forEach(genre => {
            const li = document.createElement('li');
            li.classList.add('mb-2');
            li.textContent = genre.name;
            peliculaGenres.appendChild(li);
        });

        // Otros detalles de la película
        peliculaAnio.textContent = `Año: ${new Date(movie.release_date).getFullYear()}`;
        peliculaDuracion.textContent = `Duración: ${movie.runtime} minutos`;
        peliculaPresupuesto.textContent = `Presupuesto: $${movie.budget.toLocaleString()}`;
        peliculaGanancias.textContent = `Ganancias: $${movie.revenue.toLocaleString()}`;

        // Mostrar el offcanvas
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasPelicula'));
        offcanvas.show();
    }

    // Estrellas de votación
    function generarEstrellas(voteAverage) {
        const estrellasTotales = Math.round(voteAverage / 2); // Convertir a escala de 5
        let estrellasHTML = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= estrellasTotales) {
                estrellasHTML += '<span class="fa fa-star checked"></span>';
            } else {
                estrellasHTML += '<span class="fa fa-star"></span>';
            }
        }
        return estrellasHTML;
    }
});
