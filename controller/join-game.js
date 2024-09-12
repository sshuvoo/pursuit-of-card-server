import { io } from '../index.js'
import { Game } from '../model/game-model.js'

export const joinGame = async (req, res) => {
   try {
      const game_id = req.body?.game_id
      if (game_id) {
         const game = await Game.findOne({ game_id })
         if (!game) {
            return res.status(404).send({ message: 'Game not found' })
         }
         const existingPlayer = game.player.find(
            (player) => player.guest_id === req.guest_id
         )
         if (existingPlayer) {
            return res.send({ message: 'Player already in the game' })
         }

         if (game.player.length >= 5) {
            return res
               .status(409)
               .send({ message: 'No space for more players' })
         }
         const newPosition = game.player[game.player.length - 1].position + 1
         const newPlayer = {
            guest_id: req.guest_id,
            guest_name: req.guest_name,
            position: newPosition,
            turn: false,
            role: 'general-player'
         }
         game.player.push(newPlayer)
         const updatedGame = await game.save()
         io.emit(`pursuit-of-card-${game_id}`, updatedGame)
         return res.send({
            message: 'Player joined successfully',
            updatedGame
         })
      } else {
         res.status(400).send({ message: 'Game id is required' })
      }
   } catch (error) {
      console.error(error)
      return res
         .status(500)
         .send({ message: 'An error occurred while creating the game' })
   }
}
