import { IAxiosErrorData } from './APIRequestsHandling/types'

export type ReducerErrorProperty = null | IAxiosErrorData

export interface IBaseReducer<T> {
  data: T
  isLoading: boolean
  error: ReducerErrorProperty
}

export interface IBaseReducerTwo<T extends INormalizedReducerShape<any>> {
  data: T
  isLoading: boolean
  error: ReducerErrorProperty
}

export interface INormalizedReducerShape<T> {
  byId: { [key: string]: T }
  allIds: string[]
  subGroupings: { [key: string]: string[] }
}
