// @flow
import type { Movie } from '../../domain/movies'
import {logInfo, logError } from '../../services/log/log'
import { driver } from './neo4j-driver'
import neo4j from 'neo4j-driver'

export const upsertTmdbMovie = (movie: Movie) => {
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    let session = driver.session()
    
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
        .run('MERGE (movie:Movie {title : {title}}) ON MATCH SET movie.posterPath = {posterPath}, movie.overview = {overview}, movie.releaseDate = {releaseDate},' +
             'movie.genreIds = {genreIds}, movie.originalLanguage = {originalLanguage}, movie.tmdbScore = {tmdbScore}, movie.id = {id}', {
            posterPath: movie.posterPath,
            overview: movie.overview,   
            releaseDate: movie.releaseDate ? new neo4j.types.Date(movie.releaseDate.getFullYear(), movie.releaseDate.getMonth(), movie.releaseDate.getDate()) : null,
            genreIds: movie.genreIds,
            originalLanguage: movie.originalLanguage,
            title: movie.title,
            tmdbScore: movie.tmdbScore,
            id: movie.id
        })
        .subscribe({
            onNext: function (record) {
                logInfo(`Updated movie: ${record.title}`)
            },
            onCompleted: function () {
                session.close()
            },
            onError: function (error) {
                logError(error)
            }
        })
}

export const upsertOmdbMovie = (movie: Movie) => {
    // Create a session to run Cypher statements in.
    // Note: Always make sure to close sessions when you are done using them!
    let session = driver.session()
    
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
        .run('MERGE (movie:Movie {title : {title}}) ON MATCH SET movie.rottenTomatoesScore = {rottenTomatoesScore}, movie.imdbRating = {imdbRating}, movie.metaScore = {metaScore}', {
            title: movie.title,
            rottenTomatoesScore: movie.rottenTomatoesScore,
            imdbRating: movie.imdbRating,
            metaScore: movie.metaScore
        })
        .subscribe({
            onNext: function (record) {
                logInfo(`Updated movie: ${record.title}`)
            },
            onCompleted: function () {
                session.close()
            },
            onError: function (error) {
                logError(error)
            }
        })
}