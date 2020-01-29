import { INormalizedReducerShape } from './reducer.base'
import { IObjectWithIdProperty } from '../shared-client-types'

export function normalizeData<T extends IObjectWithIdProperty>(
  data: T[],
  subGroupingKey?: string,
  currentNormalizedData: INormalizedReducerShape<
    T
  > = {} as INormalizedReducerShape<T>
): INormalizedReducerShape<T> {
  let normalizedData: INormalizedReducerShape<T>
  const existsNormalizedData: boolean = currentNormalizedData.byId !== undefined
  if (existsNormalizedData) {
    normalizedData = currentNormalizedData
  } else {
    normalizedData = {
      byId: {},
      allIds: [],
      subGroupings: {}
    }
  }

  if (subGroupingKey !== undefined) {
    normalizedData.subGroupings = {}
    normalizedData.subGroupings[subGroupingKey] = []
  }
  for (let i = 0; i < data.length; ++i) {
    const { id } = data[i]
    if (existsNormalizedData && normalizedData.byId[id] === undefined) {
      normalizedData.allIds.push(id)
    }
    normalizedData.byId[id] = data[i]
    if (subGroupingKey !== undefined)
      normalizedData.subGroupings[subGroupingKey].push(id)
  }
  return normalizedData
}
