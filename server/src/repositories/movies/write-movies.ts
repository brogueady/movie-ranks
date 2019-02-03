
import neo4j from 'neo4j-driver';
import { Movie, People, BaselineMovie } from '../../domain/movies';
import { logInfo } from '../../services/log/log';
import { driver } from './neo4j-driver';
import * as omdb from '../../clients/omdb/find-movies'
import * as tmdb from '../../clients/themoviedb/find-movies'
import * as Es6Promise from 'es6-promise'
import * as _ from 'lodash'

export type MovieRepoModel = {
    posterPath: string,
    overview: string,
    releaseDate: string,
    genreIds: Array<number>,
    originalLanguage: string,
    title: string,
    tmdbScore: string,
    id: string
}

const addMovie = (tx: any, movie: Movie) => {
    return tx.run('CREATE (movie:Movie {title : {title}, posterPath : {posterPath}, overview : {overview}, releaseDate : {releaseDate},' +
        'genreIds : {genreIds}, originalLanguage : {originalLanguage}, tmdbScore : {tmdbScore}, title : {title}, id : {id},' +
        'rottenTomatoesScore : {rottenTomatoesScore}, imdbRating : {imdbRating}, metaScore : {metaScore}})', {
            posterPath: movie.posterPath,
            overview: movie.overview,
            releaseDate: movie.releaseDate ? new neo4j.types.Date(movie.releaseDate.getFullYear(), movie.releaseDate.getMonth()+1, movie.releaseDate.getDate()) : null,
            genreIds: movie.genreIds,
            originalLanguage: movie.originalLanguage,
            title: movie.title,
            tmdbScore: movie.tmdbScore,
            id: movie.id,
            rottenTomatoesScore: movie.rottenTomatoesScore,
            imdbRating: movie.imdbRating,
            metaScore: movie.metaScore
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

const deleteAllMoviesWithTitlesNotIn = (titles: Array<BaselineMovie>): Promise<number> => {
    let session = driver.session()
    let titleCount = 0

    return session.run('match (movie:Movie) where not movie.title IN {titles} detach delete movie', {titles: titles})
        .then(titles => {
            this.titleCount = 1
        })
        .then(() => {
            return session.run('match (actor:Person) where size((actor)--())=0 delete actor')
                .then(() => {
                    session.close()
                    return this.titleCount
                })
        })
}

const getAllMovieTitles = (): Promise<Array<string>> => {
    let session = driver.session()

    return session.run('match (movie:Movie) return movie.title')
        .then(statement => {
            session.close()
            return statement.records.map(record => record.get('title'))
        })

}

export const baselineMovies = (baselineMovies: Array<BaselineMovie>) => {
    return deleteAllMoviesWithTitlesNotIn(baselineMovies)
        .then(deletedCount => {
            logInfo(`Baseline: removed ${deletedCount} movies from repo`)
        })
        .then(() => {
            return getAllMovieTitles()
                .then((allMovieTitlesInRepo) => {
                    let promises:any = []
                    const moviesNotInRepo = _.differenceWith(baselineMovies, allMovieTitlesInRepo, (x: BaselineMovie,y: string) => x.title !== y)
                    moviesNotInRepo
                        .map(title => {
                            promises.push(tmdb.findMovies(title))
                            promises.push(omdb.findRatings(title))
                        })
        
                    return Es6Promise.Promise.all(promises).then((values) => {
                        for (let i=0; i<=values.length-2; i+=2) {
                            if (values[i] !== null) {
                                upsertMovie({ ...values[i], ...values[i+1]})
                            }
                        }}
                    )
            })
        })
}

