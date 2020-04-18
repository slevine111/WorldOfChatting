import { Reducer } from 'redux'
import { INormalizedReducerShape } from './reducer.base'
import {
  DATA_REQUEST_FAILURE,
  RequestDataConstants,
  RequestDataSuccessConstants,
} from './APIRequestsHandling/types'
import { SharedActionsTypes } from './APIRequestsHandling/multiplereduceractions'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants
const { USER_LOGGING_OUT_REQUEST_SUCCESS } = RequestDataSuccessConstants

export type SubGroupingFunctionType<T> = (
  subGroupings: Record<string, string[]>,
  dataItem: T
) => Record<string, string[]>

export function normalizeData<T extends { [key: string]: any }>(
  data: T | T[],
  currentNormalizedData: INormalizedReducerShape<T>,
  optionalParams: {
    subGroupingKey?: string
    subGroupingFunction?: SubGroupingFunctionType<T>
    dataItemKey?: string
  } = {}
): INormalizedReducerShape<T> {
  const dataArr: T[] = Array.isArray(data) ? data : [data]
  const { subGroupingKey, subGroupingFunction } = optionalParams
  let normalizedData: INormalizedReducerShape<T> = JSON.parse(
    JSON.stringify(currentNormalizedData)
  )
  let { subGroupings } = normalizedData
  const dataItemKey: string = optionalParams.dataItemKey || 'id'

  if (
    subGroupingKey !== undefined &&
    subGroupings[subGroupingKey] === undefined
  ) {
    subGroupings[subGroupingKey] = []
  }

  let { byId, allIds } = normalizedData
  for (let i = 0; i < dataArr.length; ++i) {
    const uniqueValue: string = dataArr[i][dataItemKey]
    if (byId[uniqueValue] === undefined) {
      allIds.push(uniqueValue)
    }
    byId[uniqueValue] = dataArr[i]
    if (subGroupingFunction !== undefined) {
      subGroupings = subGroupingFunction(subGroupings, dataArr[i])
    } else if (subGroupingKey !== undefined) {
      subGroupings[subGroupingKey].push(uniqueValue)
    }
  }
  normalizedData.subGroupings = subGroupings
  return normalizedData
}

export const deleteDataItem = <T extends INormalizedReducerShape<K>, K>(
  itemIdDelete: string,
  reducerState: T
): T => {
  const { allIds, byId, subGroupings } = reducerState
  let newIdByObject: Record<string, K> = {}
  let newAllIdArr: string[] = []
  for (let i = 0; i < allIds.length; ++i) {
    if (reducerState.allIds[i] !== itemIdDelete) {
      const currentId: string = allIds[i]
      newIdByObject[currentId] = byId[currentId]
      newAllIdArr.push(currentId)
    }
  }
  return {
    byId: newIdByObject,
    allIds: newAllIdArr,
    subGroupings: JSON.parse(JSON.stringify(subGroupings)),
  } as T
}

export const checkIfActionResetsToInitialState = (
  action: SharedActionsTypes
): boolean => {
  return (
    (action.type === DATA_REQUEST_FAILURE &&
      action.event === REFRESHING_ACCESS_TOKEN_REQUEST) ||
    action.type === USER_LOGGING_OUT_REQUEST_SUCCESS
  )
}

export const createInitialState = <T>(
  initialSubGroupingsKeys: string | string[] = []
): INormalizedReducerShape<T> => {
  let initialState: INormalizedReducerShape<T> = {
    byId: {},
    allIds: [],
    subGroupings: {},
  }
  const keysArr: string[] = Array.isArray(initialSubGroupingsKeys)
    ? initialSubGroupingsKeys
    : [initialSubGroupingsKeys]
  for (let i = 0; i < keysArr.length; ++i) {
    initialState.subGroupings[keysArr[i]] = []
  }
  return initialState
}

export const createReducerSlice = <T>(
  reducer: Reducer<INormalizedReducerShape<T>>,
  initialSubGroupingsKeys: string | string[] = []
): Reducer<INormalizedReducerShape<T>> => {
  let initialState: INormalizedReducerShape<T> = createInitialState(
    initialSubGroupingsKeys
  )
  return (
    state: INormalizedReducerShape<T> = JSON.parse(
      JSON.stringify(initialState)
    ),

    action: any
  ): INormalizedReducerShape<T> => {
    if (checkIfActionResetsToInitialState(action)) {
      return { ...initialState }
    }
    return reducer(state, action)
  }
}
