import axios from 'axios';
import Notiflix from 'notiflix';
import { movieTypes } from './genres.js';
const searchFormEl = document.getElementById('form-search');
const inputEl = document.querySelector('.form__input');
const movieListEl = document.querySelector('.movie-list');
const thisWeekMovieURL = `https://api.themoviedb.org/3/trending/movie/week?`;
const searchMovieURL = `https://api.themoviedb.org/3/search/movie?`;
const searchAllURL = `https://api.themoviedb.org/3/search/multi?`;
const searchPersonURL = `https://api.themoviedb.org/3/search/person?`;
const searchSeriesURL = `https://api.themoviedb.org/3/search/tv?`;

const language = 'en-US';
// let page = parseInt(localStorage.getItem('currentPage')) || 1;
let page = 1;

const getURL = page => {
  const searchParams = new URLSearchParams({
    query: inputEl.value,
    api_key: '5e58d3162f5aafaf855cf7d900bbc361',
    include_adult: false,
    language: language,
    page: page,
  });

  let url;
  if (inputEl.value === '') {
    url = `${thisWeekMovieURL}${searchParams}`;
    console.log('this week');
    // Jeśli inny warunek to można np z local storage pobrać dane
  } else {
    url = `${searchMovieURL}${searchParams}`;
    console.log('search for movies');
  }
  console.log(url);
  return url;
};

// FUNKCJA POBIERAJĄCA DANE Z SERWERA W ZALEŻNOŚCI OD WART URL
const fetchSearchedMovies = async page => {
  try {
    const response = await axios.get(getURL(page));
    let data = response.data;
    localStorage.setItem('currentFetch', JSON.stringify(data.results));
    localStorage.setItem('areWeTrending', JSON.stringify(false));
    console.log('SEARCHED', data);
    return data;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
};

const drawMovies = data => {
  let markup = '';
  let id = 0;
  data.forEach(movie => {
    let posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : `https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg`;
    let posterUrlRetina = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : `https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg`;
    markup += `
    <div class="movie-card">
    <div class="movie-card__poster-container">
    <img class="movie-card__poster" id="poster_path" data-order=${id++}
    src="${posterUrl}"
    srcset="${posterUrl} 1x, ${posterUrlRetina} 2x"
    alt=""
    />
    </div>
    <div class="movie-card__figcaption">
        <p class="movie-card__title" id="title">${movie.title}</p>
        <span class="movie-card__genre" id="genre_ids">${movieTypes(movie.genre_ids)} |</span>
        <span class="movie-card__release-date" id="release_date"> ${movie.release_date.slice(
          0,
          4,
        )}</span>
        <!-- in JS need to add a script for changing visibility on Homepage: document.querySelector('.movie-card__rating').classList.add('is-hidden') -->
        <span class="movie-card__rating" id="vote_average">${movie.vote_average}</span>
    </div>
</div>`;
  });
  return markup;
};

const loadMovies = markup => {
  movieListEl.innerHTML = '';
  movieListEl.innerHTML = markup;
  // funkcja żeby ukryć rating filmu na stronie Home
  const ratingElements = document.querySelectorAll('.movie-card__rating');
  ratingElements.forEach(element => {
    element.classList.add('is-hidden');
  });
};

const firstIteration = async page => {
  const data = await fetchSearchedMovies(page);
  const markup = drawMovies(data.results);
  loadMovies(markup);
  renderPageNumber(page, data);
  // localStorage.setItem('currentPage', page.toString());
  // hidePageNumber(page, data);
};

// PAGINATION

const pagePrevious = document.getElementById('previous');
const pageFirst = document.getElementById('first');
const pageDot = document.getElementById('dot');
const pageMinus2 = document.getElementById('minus2');
const pageMinus1 = document.getElementById('minus1');
const pageCurrent = document.getElementById('current');
const pagePlus1 = document.getElementById('plus1');
const pagePlus2 = document.getElementById('plus2');
const pageDot2 = document.getElementById('dot2');
const pageLast = document.getElementById('last');
const pageNext = document.getElementById('next');

const pageNumberBtnEl = document.querySelector('.pagination');

const renderPageNumber = (page, data) => {
  pageFirst.innerHTML = 1;
  pageMinus2.innerHTML = Number(page) - 2;
  pageMinus1.innerHTML = Number(page) - 1;
  pageCurrent.innerHTML = page;
  pagePlus1.innerHTML = Number(page) + 1;
  pagePlus2.innerHTML = Number(page) + 2;
  pageLast.innerHTML = data.total_pages;

  if (page === 1) {
    pagePrevious.classList.add('is-hidden');
    pageFirst.classList.add('is-hidden');
    pageDot.classList.add('is-hidden');
    pageMinus2.classList.add('is-hidden');
    pageMinus1.classList.add('is-hidden');
  } else if (page === 2) {
    pagePrevious.classList.remove('is-hidden');
    pageFirst.classList.remove('is-hidden');
    pageDot.classList.add('is-hidden');
    pageMinus2.classList.add('is-hidden');
    pageMinus1.classList.add('is-hidden');
  } else if (page === data.total_pages - 1) {
    pagePlus1.classList.add('is-hidden');
    pagePlus2.classList.add('is-hidden');
    pageDot2.classList.add('is-hidden');
    pageLast.classList.remove('is-hidden');
    pageNext.classList.remove('is-hidden');
  } else if (page === data.total_pages) {
    pagePlus1.classList.add('is-hidden');
    pagePlus2.classList.add('is-hidden');
    pageDot2.classList.add('is-hidden');
    pageLast.classList.remove('is-hidden');
    pageNext.classList.add('is-hidden');
  } else {
    pagePrevious.classList.remove('is-hidden');
    pageFirst.classList.remove('is-hidden');
    pageDot.classList.remove('is-hidden');
    pageMinus2.classList.remove('is-hidden');
    pageMinus1.classList.remove('is-hidden');

    pagePlus1.classList.remove('is-hidden');
    pagePlus2.classList.remove('is-hidden');
    pageDot2.classList.remove('is-hidden');
    pageLast.classList.remove('is-hidden');
    pageNext.classList.remove('is-hidden');
  }
};

firstIteration(page);

searchFormEl.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  const data = await fetchSearchedMovies(page);
  const markup = drawMovies(data.results);
  loadMovies(markup);
  renderPageNumber(page, data);
  // localStorage.setItem('currentPage', page.toString());
  // hidePageNumber(page, data);
});

pageNumberBtnEl.addEventListener('click', async event => {
  event.preventDefault();
  const page = event.target.innerHTML;
  event.preventDefault();
  const data = await fetchSearchedMovies(page);
  const markup = drawMovies(data.results);
  loadMovies(markup);
  renderPageNumber(page, data);
  // localStorage.setItem('currentPage', page.toString());
  // hidePageNumber(page, data);
});

pagePrevious.addEventListener('click', async event => {
  event.preventDefault();
  page--;
  const data = await fetchSearchedMovies(page);
  const markup = drawMovies(data.results);
  loadMovies(markup);
  renderPageNumber(page, data);
  // localStorage.setItem('currentPage', page.toString());
  // hidePageNumber(page, data);
});

pageNext.addEventListener('click', async event => {
  event.preventDefault();
  page++;
  const data = await fetchSearchedMovies(page);
  const markup = drawMovies(data.results);
  loadMovies(markup);
  renderPageNumber(page, data);
  // localStorage.setItem('currentPage', page.toString());
  // hidePageNumber(page, data);
});
