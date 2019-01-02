// @flow
import axios from 'axios'
import { baseUrl, apiKey } from './config'
import { logError } from '../../services/log/log'
import { MovieRequest } from '../../services/movies/find-movies'
import type { Movie } from '../../domain/movies'

export type OMDBMovie = {
    Title: string,
    imdbRating: number,
    Metascore: number,
    Ratings: Array<Rating>
}

export type Rating = {
    Source: string,     // e.g. internet movies database (IMDB)
    Value: string	    // e.g. "7.7/10" but different for each source
}

export const findMovies = (request: MovieRequest): Promise<Movie> => {
    return axios.get(`${baseUrl}/?apikey=${apiKey}&t=${request.title}`, {transformResponse: [function (data: string) {
        return toMovie(JSON.parse(data))
      }]})
    .then(response => {
        return response.data
    })
    .catch(error => {
      logError(error)
    })
}

export const toMovie = (omdbMovie: OMDBMovie): Movie => {
    let movie: Movie = { title: omdbMovie.Title, metaScore: omdbMovie.Metascore, imdbRating: omdbMovie.imdbRating}
    
    omdbMovie.Ratings.forEach((rating: Rating) => {
        if (rating.Source === 'Rotten Tomatoes') {
            movie.rottenTomatoesScore = Number(rating.Value.replace('%', ''))
        }
    })

    return movie
}

