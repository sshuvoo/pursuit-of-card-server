import jwt from 'jsonwebtoken'
import { getRandomCode } from '../utils/get-random-code.js'

export const guestLogin = async (req, res) => {
   try {
      const guest_name = req.body.guest_name
      if (!guest_name)
         return res.status(400).send({ message: 'Guest name is required' })
      const guest_id = `${guest_name
         .toLowerCase()
         .split(' ')
         .join('_')}-${getRandomCode(10)}-${Date.now()}`
      const token = jwt.sign({ guest_name, guest_id }, process.env.SECRET_KEY, {
         expiresIn: '30d'
      })
      res.cookie('access_token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
         maxAge: 30 * 24 * 60 * 60 * 1000
      })
      res.status(201).send({ message: 'Guest login successful' })
   } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Internel server error' })
   }
}
