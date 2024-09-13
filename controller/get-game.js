import { Game } from '../model/game-model.js'

export const getGame = async (req, res) => {
   const game_id = req.params.game_id
   const guest_id = req.guest_id
   if (!game_id) return res.status(400).send('Game ID is required')

   try {
      const game = await Game.findOne({
         game_id,
         'player.guest_id': guest_id
      })

      if (!game) {
         return res.status(404).send('Game not found')
      }

      res.send(game)
   } catch (error) {
      res.status(500).send('Server error')
   }
}
