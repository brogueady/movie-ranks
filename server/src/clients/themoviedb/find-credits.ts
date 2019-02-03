import { People, Movie } from "../../domain/movies";
import { baseUrl, apiKey } from "./config";
import axios from 'axios'
import { logError } from "../../services/log/log";

export type Credits = {
    cast: Array<People>,
    crew: Array<People>
}

export const findCredits = (movieId: number): Promise<Credits> => {
    return axios.get(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`)
        .then((response: any) => {
            return {cast: toCast(response.data), crew: toDirectors(response.data)}
        }
        ).catch(error => {
            logError(error)
            throw error
          })
}

const toCast = (credits: any): Array<People> => {
    return credits.cast.filter((castMember: any) => castMember.order < 5)
        .map((castMember: any) => {
            return {
                id: castMember.id,
                name: castMember.name,
            }
        })
}

const toDirectors = (credits: any): Array<People> => {
    return credits.crew.filter((member: any) => member.job === "Director")
        .map((member: any) => {
            return {
                id: member.id,
                name: member.name,
            }
        })
}