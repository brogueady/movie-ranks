
import neo4j from 'neo4j-driver';
import { Movie, People, BaselineMovie, OmdbRatings } from '../../domain/movies';
import { logInfo } from '../../services/log/log';
import { driver } from './neo4j-driver';
import * as omdb from '../../clients/omdb/find-movies'
import * as tmdb from '../../clients/themoviedb/find-movies'
import * as Es6Promise from 'es6-promise'
import * as _ from 'lodash'

async function sleep(millis:number) {
    return new Es6Promise.Promise((resolve) => setTimeout(resolve, millis))
 }

export const baselineMovies = async (baselineMovies: Array<BaselineMovie>) => {
    
    let deletedCount = await deleteAllMoviesWithTitlesNotIn(baselineMovies.map(baselineMovie => baselineMovie.title))
    logInfo(`Baseline: removed ${deletedCount} movies from repo`)

    let allMovieTitlesInRepo = await getAllNetflixMovieTitles()

    let promises:any = []
    const moviesNotInRepo = _.without(baselineMovies.map((movie: BaselineMovie) => movie.title), ...allMovieTitlesInRepo)

    let tmdbMovies: Array<Movie> = [] 
    let omdbRatings: Array<OmdbRatings> = [] 

    for (const title of moviesNotInRepo) {
        const movie = await tmdb.findMovies({title})
        if (movie!=null) {
            const ratings = await omdb.findRatings({title})
            tmdbMovies.push(movie)
            omdbRatings.push(ratings)
        }
        await sleep(1000)
    }
    
    for (let i=0; i<=tmdbMovies.length; i++) {
        if (tmdbMovies[i]!=null) {
            upsertMovie({ ...tmdbMovies[i], ...omdbRatings[i]})
        }
    }
    return tmdbMovies.length
}

const addMovie = (tx: any, movie: Movie) => {
    return tx.run('MERGE (movie:Movie { id: {id}}) ON CREATE SET movie.title={title}, movie.posterPath = {posterPath}, movie.overview = {overview}, movie.releaseDate = {releaseDate},' +
        'movie.genreIds = {genreIds}, movie.originalLanguage = {originalLanguage}, movie.originalTitle = {originalTitle}, movie.tmdbScore = {tmdbScore}, movie.title = {title}, movie.id = {id},' +
        'movie.rottenTomatoesScore = {rottenTomatoesScore}, movie.imdbRating = {imdbRating}, movie.metaScore = {metaScore}, movie.netflixTitle = {netflixTitle}', {
            posterPath: movie.posterPath,
            overview: movie.overview,
            releaseDate: movie.releaseDate ? new neo4j.types.Date(movie.releaseDate.getFullYear(), movie.releaseDate.getMonth()+1, movie.releaseDate.getDate()) : null,
            genreIds: movie.genreIds,
            originalLanguage: movie.originalLanguage,
            originalTitle: movie.originalTitle,
            title: movie.title,
            tmdbScore: movie.tmdbScore,
            id: movie.id,
            rottenTomatoesScore: movie.rottenTomatoesScore,
            imdbRating: movie.imdbRating,
            metaScore: movie.metaScore,
            netflixTitle: movie.netflixTitle
        })
}

const addCast = (tx: any, movie: Movie) => {
    movie.cast.forEach((member: People) => {
        tx
            .run('MERGE (cast:Person {id : {id}, name: {name}})', {
                id: member.id,
                name: member.name
            })

        tx
            .run('MATCH (movie:Movie {id: {id}}), (person:Person {id: {personId}}) MERGE (movie)-[:HAS_ACTOR]->(person)', {
                id: movie.id,
                personId: member.id
            })
    })
}

const addDirectors = (tx: any, movie: Movie) => {
    movie.crew.forEach((member: People) => {
        tx
            .run('MERGE (director:Person {id : {id}, name: {name}})', {
                id: member.id,
                name: member.name
            })

        tx
            .run('MATCH (movie:Movie {id: {id}}), (person:Person {id: {personId}}) MERGE (movie)-[:HAS_DIRECTOR]->(person)', {
                id: movie.id,
                personId: member.id
            })
    })
}

export const upsertMovie = (movie: Movie) => {
    let session = driver.session()

    session.writeTransaction((tx) => addMovie(tx, movie)
        .then(() => addDirectors(tx, movie))
        .then(() => addCast(tx, movie)))
        .then(() => session.close())
}

const deleteAllMoviesWithTitlesNotIn = (titles: Array<string>): Promise<number> => {
    let session = driver.session()
    let titleCount = 0

    return session.run('match (movie:Movie) where not movie.netflixTitle IN {titles} detach delete movie return movie', {titles: titles})
        .then(statement => {
            this.titleCount = statement.records.length
        })
        .then(() => {
            return session.run('match (actor:Person) where size((actor)--())=0 delete actor')
                .then(() => {
                    session.close()
                    return this.titleCount
                })
        })
}

const getAllNetflixMovieTitles = (): Promise<Array<string>> => {
    let session = driver.session()

    return session.run('match (movie:Movie) return movie.netflixTitle')
        .then(statement => {
            session.close()
            return statement.records.map(record => {
                return record.get('movie.netflixTitle')
            })
        })

}
