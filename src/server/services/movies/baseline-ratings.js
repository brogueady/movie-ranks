import * as omdb from '../../clients/omdb/find-movies'
import * as tmdb from '../../clients/themoviedb/find-movies'
import type { Movie, BaselineMovie } from '../../domain/movies'
import { upsertOmdbMovie, upsertTmdbMovie } from '../../repositories/movies/write-movies'



export const baselineMovies = (baselineMovies: Array<BaselineMovie>): Promise => {
    let promises = []
    baselineMovies.forEach((baselineMovie: BaselineMovie) => {
        promises.push(omdb.findMovies(baselineMovie).then((movie: Movie) => upsertOmdbMovie(movie)))
        promises.push(tmdb.findMovies(baselineMovie).then((movie: Movie) => upsertTmdbMovie(movie)))
    })

    return Promise.all(promises)
}
