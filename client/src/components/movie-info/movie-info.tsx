import { withStyles, Grid } from "@material-ui/core";
import * as React from "react";

const styles ={}

interface MovieInfoPropTypes {
    classes: any;
    overview: string;
}

const MovieInfo = (props: MovieInfoPropTypes) => {
    const { overview } = props

    return (
        <div id="movie-info">
            <p>{overview}</p>
        </div>
    )
}

export default withStyles(styles)(MovieInfo)