import { People, Movie } from "../../domain/movies";
import { baseUrl, apiKey } from "./config";
import axios from 'axios'
import { logError, logInfo } from "../../services/log/log";

export type Credits = {
    cast: Array<People>,
    crew: Array<People>
}

export const findCredits = (movieId: number): Promise<Credits> => {
    logInfo(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`)
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
    return credits.cast.sort((castMember1:any, castMember2:any) => castMember1.order > castMember2.order).filter((castMember: any, index: number) => index < 5)
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