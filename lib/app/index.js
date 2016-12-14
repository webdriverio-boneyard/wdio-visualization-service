import path from 'path'
import http from 'http'
import express from 'express'
import socketio from 'socket.io'

const app = express()
const server = http.Server(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

export const run = (port = 3000) => {
    return new Promise((resolve) => server.listen(port, resolve))
}

export const getSocket = () => {
    return new Promise((resolve) => io.on('connection', () => resolve(io)))
}

/**
 * start server it called directly
 */
if (require.main === module) {
    console.log('Example app listening on port 3000!')
    run()
}
