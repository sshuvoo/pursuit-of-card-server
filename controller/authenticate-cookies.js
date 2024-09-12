import jwt from 'jsonwebtoken'

export const authenticateViaCookies = (req, res, next) => {
   const access_token = decodeURIComponent(req.headers?.cookie)
      ?.split(';')[0]
      ?.split('=')[2]
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
}
