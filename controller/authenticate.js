import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
   const token = req.headers.authorization
   if (token) {
      const access_token = token.split(' ')[1]
      if (access_token) {
         const decode = jwt.verify(access_token, process.env.SECRET_KEY)
         if (decode) {
            req.guest_id = decode.guest_id
            req.guest_name = decode.guest_name
            next()
         } else {
            res.status(401).send({ message: 'Please login to play game' })
         }
      } else {
         res.status(401).send({ message: 'Please login to play game' })
      }
   } else {
      res.status(401).send({ message: 'Please login to play game' })
   }
}
