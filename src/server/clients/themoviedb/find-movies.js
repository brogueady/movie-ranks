// @flow
import axios from 'axios'
import {
    baseUrl,
    apiKey
} from './config'
import {
    logError
} from '../../services/log/log'
import type {
    MovieRequest,
    Movie
} from '../../domain/movies'

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

export const findMovies = (request: MovieRequest): Promise < Movie > => {
    return axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${request.title}`)
        .then(response => {
            return toMovie(response.data, request.title)
        })
        .catch(error => {
            logError(error)
            throw error
        })
}

const toMovie = (tmdbMovies: TheMovieDBMovies, title: string): Movie => {

    if (tmdbMovies.total_results === 0) {
        logError(`Movie ${title} not found`)
    }

    const tmdbMovie: Array<TheMovieDBMovie> = tmdbMovies.results.filter((tmdbMovie: TheMovieDBMovie) => tmdbMovie.title === title)

    if (!tmdbMovie) {
        logError(`Movie ${title} not found`)
    }

    let movie: Movie = {
        title: tmdbMovie[0].title,
        posterPath: tmdbMovie[0].poster_path,
        tmdbScore: tmdbMovie[0].vote_average,
        overview: tmdbMovie[0].overview,
        releaseDate: new Date(tmdbMovie[0].release_date),
        genreIds: tmdbMovie[0].genre_ids,
        id: tmdbMovie[0].id,
        originalLanguage: tmdbMovie[0].original_language
    }
    return movie
}