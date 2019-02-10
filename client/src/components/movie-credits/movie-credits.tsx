import { People } from "../../domain/movies";
import { withStyles } from "@material-ui/core";
import * as React from 'react'

const styles = {}

interface MovieCreditsPropTypes {
    cast: Array<People>;
    directors: Array<People>;
}

const directors1 = (directors: Array<People>) => {
        return (
            <ul><p>Directors</p>
                {directors.map((person) => (
                    <li key={person.id}>{person.name}</li>
                ))}
            </ul>
        )
}

const MovieCredits = (props: MovieCreditsPropTypes) => {
    const { directors, cast } = props
    return (
        <div id="movie-credits">
            {directors1(directors)}
        </div>
    )
}

export default withStyles(styles)(MovieCredits)