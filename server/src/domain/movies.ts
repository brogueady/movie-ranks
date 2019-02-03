
export type MovieRequest = {
    title: string
}

export type MovieSearchRequest = {
    skipRecordCount?: number
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
    title?: string;
    tmdbScore?: number;
    rottenTomatoesScore?: number;
    imdbRating?: number;
    metaScore?: number;
    cast?: Array<People>,
    crew?: Array<People>
}

export type OmdbRatings = {
    rottenTomatoesScore?: number;
    imdbRating?: number;
    metaScore?: number;
}

export type BaselineMovie = {
    title: string
}