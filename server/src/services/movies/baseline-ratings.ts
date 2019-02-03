import { BaselineMovie } from '../../domain/movies'
import * as _ from 'lodash'
import * as movieRepo from '../../repositories/movies/write-movies'



export const baselineMovies = (movies: Array<BaselineMovie>): Promise<any> => {
    return movieRepo.baselineMovies(movies)
}

