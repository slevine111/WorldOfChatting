export interface IObjectWithIdProperty {
  id: string
  [key: string]: any
}

export interface IObjectOfOneType<T> {
  [key: string]: T
}
