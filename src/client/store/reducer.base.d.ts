import { IAxiosErrorData } from './APIRequestsHandling/types'

export type ReducerErrorProperty = null | IAxiosErrorData

export interface INormalizedReducerShape<T> {
  byId: { [key: string]: T }
  allIds: string[]
  subGroupings: { [key: string]: string[] }
}
