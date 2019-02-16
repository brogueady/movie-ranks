
export type MovieRequest = {
    title: string
    genreIds: Array<number>
    skipRecordCount?: number
}

export const toQueryString = (movieRequest:MovieRequest): string => {
    return movieRequest.genreIds.join('&genreId=')
}

export type Movies = {
    page?: number;
    results: Array<Movie>;
    total_results: number;
    total_pages: number;
}

export type People = {
    id: string,
    name: string,
}

export type Movie = {
    posterPath?: string;
    overview?: string;
    releaseDate?: Date;
    genreIds?: Array<number>;
    id?: number;
    originalLanguage?: string;
    originalTitle?: string;
    title?: string;
    tmdbScore?: number;
    rottenTomatoesScore?: number;
    imdbRating?: number;
    metaScore?: number;
    cast?: Array<People>,
    crew?: Array<People>,
    netflixTitle: string
}

export type OmdbRatings = {
    rottenTomatoesScore?: number;
    imdbRating?: number;
    metaScore?: number;
}

export type BaselineMovie = {
    title: string
}