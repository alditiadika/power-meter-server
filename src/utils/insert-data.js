export const insertData = (arr, index, ...data) => {
  const dataMutated = arr.map(i => i)
  dataMutated.splice(index, 0, ...data)
  return dataMutated
}