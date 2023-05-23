import axios from 'axios';
import Notiflix from 'notiflix';
import { movieTypes } from './genres.js';
import { mockMovies } from './genres.js';

const searchFormEl = document.getElementById('form-search');
const inputEl = document.querySelector('.form__input');
const movieListEl = document.querySelector('.movie-list');
const thisWeekMovieURL = `https://api.themoviedb.org/3/trending/movie/week?`;
const searchMovieURL = `https://api.themoviedb.org/3/search/movie?`;
const searchAllURL = `https://api.themoviedb.org/3/search/multi?`;
const searchPersonURL = `https://api.themoviedb.org/3/search/person?`;
const searchSeriesURL = `https://api.themoviedb.org/3/search/tv?`;
// console.log(searchFormEl);
// console.log(movieListEl);

const language = 'en-US';
let page = 1;

let arrayOfSearchedMovies = [];
const saveMovieResults = movies => {
  arrayOfSearchedMovies = [movies];
};

const fetchTrendingMovies = async page => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=5e58d3162f5aafaf855cf7d900bbc361&include_adult=false&language=en-US&page=${page}`,
    );
    let movies = response.data.results;
    saveMovieResults(movies);
    return movies;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
};

// LOGIKA BUDOWANIA ADRESU URL - ZMIENNEGO ZALEŻNIE OD ZAPYTANIA
const getURL = () => {
  const searchParams = new URLSearchParams({
    query: inputEl.value,
    // query: 'matrix',
    api_key: '5e58d3162f5aafaf855cf7d900bbc361',
    include_adult: false,
    language: language,
    page: page,
  });

  let url = `${searchMovieURL}${searchParams}`;

  return url;

  // let url;
  // if (inputEl.value === '') {
  //   url = `${thisWeekMovieURL}${searchParams}`;
  // } else {
  //   url = `${searchMovieURL}${searchParams}`;
  // }
  // return url;
};

// FUNKCJA POBIERAJĄCA DANE Z SERWERA W ZALEŻNOŚCI OD WART URL
const fetchSearchedMovies = async () => {
  try {
    const response = await axios.get(getURL());
    // console.log(getURL());
    let movies = response.data.results;
    saveMovieResults(movies);
    return movies;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
};

const drawMovies = movies => {
  let markup = '';
  let id = 0;
  // saveMovieResults(movies);
  movies.forEach(movie => {
    let posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : `https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg`;
    let posterUrlRetina = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : `https://www.csaff.org/wp-content/uploads/csaff-no-poster.jpg`;
    markup += `
    <div class="movie-card" id=${id++}>
    <div class="movie-card__poster-container">
    <img class="movie-card__poster" id="poster_path"
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

window.addEventListener('load', async () => {
  const movies = await fetchTrendingMovies(page);
  const markup = drawMovies(movies);
  loadMovies(markup);
});

searchFormEl.addEventListener('submit', async event => {
  event.preventDefault();
  const movies = await fetchSearchedMovies(page);
  const markup = drawMovies(movies);
  loadMovies(markup);
});

// PIERWSZE WYWOŁANIE FUNKCJI DO GENEROWALNIA FILMÓW TYGODNIA

// const showMovies = movies => {
//   //   movieArray.push(movies);
//   //   console.log(movies[1].vote_average);
//   console.log(movies);
//   movieListEl.innerHTML = movies
//     .map(movieCard => {
//       return `<div class="movie-card" id="1">
//         <img class="movie-card__poster" id="poster_path"
//         src= 'https://image.tmdb.org/t/p/w500/${movieCard.poster_path}'
//         alt='${movieCard.title}'
//         />
//       <div class="movie-card__figcaption">
//         <p class="movie-card__title" id="title">${movieCard.title}</p>
//         <span class="movie-card__genre" id="genre_ids">${movieCard.genre_ids}</span>
//         <span class="movie-card__release-date" id="release_date">${movieCard.relese_date}</span>
//         <span class="movie-card__rating" id="vote_average">${movieCard.vote_average}</span>
//       </div>
//     </div>`;
//     })
//     .join('');
// };

// fetchMovies();

// const types = [80, 12, 27, 10752];

// console.log(movieTypes(types));

// const movieTypes = types => {
//   const genres = {
//     28: 'Action',
//     12: 'Adventure',
//     16: 'Animation',
//     35: 'Comedy',
//     80: 'Crime',
//     99: 'Documentary',
//     18: 'Drama',
//     10751: 'Family',
//     14: 'Fantasy',
//     36: 'History',
//     27: 'Horror',
//     10402: 'Music',
//     9648: 'Mystery',
//     10749: 'Romance',
//     878: 'Science Fiction',
//     10770: 'TV Movie',
//     53: 'Thriller',
//     10752: 'War',
//     37: 'Western',
//   };
//   let array = [];

//   types.forEach(item => {
//     if (item === genres.key) {
//       array.push(genre.value);
//     }
//   });
//   return array.join(', ');

//   // types.forEach(item => {
//   //   if (genres[item]) {
//   //     array.push(genres[item]);
//   //   }
//   // });
//   // return array;
// };

// const test = [37, 10752, 18];

// console.log('here:', movieTypes(test));
