import * as React from 'react'
import { Checkbox, FormGroup, FormControlLabel, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

interface RatingType {
    type: 'imdb' | 'tmdb' | 'rottenTomatoes' | 'metaCritic'
}

interface MaterialUI {
    classes?: any
}

interface SearchFilterPropTypes extends MaterialUI {
    genreIds: Array<number>
    searchText: string
    rating: {
        ratingType: RatingType
        minRating: number
        maxRating: number
    }
}

const styles = {
    root: {
      color: green[600],
      '&$checked': {
        color: green[500],
      },
    },
    checked: {},
  };
  
function SearchFilters(props: SearchFilterPropTypes) {
    const { classes } = props

    return (
        <div id="search-filters">
<FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checkedAction}
              onChange={this.handleChange('checkedAction')}
              value="checkedAction"
            />
          }
          label="Action"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checkedB}
              onChange={this.handleChange('checkedB')}
              value="checkedB"
              color="primary"
            />
          }
          label="Primary"
        />
        <FormControlLabel control={<Checkbox value="checkedC" />} label="Uncontrolled" />
        <FormControlLabel disabled control={<Checkbox value="checkedD" />} label="Disabled" />
        <FormControlLabel
          disabled
          control={<Checkbox checked value="checkedE" />}
          label="Disabled"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checkedF}
              onChange={this.handleChange('checkedF')}
              value="checkedF"
              indeterminate
            />
          }
          label="Indeterminate"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checkedG}
              onChange={this.handleChange('checkedG')}
              value="checkedG"
              classes={{
                root: classes.root,
                checked: classes.checked,
              }}
            />
          }
          label="Custom color"
        />
        <FormControlLabel
          control={
            <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" />
          }
          label="Custom icon"
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              value="checkedI"
            />
          }
          label="Custom size"
        />
      </FormGroup>        </div>
    )
}

export default withStyles(styles)(SearchFilters)