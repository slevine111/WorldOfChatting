import { IAxiosErrorData, IThunkReturnObject } from '../../store.types'

const TRIGGER_DATA_REQUEST = <const>'TRIGGER_DATA_REQUEST'
export type ActionOnTriggerDataRequest = {
  type: typeof TRIGGER_DATA_REQUEST
  eventTriggeringDataRequest: string
}

const DATA_REQUEST_FAILURE = <const>'DATA_REQUEST_FAILURE'
export type ActionOnDataRequestFailure = {
  type: typeof DATA_REQUEST_FAILURE
  error: IAxiosErrorData
  event: string
}

const DATA_REQUEST_SUCCESS = <const>'DATA_REQUEST_SUCESS'

export type APIMiddlewareActionReturns =
  | ActionOnTriggerDataRequest
  | ActionOnDataRequestFailure
  | { type: typeof REFRESHING_ACCESS_TOKEN_REQUEST }
  | { type: typeof DATA_REQUEST_SUCCESS }

const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'
export const addPostponnedAction = (postponnedAction: IThunkReturnObject) => ({
  type: ADD_POSTPONNED_ACTION,
  postponnedAction,
})
export type PostponnedActionAddAR = ReturnType<typeof addPostponnedAction>

const REFRESHING_ACCESS_TOKEN_REQUEST = <const>'REFRESHING_ACCESS_TOKEN_REQUEST'
const REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS = <const>(
  'REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS'
)
export const accessTokenRefreshed = (accessTokenExpireTime: number) => ({
  type: REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS,
  accessTokenExpireTime,
})
export type AccessTokenRefreshedAR = ReturnType<typeof accessTokenRefreshed>

export const ACTION_TYPES = <const>{
  TRIGGER_DATA_REQUEST,
  DATA_REQUEST_SUCCESS,
  DATA_REQUEST_FAILURE,
  ADD_POSTPONNED_ACTION,
  REFRESHING_ACCESS_TOKEN_REQUEST,
  REFRESHING_ACCESS_TOKEN_REQUEST_SUCCESS,
}
