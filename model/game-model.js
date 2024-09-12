import { model, Schema } from 'mongoose'

const playerSchema = Schema({
   guest_id: {
      type: String,
      required: true
   },
   guest_name: {
      type: String,
      required: true
   },
   position: {
      type: Number,
      required: true
   },
   turn: {
      type: Boolean,
      required: true
   },
   role: {
      type: String,
      required: true
   },
   prev_move: String,
   prev_receive: String,
   cards: [String],
   status: {
      type: String,
      enum: ['playing', 'winner', 'loser']
   },
   rank: Number
})

const gameSchema = Schema(
   {
      game_id: {
         type: String,
         required: true
      },
      player: [playerSchema]
   },
   { timestamps: true }
)

export const Game = model('Game', gameSchema)
