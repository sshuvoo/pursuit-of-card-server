import { io } from '../index.js'
import { Game } from '../model/game-model.js'
import { randomPositionsSwap } from '../utils/random-positions-swap.js'
import { shuffleAndSplit } from '../utils/shuffle-and-split.js'

export const startGame = async (req, res) => {
   const cards = [
      'circle',
      'circle',
      'circle',
      'circle',
      'square',
      'square',
      'square',
      'square',
      'triangle',
      'triangle',
      'triangle',
      'triangle',
      'umbrella',
      'umbrella',
      'umbrella',
      'umbrella',
      'star',
      'star',
      'star',
      'star'
   ]
   const shuffledCards = shuffleAndSplit(cards)
   const randomIndex = Math.floor(Math.random() * shuffledCards.length)
   shuffledCards[randomIndex].push('phantom')

   try {
      const game_id = req.body.game_id
      if (!game_id)
         return res.status(400).send({ message: 'Game id is required' })
      const game = await Game.findOne({ game_id })
      if (game.player.length === 5) {
         const shuffledPlayer = randomPositionsSwap(game.player).sort(
            (a, b) => a.position - b.position
         )
         game.player = shuffledPlayer.map((p, i) => ({
            ...p,
            turn: shuffledCards[i].length === 5,
            cards: shuffledCards[i]
         }))
         const updatedGame = await game.save()

         io.emit(`game-start-${game_id}`)
         io.emit(`pursuit-of-card-${game_id}`, updatedGame)
         return res.send(updatedGame)
      } else {
         return res.status(400).send({ message: 'Please add five players' })
      }
   } catch (error) {
      console.log(error)
      return res.status(500).send({ message: 'Internal server error' })
   }
}
