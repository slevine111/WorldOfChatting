export interface IGroupedArraysAndObjects {
  arrays: any[][]
  objects: object[]
}

export const checkIfDataExists = (input: IGroupedArraysAndObjects): boolean => {
  const { arrays, objects } = input
  for (let i = 0; i < arrays.length; ++i) {
    if (!arrays[i].length) return false
  }
  for (let i = 0; i < objects.length; ++i) {
    if (!Object.keys(objects[i]).keys) return false
  }
  return true
}
