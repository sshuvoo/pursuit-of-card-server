export function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
   }
   return array
}

export function shuffleAndSplit(cards) {
   const shuffledCards = shuffleArray(cards)
   const result = []

   for (let i = 0; i < 5; i++) {
      result.push(shuffledCards.slice(i * 4, i * 4 + 4))
   }
   return result
}
