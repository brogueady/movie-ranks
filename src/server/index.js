// @flow

const express = require('express')
const os = require('os')
const bodyParser = require('body-parser')

const app = express()
import { findMovies } from './repositories/movies/movie-repo' 
import { baselineMovies } from './services/movies/baseline-ratings'

app.use(express.static('dist'))
app.use(bodyParser.json())
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }))
app.get('/api/movies', (req, res) => findMovies({skipRecordCount: Number(req.query.skipRecordCount)}).then(data => res.json(data)))
app.post('/api/baseline-movies', (req, res) => baselineMovies(req.body.movies).then(() => res.sendStatus(200)))
app.listen(8080, () => {})
