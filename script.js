// script.js

const API_KEY = '83b13775c572df61653e5164e1aa151b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentType = 'movie';
let currentGenre = '';
let currentLanguage = 'en';

const movieContainer = document.getElementById('movie-container');
const randomSection = document.getElementById('random-movie');
const topRatedButton = document.getElementById('top-rated-button');
const randomButton = document.getElementById('random-button');
const loadMoreButton = document.getElementById('load-more-button');
const typeSelect = document.getElementById('type-select');
const genreSelect = document.getElementById('genre-select');
const languageSelect = document.getElementById('language-select');

const modal = document.getElementById('movie-modal');
const closeModal = document.getElementById('close-modal');

function getURL(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
  return url.toString();
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add('movie-card');

  const img = document.createElement('img');
  img.src = IMAGE_BASE + movie.poster_path;
  card.appendChild(img);

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.innerHTML = `
    <h3>${movie.title || movie.name}</h3>
    <p>${movie.overview}</p>
  `;
  card.appendChild(overlay);

  card.addEventListener('click', () => openModal(movie));

  return card;
}

function openModal(movie) {
  document.getElementById('modal-title').textContent = movie.title || movie.name;
  document.getElementById('modal-poster').src = IMAGE_BASE + movie.poster_path;
  document.getElementById('modal-date').textContent = movie.release_date || movie.first_air_date;
  document.getElementById('modal-rating').textContent = movie.vote_average;
  document.getElementById('modal-overview').textContent = movie.overview;

  modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

async function fetchMovies(type, page = 1) {
  const url = getURL(`/discover/${type}`, {
    page,
    with_genres: currentGenre,
    with_original_language: currentLanguage
  });
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

async function showMovies() {
  const movies = await fetchMovies(currentType, currentPage);
  movies.forEach(movie => {
    if (movie.poster_path) {
      const card = createMovieCard(movie);
      movieContainer.appendChild(card);
    }
  });
}

async function showRandomMovie() {
  const url = getURL(`/discover/${currentType}`, {
    with_genres: currentGenre,
    with_original_language: currentLanguage
  });
  const res = await fetch(url);
  const data = await res.json();
  const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

  if (randomMovie) {
    randomSection.innerHTML = `
      <img src="${IMAGE_BASE + randomMovie.poster_path}" alt="Poster">
      <h2>${randomMovie.title || randomMovie.name}</h2>
      <p>${randomMovie.overview}</p>
    `;
  }
}

topRatedButton.addEventListener('click', async () => {
  movieContainer.innerHTML = '';
  currentPage = 1;
  const url = getURL(`/${currentType}/top_rated`, {
    page: currentPage,
    with_original_language: currentLanguage
  });
  const res = await fetch(url);
  const data = await res.json();
  data.results.forEach(movie => {
    if (movie.poster_path) {
      const card = createMovieCard(movie);
      movieContainer.appendChild(card);
    }
  });
});

randomButton.addEventListener('click', () => {
  showRandomMovie();
});

loadMoreButton.addEventListener('click', () => {
  currentPage++;
  showMovies();
});

typeSelect.addEventListener('change', (e) => {
  currentType = e.target.value;
  currentPage = 1;
  movieContainer.innerHTML = '';
  showMovies();
});

genreSelect.addEventListener('change', (e) => {
  currentGenre = e.target.value;
  currentPage = 1;
  movieContainer.innerHTML = '';
  showMovies();
});

languageSelect.addEventListener('change', (e) => {
  currentLanguage = e.target.value;
  currentPage = 1;
  movieContainer.innerHTML = '';
  showMovies();
});

// Initial load
showMovies();
