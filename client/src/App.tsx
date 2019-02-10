import * as React from 'react'
import { Component } from 'react'
import './app.css'
import ResultsGrid from './components/results-grid/results-grid'
import { Movie } from './domain/movies';

export default class App extends Component {

  movies: Array<Movie> = [
    {
      title: 'The Gathering 2',
      posterPath: '/iNS0Bjl99oB6qNMhIpGsJgmBPpC.jpg',
      tmdbScore: 6.5,
      overview: 'Eight years have passed since the first Arisan!, much has changed in the lives of Sakti (Tora Sudiro), Meimei (Cut Mini), Andien (Aida Nurmala). Even Lita (Rachel Maryam), has decided to settle down in Jakarta. Nino (Surya Saputra) has agreed to Sakti\'s request to take a break on their relationship. Amidst the chaotic sequence of events in Jakarta, Meimei decides to pack her bags and head to Gili island, Lombok, to immerse herself in nature. Meimei\'s choice arouses the suspicion of her four friends, and after a while, Sakti, Nino, Lita, and Andien, are forced to face the reality that Meimei is not merely going on a prolonged retreat, but that she is in fact struggling with something much more serious.',
      releaseDate: new Date('2011-12-01T00:00:00.000Z'),
      genreIds: [
        35,
        18
      ],
      id: 286239,
      originalLanguage: 'id',
      originalTitle: 'Arisan! 2',
      netflixTitle: 'Arisan! 2',
      crew: [ {id:'11', name: 'adrian brogan'}, {id:'12', name: 'charles darwin'}],
      cast: [ {id:'1', name: 'Arnie Terminator'}, {id:'2', name: 'Arnie Terminator'}, {id:'3', name: 'Arnie Terminator'}, {id:'4', name: 'Arnie Terminator'}, {id:'5', name: 'Arnie Terminator'}]
    }
  ]

  render() {
    return (
      <div>
        <ResultsGrid movies={this.movies}/>
      </div>
    )
  }
}
