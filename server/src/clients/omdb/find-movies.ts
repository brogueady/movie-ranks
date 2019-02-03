
import axios from 'axios'
import { baseUrl, apiKey } from './config'
import { logError } from '../../services/log/log'
import { MovieRequest, OmdbRatings } from '../../domain/movies'
import { Movie } from '../../domain/movies'

type OMDBMovie = {
    Title: string,
    imdbRating: number,
    Metascore: number,
    Ratings: Array<Rating>
}

type Rating = {
    Source: string,     // e.g. internet movies database (IMDB)
    Value: string	    // e.g. "7.7/10" but different for each source
}

export const findRatings = (request: MovieRequest): Promise<OmdbRatings> => {
    return axios.get(`${baseUrl}/?apikey=${apiKey}&t=${request.title}`, {transformResponse: [function (data: string) {
        return toMovie(JSON.parse(data))
      }]})
    .then(response => {
        return response.data
    }
    )
    .catch(error => {
      logError(error)
      throw error
    })
}

export const toMovie = (omdbMovie: OMDBMovie): OmdbRatings => {
    let omdbRatings: OmdbRatings = { metaScore: omdbMovie.Metascore, imdbRating: omdbMovie.imdbRating, rottenTomatoesScore: undefined}
    
    if (omdbMovie.Ratings) {
        omdbMovie.Ratings.forEach((rating: Rating) => {
        if (rating.Source === 'Rotten Tomatoes') {
            omdbRatings.rottenTomatoesScore = Number(rating.Value.replace('%', ''))
        }
        })
    }

    return omdbRatings
}

