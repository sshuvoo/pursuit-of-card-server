export function checkWin(arr) {
   return arr.every((element) => arr[0] === element) && arr.length === 4
}
