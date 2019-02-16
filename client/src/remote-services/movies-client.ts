import { MovieRequest, Movie, toQueryString } from "../domain/movies";
import axios from 'axios'
import { baseUrl } from "./config";

export const findMovies = (movieRequest: MovieRequest): Promise<Array<Movie>> => {
    return axios.get(`${baseUrl}/api/movies?${toQueryString(movieRequest)}`)
    .then(response => {
        return JSON.parse(response.data)
    }
    )
    .catch(error => {
      throw error
    })

}