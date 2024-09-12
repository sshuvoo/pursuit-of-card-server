export const getRandomCardSet = (cards, n) => {
   const newSet = []
   while (newSet.length <= n) {
      const randomIndex = Math.floor(Math.random() * cards.length)
      newSet.push(cards[randomIndex])
   }
   return newSet
}
