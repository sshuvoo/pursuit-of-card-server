import { Game } from '../model/game-model.js'
import { getRandomCode } from '../utils/get-random-code.js'

export const createGame = async (req, res) => {
   try {
      if (req?.guest_id) {
         let re_request = true
         while (re_request) {
            const game_id = getRandomCode(6)
            const docExists = await Game.exists({ game_id })
            if (!docExists) {
               re_request = false
               const newGame = await Game.create({
                  game_id,
                  player: [
                     {
                        guest_id: req.guest_id,
                        guest_name: req.guest_name,
                        position: 1,
                        turn: false,
                        role: 'host-player'
                     }
                  ]
               })
               if (newGame) {
                  res.send(newGame)
               } else res.status(500).send({ message: 'Internal server error' })
            }
         }
      } else {
         res.status(401).send({
            message: 'Please log in to access this resource.'
         })
      }
   } catch (error) {
      console.error(error)
      return res
         .status(500)
         .send({ message: 'An error occurred while creating the game' })
   }
}
