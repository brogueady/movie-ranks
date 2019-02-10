
import axios from 'axios'
import { baseUrl, apiKey } from './config'
import { logError, logInfo } from '../../services/log/log'
import { MovieRequest, OmdbRatings } from '../../domain/movies'
import { Movie } from '../../domain/movies'
import * as Es6Promise from 'es6-promise'
import { urlEncode } from '../utils'

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

export const findRatings = async (request: MovieRequest): Es6Promise.Promise<OmdbRatings> => {
    return axios.get(`${baseUrl}/?apikey=${apiKey}&t=${urlEncode(request.title)}`, {transformResponse: [function (data: string) {
        logInfo(`${baseUrl}/?apikey=${apiKey}&t=${urlEncode(request.title)}`)
        const response = JSON.parse(data)
        if (response.Response && response.Response==="False") {
            return emptyOmdbRatings
        }
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

const emptyOmdbRatings = { metaScore: null as number, imdbRating: null as number, rottenTomatoesScore: null as number}

export const toMovie = (omdbMovie: OMDBMovie): OmdbRatings => {
    logInfo(`omdbMovie = ${JSON.stringify(omdbMovie)}`)
    let omdbRatings: OmdbRatings = { metaScore: omdbMovie.Metascore, imdbRating: omdbMovie.imdbRating, rottenTomatoesScore: null}
    
    if (omdbMovie.Ratings) {
        omdbMovie.Ratings.forEach((rating: Rating) => {
        if (rating.Source === 'Rotten Tomatoes') {
            omdbRatings.rottenTomatoesScore = Number(rating.Value.replace('%', ''))
        }
        })
    }
    logInfo(`omdbRatings = ${JSON.stringify(omdbRatings)}`)
    return omdbRatings
}

