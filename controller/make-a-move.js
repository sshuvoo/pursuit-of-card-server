import { io } from '../index.js'
import { Game } from '../model/game-model.js'
import { checkWin } from '../utils/check-win.js'
import { removeFirstMatch } from '../utils/remove-first-match.js'

export async function makeMove(req, res) {
   const card = req.body.card
   const position = req.body.position
   const game_id = req.body.game_id
   if (!card || !position || !game_id)
      return res.status(400).send('GameID, card or position is missing')
   try {
      const game = await Game.findOne({
         game_id,
         'player.guest_id': req.guest_id
      })

      if (!game) {
         return res.status(404).send('Game not found')
      }
      const requestPlayer = game.player.find((p) => p.guest_id === req.guest_id)

      if (requestPlayer.cards.length < 5 || requestPlayer.cards.length > 5) {
         return res.status(404).send('Move not allowed')
      }
      let isPassed = false
      const winners = game.player
         .filter((p) => p?.status === 'winner')
         .map((p) => p.position)
      const lobbyPlayers = game.player
         .filter((p) => p?.status !== 'winner')
         .map((p) => p.position)
      const updatedPlayer = game.player.map((p) => {
         if (p?.status && p.status === 'winner') return p
         else if (p.guest_id === req.guest_id) {
            const restCards = removeFirstMatch(p.cards, card)
            const isWinner = checkWin(restCards)
            const win_rank = winners.length + 1
            return {
               ...p,
               cards: restCards,
               turn: false,
               status: isWinner ? 'winner' : 'playing',
               rank: isWinner ? win_rank : 0
            }
         } else if (
            isNextPlayer(position, p.position, lobbyPlayers) &&
            !isPassed
         ) {
            isPassed = true
            return {
               ...p,
               cards: [card, ...p.cards],
               turn: true,
               prev_receive: card
            }
         } else return p
      })
      game.player = updatedPlayer
      const updatedGame = await game.save()
      io.emit(`card-move-${game_id}`)
      io.emit(`pursuit-of-card-${game_id}`, updatedGame)
      const requestedPlayer = updatedGame.player.find(
         (p) => p.guest_id === req.guest_id
      )
      if (
         requestedPlayer &&
         requestedPlayer?.status &&
         requestedPlayer.status === 'winner'
      ) {
         io.emit(`victory-${game_id}`, {
            player_name: requestedPlayer.guest_name,
            rank: requestedPlayer.rank
         })
      }
      const newWinners = updatedPlayer.filter((p) => p?.status === 'winner')
      if (newWinners.length === 3) {
         io.emit(`game-over-${game_id}`)
      }
      return res.send(updatedGame)
   } catch (error) {
      return res.status(500).send({ message: 'Internal server error' })
   }
}

const isNextPlayer = (
   requestPlayerPosition,
   currentPlayerPosition,
   lobbyPositions
) => {
   const lobbyMax = Math.max(...lobbyPositions)
   const lobbyMin = Math.min(...lobbyPositions)
   if (
      (lobbyMax === requestPlayerPosition &&
         currentPlayerPosition === lobbyMin) ||
      (requestPlayerPosition < lobbyMax &&
         currentPlayerPosition > requestPlayerPosition)
   )
      return true
   else return false
}
