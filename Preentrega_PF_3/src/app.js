import express from 'express'
import path from 'path'
import hbs from 'express-handlebars'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import { __dirname } from './dirname.js'
import { initPassport } from './config/passport.config.js'

/* ------------------------------------------------------------------------------------------ */
/* ------------------------------------ Import Routes Api ----------------------------------- */
/* ------------------------------------------------------------------------------------------ */
import RoutesSession from './routes/session/session.routes.js'
import RoutesProduct from './routes/product/product.routes.js'
import RoutesCart from './routes/cart/cart.routes.js'
import RoutesTicket from './routes/ticket/ticket.routes.js'

/* ------------------------------------------------------------------------------ */
/* ------------------------------- Routes Render -------------------------------- */
/* ------------------------------------------------------------------------------ */
import RoutesRenderSession from './routes/session/session.routes.views.js'
import RoutesRenderProduct from './routes/product/product.routes.views.js'
import RoutesRenderCart from './routes/cart/cart.routes.views.js'
import RoutesRenderTicket from './routes/ticket/ticket.routes.views.js'

const app = express()

initPassport()
app.use(passport.initialize())
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(`${__dirname}/views`)))

app.engine('hbs', hbs.engine({ extname: 'hbs' }))
app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

/* ------------------------------------------------------------------------------------------ */
/* --------------------------------------- Routes Api --------------------------------------- */
/* ------------------------------------------------------------------------------------------ */
app.use('/api/session', RoutesSession)
app.use('/api/products', RoutesProduct)
app.use('/api/carts', RoutesCart)
app.use('/api/tickets', RoutesTicket)

/* ------------------------------------------------------------------------------ */
/* -------------------------------- Routes Render ------------------------------- */
/* ------------------------------------------------------------------------------ */
app.use('/', RoutesRenderSession)
app.use('/products', RoutesRenderProduct)
app.use('/carts', RoutesRenderCart)
app.use('/tickets', RoutesRenderTicket)

app.get('/error', (req, res) => res.sendStatus(401))
app.get('/', (req, res) => res.redirect('/signin'))
app.get('*', (req, res) => res.sendStatus(404))

export default app
