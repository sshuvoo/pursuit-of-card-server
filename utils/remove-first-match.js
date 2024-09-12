export const removeFirstMatch = (arr, element) => {
   const newArr = [...arr]
   const index = newArr.indexOf(element)
   if (index !== -1) newArr.splice(index, 1)
   return newArr
}
