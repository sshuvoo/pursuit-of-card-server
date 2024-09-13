import { Router } from 'express'
import { authenticate } from '../controller/authenticate.js'
import { authentication } from '../controller/authentication.js'
import { createGame } from '../controller/create-game.js'
import { getGame } from '../controller/get-game.js'
import { guestLogin } from '../controller/guest-login.js'
import { joinGame } from '../controller/join-game.js'
import { makeMove } from '../controller/make-a-move.js'
import { resetGame } from '../controller/restart-game.js'
import { startGame } from '../controller/start-game.js'
import { sendMessage } from '../controller/send-message.js'

export const api = Router()

api.post('/create-game', [authenticate, createGame])
api.post('/send-message', [authenticate, sendMessage])
api.post('/guest-login', guestLogin)

api.put('/join-game', [authenticate, joinGame])
api.put('/start-game', [authenticate, startGame])
api.put('/restart-game', [authenticate, resetGame, startGame])
api.put('/make-move', [authenticate, makeMove])

api.get('/authentication', authentication)
api.get('/get-game/:game_id', [authenticate, getGame])
api.get('/', (req, res) =>
   res.send({ message: 'Welcome to Pursuit of Card API' })
)
