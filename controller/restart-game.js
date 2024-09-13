import { Game } from '../model/game-model.js'

export const resetGame = async (req, res, next) => {
   try {
      const game_id = req.body.game_id
      if (!game_id)
         return res.status(400).send({ message: 'Game id is required' })
      const game = await Game.findOne({ game_id })
      game.player = game.player.map((p) => ({
         guest_id: p.guest_id,
         guest_name: p.guest_name,
         position: p.position,
         turn: false,
         role: p.role
      }))
      const updatedGame = await game.save()
      if (updatedGame) next()
   } catch (error) {
      return res.status(500).send({ message: 'Internal server error' })
   }
}
