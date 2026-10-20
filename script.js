
const API = "https://www.omdbapi.com/?apikey=323d013d&s=";

const searchform = document.querySelector("#searchMovie");
const searchInput = document.querySelector('input[name="search"]');
const movieshub = document.querySelector("#movieshub");

searchform.addEventListener("submit", (e) => {
    e.preventDefault();

    const search = searchInput.value.trim();

    if (!search) {
        return;
    }

    searchMovies(search);
});


async function searchMovies(movieName) {
    movieshub.innerHTML = "<div class='loader'></div>";

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=323d013d&s=${encodeURIComponent(movieName)}`
        );

        const data = await response.json();
        console.log(data);

        displayMovies(data);

    } catch (error) {
        console.error("Error:", error);

        movieshub.innerHTML =
            "<p>Something went wrong. Please try again.</p>";
    }
}


function displayMovies(data) {
    movieshub.innerHTML = "";

    if (data.Response === "False" || !data.Search) {
        movieshub.innerHTML =
            `<p>Movie not found: ${data.Error || "Try another search!"}</p>`;
        return;
    }

    data.Search.forEach((movie) => {
        const div = document.createElement("div");

        div.dataset.imdbID = movie.imdbID;
        div.classList.add("movie-card");

        div.innerHTML = `
            <div>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}"
                     alt="${movie.Title}">
            </div>
            <div>
                <p>${movie.Title}</p>
                <p>${movie.Year}</p>
            </div>
        `;

        movieshub.appendChild(div);
    });
}

movieshub.addEventListener("click", (e) => {
    e.stopPropagation();
    const movieCard = e.target.closest(".movie-card");

    if (!movieCard) {
        return;
    }

    const imdbID = movieCard.dataset.imdbID;
    location.href = `movies-details.html?id=${imdbID}`;
});
