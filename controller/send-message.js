import { io } from '../index.js'
import { Game } from '../model/game-model.js'

export async function sendMessage(req, res) {
   const message = req.body.message
   const game_id = req.body.game_id
   if (!message || !game_id)
      return res.status(400).send('GameID or message is missing')
   try {
      const game = await Game.findOne({
         game_id,
         'player.guest_id': req.guest_id
      })
      if (!game) return res.status(404).send('Game not found')
      io.emit(`game-chat-${game_id}`, { message, guest_id: req.guest_id })
      return res.send({ message: 'Message sent successfully' })
   } catch (error) {
      return res.status(500).send({ message: 'Internal server error' })
   }
}
