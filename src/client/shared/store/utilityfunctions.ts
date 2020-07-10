import { AnyAction, Reducer } from 'redux'
import {
  INormalizedReducerShape,
  MyReducerType,
  SubGroupingFunctionType,
} from './store.types'
import {
  DATA_REQUEST_FAILURE,
  RequestDataConstants,
  RequestDataSuccessConstants,
} from '../../store/APIRequestsHandling/types'
const { REFRESHING_ACCESS_TOKEN_REQUEST } = RequestDataConstants
const { USER_LOGGING_OUT_REQUEST_SUCCESS } = RequestDataSuccessConstants

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

  let { byId } = normalizedData
  for (let i = 0; i < dataArr.length; ++i) {
    const uniqueValue: string = dataArr[i][dataItemKey]
    if (byId[uniqueValue] === undefined) {
      normalizedData.allIds.push(uniqueValue)
    }
    normalizedData.byId[uniqueValue] = dataArr[i]
    if (subGroupingFunction !== undefined) {
      normalizedData = subGroupingFunction(normalizedData, dataArr[i])
    } else if (subGroupingKey !== undefined) {
      subGroupings[subGroupingKey].push(uniqueValue)
      normalizedData.subGroupings = subGroupings
    }
  }
  return normalizedData
}

export const deleteDataItem = <T>(
  itemIdDelete: string,
  reducerState: INormalizedReducerShape<T>
): INormalizedReducerShape<T> => {
  const { allIds, byId, subGroupings } = reducerState
  let newIdByObject: Record<string, T> = {}
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
  }
}

export const createInitialState = <T>(
  initialSubGroupingsKeys: string | string[] | Record<string, string> = []
): INormalizedReducerShape<T> => {
  let initialState: INormalizedReducerShape<T> = {
    byId: {},
    allIds: [],
    subGroupings: {},
  }

  let keysArr: string[]
  if (typeof initialSubGroupingsKeys === 'string') {
    keysArr = [initialSubGroupingsKeys]
  } else if (Array.isArray(initialSubGroupingsKeys)) {
    keysArr = initialSubGroupingsKeys
  } else {
    keysArr = Object.keys(initialSubGroupingsKeys).map(
      (key) => initialSubGroupingsKeys[key]
    )
  }
  for (let i = 0; i < keysArr.length; ++i) {
    initialState.subGroupings[keysArr[i]] = []
  }
  return initialState
}

export const createReducerSlice = <T, A extends AnyAction>(
  reducer: MyReducerType<T, A>,
  initialState: INormalizedReducerShape<T>
): Reducer<INormalizedReducerShape<T>, A> => {
  return (state: INormalizedReducerShape<T> | undefined, action: A) => {
    const resetStateToInitialState: boolean =
      (action.type === DATA_REQUEST_FAILURE &&
        action.event === REFRESHING_ACCESS_TOKEN_REQUEST) ||
      action.type === USER_LOGGING_OUT_REQUEST_SUCCESS

    if (resetStateToInitialState) {
      return { ...initialState }
    }
    return reducer(state, action)
  }
}

export const makeFunctionToAddIdToForeignKeySubGrouping = <
  T extends { id: string; [key: string]: any }
>(
  subGroupingPrefix: string,
  foreignKeyName: string
): SubGroupingFunctionType<T> => {
  return (currentData, dataItem) => {
    let updatedData: INormalizedReducerShape<T> = JSON.parse(
      JSON.stringify(currentData)
    )
    const { id } = dataItem
    const subGrouping: string = `${subGroupingPrefix}${dataItem[foreignKeyName]}`
    if (updatedData.subGroupings[subGrouping] !== undefined) {
      updatedData.subGroupings[subGrouping].push(id)
    } else {
      updatedData.subGroupings[subGrouping] = [id]
    }
    return updatedData
  }
}
