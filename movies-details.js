
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

const movieDetails = document.querySelector("#movieDetails");

async function searchMovies() {
    if (!movieId) {
        movieDetails.textContent = "No movie ID provided.";
        return;
    }

    movieDetails.textContent = "Loading movie details...";

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=323d013d&i=${encodeURIComponent(movieId)}&plot=full`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch movie details.");
        }

        const data = await response.json();

        console.log(data);
        displayMovies(data);

    } catch (error) {
        console.error("Error:", error);
        movieDetails.textContent =
            "Something went wrong. Please try again.";
    }
}

function displayMovies(movie) {
    movieDetails.replaceChildren();

    if (movie.Response === "False") {
        movieDetails.textContent =
            movie.Error || "Movie details not found.";
        return;
    }

    const title = document.createElement("h2");
    title.textContent = movie.Title || "Unknown title";
    movieDetails.appendChild(title);

    if (movie.Poster && movie.Poster !== "N/A") {
        const poster = document.createElement("img");
        poster.src = movie.Poster;
        poster.alt = `${movie.Title} poster`;
        poster.width = 200;

        poster.addEventListener("error", () => poster.remove());

        movieDetails.appendChild(poster);
    }

    addDetail("Year", movie.Year);
    addDetail("Released", movie.Released);
    addDetail("Genre", movie.Genre);
    addDetail("Director", movie.Director);
    addDetail("Actors", movie.Actors);
    addDetail("Language", movie.Language);
    addDetail("IMDb Rating", movie.imdbRating);
    addDetail("Plot", movie.Plot);

    // IMDb button
    const container = document.createElement("div");
    const link = document.createElement("a");

    link.href = `https://www.imdb.com/title/${encodeURIComponent(movie.imdbID || movieId)}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on IMDb";
    link.className = "btn";

    container.appendChild(link);
    movieDetails.appendChild(container);
}

function addDetail(label, value) {
    if (!value || value === "N/A") return;

    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value));

    movieDetails.appendChild(paragraph);
}

searchMovies();
