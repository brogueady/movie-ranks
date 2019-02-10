
import axios from 'axios'
import {Movie, MovieRequest} from '../../domain/movies'
import {
    baseUrl,
    apiKey
} from './config'
import {
    logError, logInfo
} from '../../services/log/log'
import { findCredits, Credits } from './find-credits';
import * as Es6Promise from 'es6-promise'
import { urlEncode } from '../utils';

export type TheMovieDBMovies = {
    page ?: number,
    results: Array < TheMovieDBMovie > ,
    total_results: number,
    total_pages: number
}

export type TheMovieDBMovie = {
    poster_path ?: string,
    adult: boolean,
    overview: string,
    release_date: string,
    genre_ids: Array < number > ,
    id: number,
    original_title: string,
    original_language: string,
    title: string,
    backdrop_path ?: string,
    popularity: number,
    vote_count: number,
    video: boolean,
    vote_average: number
}

export const findMovies = async (request: MovieRequest): Es6Promise.Promise < Movie > => {
    logInfo(`${baseUrl}/search/movie?api_key=${apiKey}&query=${urlEncode(request.title)}`)
    return axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${urlEncode(request.title)}`)
        .then(response => {
            return toMovie(response.data, request.title)
        })
        .then((movie: Movie) => {
            return movie != null ? findCredits(movie.id).then((credits: Credits) => addCredits(credits, movie)) : null
        }
        )
        .catch(error => {
            logError(error)
            throw error
        })
}

const addCredits = (credits: Credits, movie: Movie): Movie => {
    return {...movie, ...credits}
}

const toMovie = (tmdbMovies: TheMovieDBMovies, title: string): Movie => {

    if (tmdbMovies.total_results === 0) {
        logError(`Movie ${title} not found`)
        return null
    }

    const tmdbMovie: Array<TheMovieDBMovie> = tmdbMovies.results.filter((tmdbMovie: TheMovieDBMovie) => (tmdbMovie.original_title.toLowerCase().replace(/\s/g, '') === title.toLowerCase().replace(/\s/g, '')) || (tmdbMovie.title.toLowerCase().replace(/\s/g, '') === title.toLowerCase().replace(/\s/g, ''))) 

    if (tmdbMovie.length==0) {
        logError(`Movie ${title} not found`)
        return null
    }

    logInfo(`tmdbMovie = ${JSON.stringify(tmdbMovie)}`)

    let movie: Movie = {
        title: tmdbMovie[0].title,
        posterPath: tmdbMovie[0].poster_path,
        tmdbScore: tmdbMovie[0].vote_average,
        overview: tmdbMovie[0].overview,
        releaseDate: tmdbMovie[0].release_date ? new Date(tmdbMovie[0].release_date) : null,
        genreIds: tmdbMovie[0].genre_ids,
        id: tmdbMovie[0].id,
        originalLanguage: tmdbMovie[0].original_language,
        originalTitle: tmdbMovie[0].original_title,
        netflixTitle: title
    }
    
    logInfo(`movie = ${JSON.stringify(movie)}`)
    return movie
}