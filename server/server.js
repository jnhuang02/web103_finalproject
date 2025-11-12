import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors'
import eventsRouter from './routes/events.routes.js'
import locationsRouter from './routes/locations.routes.js'

// import the router from your routes file


dotenv.config()

const PORT = process.env.PORT || 3000
// Allow binding to a specific host; default 0.0.0.0 to be accessible on the LAN
const HOST = process.env.HOST || '0.0.0.0'

const app = express()

app.use(express.json())
// Allow cross-origin during development so the client (vite) can call the API
app.use(cors())

// Mount API routes under /api
app.use('/api', eventsRouter)
app.use('/api', locationsRouter)

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'party.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'party.png')))
    app.use(express.static('public'))
}

// specify the api path for the server to use


if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, HOST, () => {
    const hostDisplay = HOST === '0.0.0.0' ? '0.0.0.0 (all interfaces)' : HOST
    console.log(`server listening on http://${hostDisplay}:${PORT}`)
})