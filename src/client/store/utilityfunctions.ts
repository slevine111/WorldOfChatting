import { Reducer } from 'redux'
import { INormalizedReducerShape } from './reducer.base'
import {
  DATA_REQUEST_FAILURE,
  RequestDataConstants,
  RequestDataSuccessConstants
} from './APIRequestsHandling/types'
import { SharedActionsTypes } from './APIRequestsHandling/multiplereduceractions'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants
const { USER_LOGGING_OUT_REQUEST_SUCCESS } = RequestDataSuccessConstants

export function normalizeData<T extends { [key: string]: any }>(
  data: T[],
  optionalParams: {
    subGroupingKey?: string
    subGroupingFunction?: (
      subGroupings: Record<string, string[]>,
      dataItem: T
    ) => Record<string, string[]>
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
      !existsNormalizedData ||
      (existsNormalizedData && normalizedData.byId[uniqueValue] === undefined)
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
  initialSubGroupingsKey: string = ''
): INormalizedReducerShape<T> => {
  let initialState: INormalizedReducerShape<T> = {
    byId: {},
    allIds: [],
    subGroupings: {}
  }
  if (initialSubGroupingsKey !== '') {
    initialState.subGroupings[initialSubGroupingsKey] = []
  }
  return initialState
}

export const createReducerSlice = <T>(
  reducer: Reducer<INormalizedReducerShape<T>>,
  initialSubGroupingsKey: string = ''
): Reducer<INormalizedReducerShape<T>> => {
  let initialState: INormalizedReducerShape<T> = createInitialState(
    initialSubGroupingsKey
  )
  return (
    state: INormalizedReducerShape<T> = initialState,
    action: any
  ): INormalizedReducerShape<T> => {
    if (checkIfActionResetsToInitialState(action)) {
      return { ...initialState }
    }
    return reducer(state, action)
  }
}
