
import { MovieSearchRequest, Movie, People, defaultMovie } from '../../domain/movies'
import { logError } from '../../services/log/log'
import { driver } from './neo4j-driver'
import * as Es6Promise from 'es6-promise'

export const findMovies = async (movieRequest: MovieSearchRequest): Es6Promise.Promise<Array<Movie>> => {
    let session = driver.session()
    let movies: Array<Movie> = []

    try {
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    const neo4jResult = await session
        .run('MATCH    (cast:Person)<-[:HAS_ACTOR]-(movie:Movie) '+
        'WITH movie, collect(cast) as casts ' +
        'MATCH    (movie:Movie)-[:HAS_DIRECTOR]->(director:Person) '+
        'WITH movie, casts, collect(director) as directors '+
        'RETURN movie{ .*, cast: casts, crew: directors} LIMIT 10')

        movies = neo4jResult.records.map(neomovie => {
                    return toMovie(neomovie.get('movie'))
        })
    } catch(error) { 
        logError(error.toString()) 
        throw error
    }

    return movies

}

const getPeople = (cast:[]): Array<People> => {
    return cast!=null ? cast.map((person:any) => { return {name: person.properties.name, id: person.properties.id}}) : []
}


const toMovie = (neo4jMovie: any): Movie => {
        return {
            id : neo4jMovie.id,
        overview: neo4jMovie.overview,
        posterPath: neo4jMovie.posterPath,
        releaseDate: neo4jMovie.releaseDate,
        tmdbScore: neo4jMovie.tmdbScore,
        rottenTomatoesScore: neo4jMovie.rottenTomatoesScore,
        imdbRating: neo4jMovie.imdbRating,
        originalLanguage: neo4jMovie.originalLanguage,
        metaScore: neo4jMovie.metaScore,
        title: neo4jMovie.title,
        genreIds: neo4jMovie.genreIds,
        netflixTitle: neo4jMovie.netflixTitle,
        cast: getPeople(neo4jMovie.cast),
        crew: getPeople(neo4jMovie.crew)
        }
}