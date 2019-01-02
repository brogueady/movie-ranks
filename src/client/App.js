import React, { Component } from 'react'
import './app.css'
import ReactImage from './react.png'
import ResultsGrid from './components/resultsgrid/results-grid'

export default class App extends Component {
  state = { username: null }

  render() {
    return (
      <div>
        <ResultsGrid/>
      </div>
    )
  }
}
