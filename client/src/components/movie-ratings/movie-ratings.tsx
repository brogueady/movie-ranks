import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableRow, TableCell, TableBody } from '@material-ui/core';

const styles = (theme:any) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

interface MovieRatingsPropTypes {
  classes: any;
  tmdbScore?: number;
  rottenTomatoesScore?: number;
  imdbRating?: number;
  metaScore?: number;
}

let id = 0;
function createData(name: string, score?: number) {
  id += 1;
  const scoreStr = score ? score : ""
  return { id, name, score: scoreStr };
}

const rows = (imdbRating: number, rottenTomatoesScore: number, tmdbScore: number, metaScore: number) => [
  createData('IMDB', imdbRating),
  createData('Rotten Tomatoes', rottenTomatoesScore),
  createData('TMDB', tmdbScore),
  createData('Metacritic', metaScore),
];

const MovieRatings = (props:MovieRatingsPropTypes) => {
  const { classes, tmdbScore, imdbRating, rottenTomatoesScore, metaScore } = props;
    const data = rows(imdbRating, rottenTomatoesScore, tmdbScore, metaScore)

    return (
      <Table className={classes.table}>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
);
}

// @ts-ignore
export default withStyles(styles)(MovieRatings)
