
import { MovieSearchRequest, Movie } from '../../domain/movies'
import { logError } from '../../services/log/log'
import { driver } from './neo4j-driver'

export const findMovies = (movieRequest: MovieSearchRequest): Promise<Array<Movie>> => {
    let session = driver.session()
    
    let movies: Array<Movie> = []

    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    return session
        .run('MATCH(movie) RETURN movie ORDER BY movie.releaseDate SKIP {skipRecordCount} LIMIT 1', {
            skipRecordCount: movieRequest.skipRecordCount
        })
        .then(neo4jResult => {
            neo4jResult.records.map(movie => movies.push(toMovie(movie.get('movie'))))
            return movies
        })
}

const toMovie = (neo4jMovie: any): Movie => {
    return {
        id: neo4jMovie.properties.id,
        overview: neo4jMovie.properties.overview,
        posterPath: neo4jMovie.properties.posterPath,
        releaseDate: neo4jMovie.properties.releaseDate,
        tmdbScore: neo4jMovie.properties.tmdbScore,
        rottenTomatoesScore: neo4jMovie.properties.rottenTomatoesScore,
        imdbRating: neo4jMovie.properties.imdbRating,
        originalLanguage: neo4jMovie.properties.originalLanguage,
        metaScore: neo4jMovie.properties.metaScore,
        title: neo4jMovie.properties.title,
        genreIds: neo4jMovie.properties.genreIds,
        netflixTitle: neo4jMovie.properties.netflixTitle
    }
}