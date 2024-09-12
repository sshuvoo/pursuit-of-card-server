import jwt from 'jsonwebtoken'

export const authentication = (req, res) => {
   const token = req.headers.authorization
   if (token) {
      const access_token = token.split(' ')[1]
      if (access_token) {
         const decode = jwt.verify(access_token, process.env.SECRET_KEY)
         if (decode) {
            return res.send({
               guest_id: decode.guest_id,
               guest_name: decode.guest_name
            })
         } else {
            return res
               .status(401)
               .send({ message: 'Please login to play game' })
         }
      } else {
         return res.status(401).send({ message: 'Please login to play game' })
      }
   } else {
      return res.status(401).send({ message: 'Please login to play game' })
   }
}
