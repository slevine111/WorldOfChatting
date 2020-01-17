import { IAxiosErrorData } from './APIRequestsHandling/types'

export type ReducerErrorProperty = null | IAxiosErrorData

export interface IBaseReducer<T> {
  data: T
  isLoading: boolean
  error: ReducerErrorProperty
}
