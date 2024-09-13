export function randomPositionsSwap(players) {
   const positions = players.map((item) => item.position)
   // Fisher-Yates Shuffle algorithm
   for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[positions[i], positions[j]] = [positions[j], positions[i]]
   }
   return players.map((item, index) => ({
      ...item,
      position: positions[index]
   }))
}
