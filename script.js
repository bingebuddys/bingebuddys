const API_KEY = '83b13775c572df61653e5164e1aa151b';
const movieContainer = document.getElementById('movie-container');
const genreSelect = document.getElementById('genre-select');
const languageSelect = document.getElementById('language-select');
const typeSelect = document.getElementById('type-select');
const randomButton = document.getElementById('random-button');
const topRatedButton = document.getElementById('top-rated-button');
const randomMovieDiv = document.getElementById('random-movie');

let currentType = 'movie';
let currentLang = 'en';

function fetchMovies(genre = '', language = 'en') {
  const API_URL = `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_genres=${genre}&with_original_language=${language}&sort_by=popularity.desc`;

  movieContainer.innerHTML = '';

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;
      if (movies.length === 0) {
        movieContainer.innerHTML = `<p>No content found 😢</p>`;
        return;
      }

      movies.forEach(movie => {
        const title = currentType === 'movie' ? movie.title : movie.name;
        const overview = movie.overview || 'No overview available';

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}" />
          <div class="overlay">
            <h3>${title}</h3>
            <p>${overview.slice(0, 100)}...</p>
          </div>
        `;

        movieCard.addEventListener('click', () => {
          showMovieDetails(movie.id, currentType);
        });

        movieContainer.appendChild(movieCard);
      });
    })
    .catch(err => console.error('Error fetching content:', err));
}

function showMovieDetails(movieId, type = 'movie') {
  const DETAILS_URL = `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}`;

  fetch(DETAILS_URL)
    .then(res => res.json())
    .then(data => {
      modalPoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
      modalTitle.textContent = data.title || data.name;
      modalDate.textContent = data.release_date || data.first_air_date;
      modalRating.textContent = data.vote_average;
      modalOverview.textContent = data.overview;
      modal.style.display = 'flex';
    })
    .catch(err => console.error('Error loading movie details:', err));
}

function getRandomMovie() {
  const selectedGenre = genreSelect.value;
  const selectedLang = languageSelect.value;

  const randomPage = Math.floor(Math.random() * 100) + 1;
  const RANDOM_API_URL = `https://api.themoviedb.org/3/discover/${currentType}?api_key=${API_KEY}&with_genres=${selectedGenre}&with_original_language=${selectedLang}&sort_by=popularity.desc&page=${randomPage}`;

  randomMovieDiv.innerHTML = "<p>Loading...</p>";

  fetch(RANDOM_API_URL)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;
      if (movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length);
        const movie = movies[randomIndex];

        const title = currentType === 'movie' ? movie.title : movie.name;

        randomMovieDiv.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}" />
          <h2>${title}</h2>
          <p><strong>⭐ Rating:</strong> ${movie.vote_average}</p>
          <p>${movie.overview}</p>
        `;
      } else {
        randomMovieDiv.innerHTML = "<p>No content found for the selected filters 😢</p>";
      }
    })
    .catch(err => {
      console.error('Random fetch error:', err);
      randomMovieDiv.innerHTML = "<p>Error loading random content.</p>";
    });
}


topRatedButton.addEventListener('click', () => {
  const TOP_RATED_URL = `https://api.themoviedb.org/3/${currentType}/top_rated?api_key=${API_KEY}&language=${currentLang}`;

  movieContainer.innerHTML = '';
  fetch(TOP_RATED_URL)
    .then(res => res.json())
    .then(data => {
      const movies = data.results;
      if (movies.length === 0) {
        movieContainer.innerHTML = `<p>No top-rated content found 😢</p>`;
        return;
      }

      movies.forEach(movie => {
        const title = currentType === 'movie' ? movie.title : movie.name;
        const overview = movie.overview || 'No overview available';

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}" />
          <div class="overlay">
            <h3>${title}</h3>
            <p>${overview.slice(0, 100)}...</p>
          </div>
        `;

        movieCard.addEventListener('click', () => {
          showMovieDetails(movie.id, currentType);
        });

        movieContainer.appendChild(movieCard);
      });
    })
    .catch(err => {
      console.error('Top Rated Error:', err);
      movieContainer.innerHTML = `<p>Error fetching top-rated content.</p>`;
    });
});

// Event listeners
genreSelect.addEventListener('change', () => {
  fetchMovies(genreSelect.value, languageSelect.value);
});

languageSelect.addEventListener('change', () => {
  currentLang = languageSelect.value;
  fetchMovies(genreSelect.value, currentLang);
});

typeSelect.addEventListener('change', () => {
  currentType = typeSelect.value;
  fetchMovies(genreSelect.value, languageSelect.value);
});

randomButton.addEventListener('click', getRandomMovie);

// Modal logic
const modal = document.getElementById('movie-modal');
const closeModal = document.getElementById('close-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalRating = document.getElementById('modal-rating');
const modalOverview = document.getElementById('modal-overview');

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Initial load
fetchMovies();
