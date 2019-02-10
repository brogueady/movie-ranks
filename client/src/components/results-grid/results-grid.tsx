import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Movie } from '../../domain/movies';
import MovieImage from '../movie-image/movie-image';
import MovieRatings from '../movie-ratings/movie-ratings'
import MovieInfo from '../movie-info/movie-info'
import MovieCredits from '../movie-credits/movie-credits'

const styles = (theme:any) => ({
    root: {
      flexGrow: 1,
    }
  })
  
  interface ResultsGridPropTypes {
    classes: any;
    movies: Array<Movie>
  }

function ResultsGrid(props: ResultsGridPropTypes) {
    const { classes, movies } = props
  
    const grid = movies.map((movie:Movie, index:number) => {
        const imageUrl = 'http://image.tmdb.org/t/p/w185/' + movie.posterPath
        return (
          <Grid container>
            <Grid item xs={3} key={index}>
              <MovieImage title={movie.title} releaseDate={movie.releaseDate} imageUrl={imageUrl}></MovieImage>
            </Grid>
            <Grid item xs={1} key={index}>
              <MovieRatings imdbRating={movie.imdbRating} rottenTomatoesScore={movie.rottenTomatoesScore} tmdbScore={movie.tmdbScore} metaScore={movie.metaScore}></MovieRatings>
            </Grid>
            <Grid item xs={3}>
              <MovieCredits directors={movie.crew} cast={movie.cast}/>
            </Grid>
            <Grid item xs={5}>
              <MovieInfo overview={movie.overview}/>
            </Grid>
          </Grid>
          )
        })

    return (
      <div className={classes.root}>
          {grid}
      </div>
    )
  }
  
  
  export default withStyles(styles)(ResultsGrid)