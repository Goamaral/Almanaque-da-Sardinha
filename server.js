import express from 'express'
import controllers from './controllers'
import db from './models'
import dotenv from 'dotenv'
import session from 'express-session'
import redis_store from './redis'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('trust proxy', 1)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use(session({
  name: 'sardines',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: redis_store
}))

// Routing
app.use('/', controllers.website)
app.use('/platform', controllers.platform)
app.use('/admin', controllers.admin)

app.on('close', () => db.disconnect())
app.listen(port)

console.log("Listening on port", port)

export default app
