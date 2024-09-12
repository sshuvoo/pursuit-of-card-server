import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { api } from './api/api.js'
import { dbConnect } from './db/dbConnect.js'

const app = express()
const server = createServer(app)
dotenv.config()
export const io = new Server(server, {
   cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
   }
})

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.static('public'))
app.use(express.json())

app.use('/api', api)

dbConnect(process.env.DB_NAME)

io.on('connection', (socket) => {
   console.log('a user connected')
   socket.on('disconnect', () => {
      console.log('user disconnected')
   })
})

server.listen(process.env.PORT, () => {
   console.log(`Server is running on port ${process.env.PORT}`)
})
