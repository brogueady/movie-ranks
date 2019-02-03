import * as express from 'express'
import * as os from 'os'
import * as bodyParser from 'body-parser'
import { findMovies } from './repositories/movies/movie-repo' 
import { baselineMovies } from './services/movies/baseline-ratings'
import { logError } from './services/log/log';

const app = express()

app.use(express.static('dist'))
app.use(bodyParser.json())
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }))
app.get('/api/movies', (req, res) => findMovies({skipRecordCount: Number(req.query.skipRecordCount)}).then(data => res.json(data)).catch((error: any) => logError(error)))
app.post('/api/baseline-movies', (req, res) => baselineMovies(req.body.movies).then(() => res.sendStatus(200)))
app.listen(8080, () => {})
