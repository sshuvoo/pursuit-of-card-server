export function getRandomCode(n = 5) {
   const chars = '0123456789'
   let code = ''
   for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      code += chars[randomIndex]
   }
   return code
}
