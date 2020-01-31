import { INormalizedReducerShape } from './reducer.base'

export function normalizeData<T extends { [key: string]: any }>(
  data: T[],
  optionalParams: {
    subGroupingKey?: string
    subGroupingFunction?: (
      subGroupings: { [key: string]: string[] },
      dataItem: T
    ) => { [key: string]: string[] }
    currentNormalizedData?: INormalizedReducerShape<T>
    dataItemKey?: string
  } = {}
): INormalizedReducerShape<T> {
  const {
    subGroupingKey,
    subGroupingFunction,
    currentNormalizedData
  } = optionalParams
  let normalizedData: INormalizedReducerShape<T>
  if (currentNormalizedData !== undefined) {
    normalizedData = currentNormalizedData
  } else {
    normalizedData = {
      byId: {},
      allIds: [],
      subGroupings: {}
    }
  }

  if (
    subGroupingKey !== undefined &&
    normalizedData.subGroupings[subGroupingKey] === undefined
  ) {
    normalizedData.subGroupings[subGroupingKey] = []
  }
  const existsNormalizedData: boolean = currentNormalizedData !== undefined
  const dataItemKey: string = optionalParams.dataItemKey || 'id'
  for (let i = 0; i < data.length; ++i) {
    const uniqueValue: string = data[i][dataItemKey]
    if (
      existsNormalizedData &&
      normalizedData.byId[uniqueValue] === undefined
    ) {
      normalizedData.allIds.push(uniqueValue)
    }
    normalizedData.byId[uniqueValue] = data[i]
    if (subGroupingKey !== undefined) {
      normalizedData.subGroupings[subGroupingKey].push(uniqueValue)
    } else if (subGroupingFunction !== undefined) {
      const { subGroupings } = normalizedData
      normalizedData.subGroupings = subGroupingFunction(subGroupings, data[i])
    }
  }
  return normalizedData
}
