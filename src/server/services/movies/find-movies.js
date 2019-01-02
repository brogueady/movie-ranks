import { findMovies as movieDbFindMovies } from '../../clients/themoviedb/find-movies' 
import { omdbFindMovies} from '../../clients/omdb/find-movies'
import type { Movies, MovieRequest } from '../../domain/movies'


export const findMovies = (request: MovieRequest): Promise<Movies> => {
    return Promise.all([movieDbFindMovies(request), omdbFindMovies(request)].then(data => {
        return {
            title: data[0].title,
            ratings: data[1].ratings
        }
    }))
}