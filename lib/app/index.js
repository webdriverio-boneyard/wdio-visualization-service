import path from 'path'
import http from 'http'
import express from 'express'
import socketio from 'socket.io'

const app = express()
const server = http.Server(app)
const io = socketio(server)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

export const run = (port = 3000) => {
    return new Promise((resolve) => server.listen(port, resolve))
}

export const getSocket = () => {
    return new Promise((resolve) => io.on('connection', () => resolve(io)))
}

// server.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })
