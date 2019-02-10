import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { CardHeader } from '@material-ui/core';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};

interface MovieImagePropTypes {
  classes: any;
  imageUrl: string;
  title: string;
  releaseDate: Date;
}

const MovieImage = (props:MovieImagePropTypes) => {
  const { classes, imageUrl, title, releaseDate } = props;

  const formattedReleaseDate = releaseDate.toDateString()

  return (
    <Card className={classes.card}>
    <CardHeader
          title={title}
          subheader={formattedReleaseDate}
        />


      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={imageUrl}
        />
      </CardActionArea>
    </Card>
  );
}

export default withStyles(styles)(MovieImage)
