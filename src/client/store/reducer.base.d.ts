import { IAxiosErrorData } from './APIRequestsHandling/types'

export type ReducerErrorProperty = null | IAxiosErrorData

export interface INormalizedReducerShape<T> {
  byId: Record<string, T>
  allIds: string[]
  subGroupings: Record<string, string[]>
}
